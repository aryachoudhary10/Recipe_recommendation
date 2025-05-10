import os
import pickle
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

# 📌 Load dataset
file_path = os.path.join(os.path.dirname(__file__), "..", "data", "recipes_updated.csv")
df = pd.read_csv(file_path)

# 🔥 Handle missing values
df.fillna("", inplace=True)

# ✅ Convert `ingredients` column into sets of lowercase words
def clean_ingredients(ingredient_str):
    return set(map(str.strip, ingredient_str.lower().replace(",", " ").split()))

df["ingredients_clean"] = df["ingredients"].apply(clean_ingredients)

# ✅ Combine text fields for better search ranking
df["combined_text"] = df["recipe_name"] + " " + df["ingredients"]

# 🔥 Initialize & Train TF-IDF Vectorizer
vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(df["combined_text"])

# ✅ Save the trained model
model_path = os.path.join(os.path.dirname(__file__), "..", "models", "tfidf_model.pkl")
with open(model_path, "wb") as model_file:
    pickle.dump((vectorizer, tfidf_matrix, df), model_file)

print("✅ Preprocessing Complete & TF-IDF Model Saved!")
