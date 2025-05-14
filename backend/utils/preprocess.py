import os
import pickle
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

file_path = os.path.join(os.path.dirname(__file__), "..", "data", "combined_updated_recipe_dataset.csv")
df = pd.read_csv(file_path)
df.fillna("", inplace=True)
def clean_ingredients(ingredient_str):
    return set(map(str.strip, ingredient_str.lower().replace(",", " ").split()))

df["ingredients_clean"] = df["ingredients"].apply(clean_ingredients)
df["combined_text"] = df["recipe_name"] + " " + df["ingredients"]

# Initialize & Train TF-IDF Vectorizer
vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(df["combined_text"])

model_path = os.path.join(os.path.dirname(__file__), "..", "models", "tfidf_model.pkl")
with open(model_path, "wb") as model_file:
    pickle.dump((vectorizer, tfidf_matrix, df), model_file)

print("Preprocessing Complete & TF-IDF Model Saved!")
