# from pydantic import BaseModel
# from typing import List

# class RecipeBase(BaseModel):
#     name: str
#     ingredients: str
#     instructions: str

# class RecipeCreate(RecipeBase):
#     pass

# class RecipeResponse(RecipeBase):
#     id: int

#     class Config:
#         orm_mode = True

from pydantic import BaseModel
from typing import List, Optional

class RecipeBase(BaseModel):
    recipe_name: str
    prep_time: Optional[int] = None
    cook_time: Optional[int] = None
    total_time: Optional[int] = None
    servings: Optional[int] = None
    yield_amount: Optional[int] = None
    ingredients: str
    directions: str
    rating: Optional[float] = None
    url: Optional[str] = None
    cuisine_path: Optional[str] = None
    nutrition: Optional[dict] = None
    timing: Optional[str] = None
    img_src: Optional[str] = None

class RecipeCreate(RecipeBase):
    pass

class RecipeResponse(RecipeBase):
    id: int
