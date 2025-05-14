import pandas as pd
df = pd.read_csv("combined_recipes_updated.csv")  # change to your actual file path

# List of common non-veg indicators
non_veg_items = [
    'chicken', 'mutton', 'egg', 'beef', 'veal', 'fish', 'prawn', 'shrimp', 'lamb',
    'bacon', 'pork', 'ham', 'turkey', 'duck', 'crab', 'meat', 'anchovy', 'tuna',
    'sardine', 'salmon', 'octopus', 'squid', 'clam', 'mussels', 'lobster',
    'quail', 'goat', 'buffalo', 'venison', 'kangaroo', 'foie gras', 'prosciutto',
    'pepperoni', 'sausage', 'salami', 'anchovies', 'tilapia', 'snapper',
    'catfish', 'trout', 'herring', 'basa', 'grouper', 'caviar', 'roe',
    'eel', 'oyster', 'snail', 'frog', 'rabbit', 'ox', 'ox tongue', 'brisket',
    'gizzard', 'liver', 'kidney', 'intestine', 'tripe', 'brain', 'spleen',
    'blood', 'blood sausage', 'duck egg', 'quail egg', 'balut', 'shellfish',
    'escargot', 'kebab', 'tandoori chicken', 'grilled chicken', 'kfc', 'meatball',
    'shawarma', 'kebab', 'keema', 'mince', 'minced meat', 'cutlet', 'drumstick'
]

def classify_veg_nonveg(ingredients):
    ingredients = str(ingredients).lower()
    return 'non-veg' if any(item in ingredients for item in non_veg_items) else 'veg'

df['category'] = df['ingredients'].apply(classify_veg_nonveg)

# Save the updated dataset
df.to_csv("combined_updated_recipe_dataset.csv", index=False)
