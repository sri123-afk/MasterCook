from flask import Flask, request, jsonify, send_from_directory, render_template, redirect, url_for
from flask_jwt_extended import JWTManager, create_refresh_token, jwt_required, create_access_token, get_jwt_identity
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import re
from flask_cors import CORS
import os  # Import the os module

app = Flask(__name__, static_url_path="/", static_folder="./client/build")
CORS(app)

# JWT secret key
app.config['JWT_SECRET_KEY'] = 'your_secret_key'
JWTManager(app)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017')
db = client['myDatabase']
users_collection = db['myUsersCollection']
recipes_collection = db['myCollection']  # Assuming this is where your recipe dataset is stored

# Function to load CSV file into MongoDB collection
def load_csv_to_mongodb(collection_name):
    csv_file_path = 'newFoodFV2.csv'  # Update with your CSV file name
    df = pd.read_csv(csv_file_path)
    data = df.to_dict(orient='records')

    # Check if collection already exists
    if collection_name.count_documents({}) == 0:
        # Collection doesn't exist, insert data
        collection_name.insert_many(data)
        return "CSV file successfully loaded into MongoDB collection."
    else:
        return "Collection already exists. CSV file not loaded."

# Load CSV file into MongoDB collection when the script is executed
print(load_csv_to_mongodb(recipes_collection))

# Preprocess text
def preprocess_text(text):
    cleaned_text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return cleaned_text.lower()

# Retrieve and preprocess data from MongoDB collection
def retrieve_and_preprocess_data(collection):
    df = pd.DataFrame(list(collection.find()))
    df['preprocessed_ingredients'] = df['ingredients'].apply(preprocess_text)
    df['combined_features'] = df['preprocessed_title'] + ' ' + df['preprocessed_ingredients']
    return df

# Create TF-IDF matrix
def create_tfidf_matrix(df):
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(df['combined_features'])
    return tfidf_vectorizer, tfidf_matrix

