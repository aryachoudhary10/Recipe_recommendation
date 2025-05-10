from sqlalchemy.orm import Session
from . import models, schemas

def get_recipes(db: Session):
    return db.query(models.Recipe).all()

def create_recipe(db: Session, recipe: schemas.RecipeCreate):
    db_recipe = models.Recipe(**recipe.dict())
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe
