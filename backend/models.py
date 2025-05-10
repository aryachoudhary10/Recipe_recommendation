# from sqlalchemy import Column, Integer, String, Text
# from .database import Base

# # class Recipe(Base):
# #     __tablename__ = "recipes"

# #     id = Column(Integer, primary_key=True, index=True)
# #     name = Column(String, index=True)
# #     ingredients = Column(Text, nullable=False)
# #     instructions = Column(Text, nullable=False)

from sqlalchemy import Column, Integer, String, Float, JSON
from database import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    recipe_name = Column(String, index=True)
    prep_time = Column(Integer, nullable=True)
    cook_time = Column(Integer, nullable=True)
    total_time = Column(Integer, nullable=True)
    servings = Column(Integer, nullable=True)
    yield_amount = Column(Integer, nullable=True)
    ingredients = Column(String)  # Store as comma-separated or JSON
    directions = Column(String)
    rating = Column(Float, nullable=True)
    url = Column(String, nullable=True)
    cuisine_path = Column(String, nullable=True)
    nutrition = Column(JSON)  # Store nutrition as a JSON field
    timing = Column(String, nullable=True)
    img_src = Column(String, nullable=True)  # Image URL