# Recommend recipes based on user cuisines
def recommend_recipes(user_cuisines):
    df = pd.DataFrame(list(recipes_collection.find()))
    df['preprocessed_ingredients'] = df['ingredients'].apply(preprocess_text)
    df['combined_features'] = df['preprocessed_title'] + ' ' + df['preprocessed_ingredients']
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(df['combined_features'])
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    random_recipe_index = np.random.choice(df.index)
    sim_scores = list(enumerate(cosine_sim[random_recipe_index]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    recipe_indices = [i[0] for i in sim_scores]
    popular_recipes = df.iloc[recipe_indices].sort_values(by=['aggregateLikes', 'spoonacularScore'], ascending=False)
    cuisine_recipes = popular_recipes[popular_recipes['cuisines'].isin(user_cuisines)].head(10)
    return cuisine_recipes[['title', 'cuisines', 'ingredients', 'formatted_instructions', 'image', 'aggregateLikes', 'spoonacularScore','difficulty_level', 'flavor_profile','pricePerServing','readyInMinutes','calories', 'Protein', 'Vitamin_C','Fiber']].to_dict(orient='records')

# Recommend recipes based on user input
def recommend_based_on_input_partial(user_input, num_results=10):
    # Retrieve and preprocess data
    df = retrieve_and_preprocess_data(recipes_collection)
    tfidf_vectorizer, tfidf_matrix = create_tfidf_matrix(df)
    
    # Check if the input contains special characters (excluding spaces)
    if re.search(r'[^a-zA-Z0-9\s]', user_input):
        return {'Error': 'Input contains invalid characters'}

    # Preprocess the user input to remove special characters but keep spaces
    preprocessed_input = re.sub(r'[^a-zA-Z0-9\s]', '', user_input.lower())

    # Vectorize the preprocessed input using the same vectorizer
    input_vector = tfidf_vectorizer.transform([preprocessed_input])

    # Calculate cosine similarity between input and all recipe titles
    cosine_similarities = linear_kernel(input_vector, tfidf_matrix)

    # Get indices of recipes sorted by similarity
    similar_recipe_indices = cosine_similarities.argsort()[0][::-1]

    # Filter recipes based on similarity score and presence of any input word in the title
    matching_indices = []
    for idx in similar_recipe_indices:
        title = df.iloc[idx]['combined_features']
        # Check if a significant portion of the user's input is present in the title
        if sum(word in title for word in preprocessed_input.split()) / len(preprocessed_input.split()) > 0.3:
            matching_indices.append(idx)

    # Check if there are matching recipes
    if matching_indices:
        # Get the top N similar recipes
        top_similar_recipes = df.iloc[matching_indices[:num_results]]
        return top_similar_recipes[['title', 'cuisines', 'ingredients', 'formatted_instructions', 'image', 'aggregateLikes', 'spoonacularScore','difficulty_level', 'flavor_profile','pricePerServing','readyInMinutes','calories', 'Protein', 'Vitamin_C','Fiber']].to_dict(orient='records')
    else:
        return {'Error': 'No recipes were found. Please try again.'}

# Categorize unique ingredients
vegetables = ['asparagus', 'broccoli', 'carrot', 'celery', 'cucumber', 'eggplant', 'green bean', 'lettuce', 'mushroom', 'onion', 'potato', 'spinach', 'tomato', 'zucchini']
meat = ['fish', 'beef', 'chicken', 'pork', 'lamb', 'turkey', 'duck', 'bacon', 'sausage', 'ham', 'salami', 'pepperoni', 'tuna', 'anchovies']

# Function to recommend recipes based on user-selected ingredients
def recommend_recipes_based_on_ingredients(user_selected_ingredients):
    # Retrieve and preprocess data
    df = retrieve_and_preprocess_data(recipes_collection)
    tfidf_vectorizer, tfidf_matrix = create_tfidf_matrix(df)
    
    # Transform user-selected ingredients into a single string
    user_ingredients_string = ' '.join(preprocess_text(ingredient) for ingredient in user_selected_ingredients)
    # Transform user-selected ingredients using TF-IDF vectorizer
    user_ingredients_vectorized =     tfidf_vectorizer.transform([user_ingredients_string])
    # Calculate cosine similarity between user ingredients and all recipes
    similarity_scores = linear_kernel(user_ingredients_vectorized, tfidf_matrix).flatten()
    # Get indices of top similar recipes
    top_indices = similarity_scores.argsort()[:-11:-1]  # Top 10 recommendations
    # Return the top 10 most similar recipes
    recommended_recipes = df.iloc[top_indices]
    return recommended_recipes[['title', 'cuisines', 'ingredients', 'formatted_instructions', 'image', 'aggregateLikes', 'spoonacularScore','difficulty_level', 'flavor_profile','pricePerServing','readyInMinutes','calories', 'Protein', 'Vitamin_C','Fiber']].to_dict(orient='records')

class User:
    def __init__(self, username, email, password, cuisines):  
        self.username = username
        self.email = email
        self.password = password
        self.cuisines = cuisines  

    def save_to_db(self):
        existing_user = users_collection.find_one({"username": self.username})
        if existing_user:
            # Update existing user document
            users_collection.update_one({"username": self.username}, {"$set": {
                "email": self.email,
                "password": self.password,
                "cuisines": self.cuisines
            }})
        else:
            # Insert new user document
            users_collection.insert_one({
                "username": self.username,
                "email": self.email,
                "password": self.password,
                "cuisines": self.cuisines
            })

    @classmethod
    def find_by_username(cls, username):
        user_data = users_collection.find_one({"username": username})
        if user_data:
            return cls(
                username=user_data.get("username"),
                email=user_data.get("email"),
                password=user_data.get("password"),
                cuisines=user_data.get("cuisines", [])
            )
        return None



@app.route("/signup", methods=['POST'])
def sign_up():
    data = request.get_json()

    username = data.get("username")

    # Check if the user already exists
    if users_collection.find_one({"username": username}):
        return jsonify({"message": f"User with username {username} already exists"}), 400

    # Hash the password before storing
    hashed_password = generate_password_hash(data.get("password"))

    new_user = User(
        username=data.get("username"),
        email=data.get("email"),
        password=hashed_password,
        cuisines=data.get("cuisines"),  # Add cuisines to the User object
    )

    # Insert the new user document into MongoDB
    new_user.save_to_db()

    return jsonify({"message": "User created successfully"}), 201


@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    # Retrieve user from MongoDB
    user = User.find_by_username(username)

    if user and check_password_hash(user.password, password):
        # Generate access token
        access_token = create_access_token(identity=user.username)
        refresh_token = create_refresh_token(identity=user.username)
        return jsonify({"access_token": access_token, "refresh_token": refresh_token}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401

@app.route("/refresh", methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify({"access_token": new_access_token}), 200

@app.route('/logout', methods=['POST'])
@jwt_required()  # Requires authentication for this route
def logout():
    return jsonify({"message": "Successfully logged out"}), 200

# Route for user's index page
@app.route('/home')
@jwt_required()  # Requires authentication for this route
def index():
    user = User.find_by_username(get_jwt_identity())
    if user:
        user_cuisines = user.cuisines
        recommendations = recommend_recipes(user_cuisines)
        return jsonify(recommendations=recommendations)
    else:
        return jsonify(error="User not found"), 404

# Route for searching recipes
@app.route('/search', methods=['POST'])
@jwt_required()  # Requires authentication for this route
def search():
    user_input = request.form['search']
    num_results = 10  # You can adjust this number as needed
    recommendations = recommend_based_on_input_partial(user_input, num_results)
    return jsonify(recommendations=recommendations)

# Route for chef page
@app.route('/chef', methods=['POST'])
@jwt_required()  # Requires authentication for this route
def chef():
    user_selected_ingredients = request.json.get('ingredients')
    if user_selected_ingredients:
        recommendations = recommend_recipes_based_on_ingredients(user_selected_ingredients)
        return jsonify(recommendations=recommendations)
    return jsonify(error="Invalid request"), 400

@app.route('/cuisine_preferences', methods=['POST', 'GET'])
@jwt_required() # Requires authentication for this route
def cuisine_preferences():
    if request.method == 'POST':
        cuisines = request.json.get('cuisines')
        if cuisines:
            current_username = get_jwt_identity()
            user = User.find_by_username(current_username)
            if user:
                user.cuisines = cuisines
                user.save_to_db()
                return jsonify(message="Cuisine preferences updated successfully")
            else:
                return jsonify(error="User not found"), 404
        return jsonify(error="Invalid request"), 400
    elif request.method == 'GET':
        current_username = get_jwt_identity()
        user = User.find_by_username(current_username)
        if user:
            return jsonify(cuisines=user.cuisines)
        else:
            return jsonify(error="User not found"), 404

# Route for serving static files
# Serve the React application for all routes not explicitly defined
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_static(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True)


