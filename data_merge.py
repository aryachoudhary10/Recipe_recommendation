import pandas as pd

# Read both CSV files
df2 = pd.read_csv("tasty_recipes.csv")
df1 = pd.read_csv("recipes_updated.csv")

# Concatenate along rows; it auto-aligns by column names and fills missing with NaN
combined = pd.concat([df1, df2], ignore_index=True, sort=False)

# Save to new CSV
combined.to_csv("combined_recipes.csv", index=False)
