import os
import pickle
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

model_path = os.path.join(os.path.dirname(__file__), "..", "models", "tfidf_model.pkl")
with open(model_path, "rb") as model_file:
    vectorizer, tfidf_matrix, df = pickle.load(model_file)
def search_recipes(query: str, top_n: int = 10):
    """
    Searches for recipes that contain ALL queried ingredients and ranks them using cosine similarity.

    Args:
        query (str): Comma-separated ingredients (e.g., "potato, apple" or "tomato, garlic").
        top_n (int): Number of top matching recipes to return.

    Returns:
        List[Dict]: Top matching recipes.
    """
    query = query.lower().replace(",", " ").strip()
    query_ingredients = set(query.split())

    print(f"Searching for recipes with: {query_ingredients}")
    filtered_recipes = df[df["ingredients_clean"].apply(lambda recipe_ingredients: query_ingredients.issubset(recipe_ingredients))]

    # If no exact match, find recipes with at least one matching ingredient
    if filtered_recipes.empty:
        print("⚠ No exact matches found. Searching for partial matches...")
        filtered_recipes = df[df["ingredients_clean"].apply(lambda recipe_ingredients: bool(query_ingredients & recipe_ingredients))]

    print(f"✅ Recipes found before ranking: {len(filtered_recipes)}")
    if filtered_recipes.empty:
        return {"message": "No matching recipes found"}

    filtered_indices = filtered_recipes.index.to_list()
    query_vector = vectorizer.transform([" ".join(query_ingredients)])
    similarities = cosine_similarity(query_vector, tfidf_matrix[filtered_indices]).flatten()

    ranked_indices = np.argsort(similarities)[::-1][:top_n]
    return filtered_recipes.iloc[ranked_indices].to_dict(orient="records")

# 🔄 **Recommendation Function**
def recommend_recipes(recipe_id: int, top_n: int = 5):
    """
    Recommends similar recipes based on cosine similarity.

    Args:
        recipe_id (int): ID of the reference recipe.
        top_n (int): Number of similar recipes to return.

    Returns:
        List[Dict]: Recommended recipes.
    """
    if recipe_id not in df.index:
        return {"error": "Recipe ID not found"}
    recipe_vector = tfidf_matrix[recipe_id]
    similarities = cosine_similarity(recipe_vector, tfidf_matrix).flatten()

    # ✅ Get top N similar recipes (excluding itself)
    top_indices = np.argsort(similarities)[::-1][1:top_n+1]

    return df.iloc[top_indices].to_dict(orient="records")
