from flask import Flask, jsonify, request, render_template
from pymongo import MongoClient
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017')
db = client['myDatabase']
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


# Function to recommend top recipes based on user's cuisine taste
def recommend_top_and_cuisine(num_top_choices=10, user_cuisines=None, df=None):
    if df is None:
        df = retrieve_and_preprocess_data(collection)

    # Calculate TF-IDF vectors for the combined features
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform(df['combined_features'])

    # Calculate cosine similarity matrix
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    # Get a random recipe index from the dataset
    random_recipe_index = np.random.choice(df.index)

    # Get the pairwise similarity scores of all recipes with the randomly selected recipe
    sim_scores = list(enumerate(cosine_sim[random_recipe_index]))

    # Sort the recipes based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the recipe indices
    recipe_indices = [i[0] for i in sim_scores]

    # Sort recipes based on popularity (aggregateLikes + SpoonacularScore)
    popular_recipes = df.iloc[recipe_indices].sort_values(by=['aggregateLikes', 'spoonacularScore'], ascending=False)

    # Filter recipes based on user's cuisine taste
    cuisine_recipes = popular_recipes[popular_recipes['cuisines'].isin(user_cuisines)].head(num_top_choices)

    if not cuisine_recipes.empty:
        return cuisine_recipes[['title', 'cuisines', 'ingredients', 'formatted_instructions', 'image', 'aggregateLikes', 'spoonacularScore']]
    else:
        # If there are fewer recipes for the specified cuisines, return all available recipes up to the limit of 10
        return popular_recipes.head(num_top_choices)[['title', 'cuisines', 'ingredients', 'formatted_instructions', 'image', 'aggregateLikes', 'spoonacularScore']]

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Get user's cuisine tastes from form submission
        user_cuisines = request.form.getlist('cuisines')
        
        # Call recommend_top_and_cuisine function
        top_with_cuisine = recommend_top_and_cuisine(user_cuisines=user_cuisines)

        # Render template with recommendations
        return render_template('index2.html', recommendations=top_with_cuisine)
    
    # Render initial template with form to select cuisines
    return render_template('index2.html')

@app.route('/recommend', methods=['POST'])
def recommend():
    # Get user's cuisine tastes from request data
    user_cuisines = request.json.get('cuisines')
    
    # Call recommend_top_and_cuisine function
    top_with_cuisine = recommend_top_and_cuisine(user_cuisines=user_cuisines)

    # Return recommendations as JSON response
    return jsonify(top_with_cuisine.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)
