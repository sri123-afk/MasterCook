from flask import Flask, render_template, request, redirect, url_for  # Add 'redirect' and 'url_for'
from pymongo import MongoClient
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient('mongodb+srv://sriharish2019357:12345@mastercook.6oxadko.mongodb.net/test')
db = client['test']
collection = db['myCollection']


def retrieve_and_preprocess_data(collection):
    df = pd.DataFrame(list(collection.find()))
    df['preprocessed_ingredients'] = df['ingredients'].apply(preprocess_text)
    df['combined_features'] = df['preprocessed_title'] + ' ' + df['preprocessed_ingredients']
    return df

def create_tfidf_matrix(df):
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(df['combined_features'])
    return tfidf_vectorizer, tfidf_matrix


# Function to clean and preprocess user input
def preprocess_text(text):
    cleaned_text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return cleaned_text.lower()

# Categorize unique ingredients
vegetables = ['asparagus', 'broccoli', 'carrot', 'celery', 'cucumber', 'eggplant', 'green bean', 'lettuce', 'mushroom', 'onion', 'potato', 'spinach', 'tomato', 'zucchini']
meat = ['fish', 'beef', 'chicken', 'pork', 'lamb', 'turkey', 'duck', 'bacon', 'sausage', 'ham', 'salami', 'pepperoni', 'tuna', 'anchovies']

# Route for home page
@app.route('/')
def index():
    return render_template('index.html', vegetables=vegetables, meat=meat)

# Route to handle form submission
@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    user_selected_ingredients = request.form.getlist('ingredients')
    recommendations = recommend_recipes_based_on_ingredients(user_selected_ingredients)
    return render_template('recommendations.html', recommendations=recommendations)


@app.route('/search', methods=['GET', 'POST'])
def search():
    if request.method == 'POST':
        user_input = request.form['recipe_title']
        recommendations = recommend_based_on_input(user_input)
        return render_template('search_results.html', recommendations=recommendations)
    return redirect(url_for('index'))  # Redirect to index page for GET requests

# Function to redirect to search results
@app.route('/search_results', methods=['POST'])
def search_results():
    user_input = request.form['recipe_title']
    recommendations = recommend_based_on_input(user_input)
    return render_template('search_results.html', recommendations=recommendations)


# Function to recommend recipes based on user-selected ingredients
def recommend_recipes_based_on_ingredients(user_selected_ingredients):
    # Retrieve and preprocess data
    df = retrieve_and_preprocess_data(collection)
    tfidf_vectorizer, tfidf_matrix = create_tfidf_matrix(df)
    
    # Transform user-selected ingredients into a single string
    user_ingredients_string = ' '.join(preprocess_text(ingredient) for ingredient in user_selected_ingredients)
    # Transform user-selected ingredients using TF-IDF vectorizer
    user_ingredients_vectorized = tfidf_vectorizer.transform([user_ingredients_string])
    # Calculate cosine similarity between user ingredients and all recipes
    similarity_scores = linear_kernel(user_ingredients_vectorized, tfidf_matrix).flatten()
    # Get indices of top similar recipes
    top_indices = similarity_scores.argsort()[:-11:-1]  # Top 10 recommendations
    # Return the top 10 most similar recipes
    recommended_recipes = df.iloc[top_indices]
    
    return recommended_recipes.to_dict('records')

def recommend_based_on_input(user_input, num_results=10):

    df = retrieve_and_preprocess_data(collection)
    tfidf_vectorizer, tfidf_matrix = create_tfidf_matrix(df)

    preprocessed_input = preprocess_text(user_input.lower())
    input_vector = tfidf_vectorizer.transform([preprocessed_input])
    cosine_similarities = linear_kernel(input_vector, tfidf_matrix)
    similar_recipe_indices = cosine_similarities.argsort()[0][::-1]
    top_similar_recipes = []
    for idx in similar_recipe_indices[:num_results]:
        cursor = collection.find().skip(int(idx)).limit(1)
        for recipe_doc in cursor:
            top_similar_recipes.append({
                'title': recipe_doc['title'],
                'ingredients': recipe_doc['ingredients'],
                'instructions': recipe_doc['formatted_instructions'],
                'image': recipe_doc['image'],
                'aggregateLikes': recipe_doc['aggregateLikes'],
                'spoonacularScore': recipe_doc['spoonacularScore']
            })
    
    return top_similar_recipes

if __name__ == '__main__':
    app.run(debug=True)
