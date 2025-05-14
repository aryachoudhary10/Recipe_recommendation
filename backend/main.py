from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
import pandas as pd
from utils.search import search_recipes, recommend_recipes
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
users_db = {}

file_path = os.path.join(os.path.dirname(__file__), "data", "combined_updated_recipe_dataset.csv")
df = pd.read_csv(file_path)
recipes = df.to_dict(orient="records")

class UserRegister(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class VoteRequest(BaseModel):
    action: str  # "like" or "dislike"

class CommentRequest(BaseModel):
    comment: str

class SearchRequest(BaseModel):
    query: str

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None

@app.post("/register")
def register(user: UserRegister):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already exists")
    users_db[user.username] = hash_password(user.password)
    return {"message": "User registered successfully"}

@app.post("/login")
def login(user: UserLogin):
    if user.username not in users_db or not verify_password(user.password, users_db[user.username]):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

from fastapi import Query
from typing import List

@app.get("/recipes")
def get_recipes(
    category: str = Query(default="all"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1)
):
    filtered = recipes

    if category == "veg":
        filtered = [r for r in recipes if r.get("category") == "veg"]
    elif category == "non-veg":
        filtered = [r for r in recipes if r.get("category") == "non-veg"]

    return filtered[skip : skip + limit]


@app.post("/recipes/{recipe_id}/vote")
def vote_recipe(recipe_id: int, vote: VoteRequest):
    for recipe in recipes:
        if recipe["id"] == recipe_id:
            if vote.action == "like":
                recipe["likes"] += 1
            elif vote.action == "dislike":
                recipe["dislikes"] += 1
            return recipe
    raise HTTPException(status_code=404, detail="Recipe not found")

@app.post("/recipes/{recipe_id}/comment")
def comment_recipe(recipe_id: int, comment: CommentRequest):
    for recipe in recipes:
        if recipe["id"] == recipe_id:
            recipe["comments"].append(comment.comment)
            return recipe
    raise HTTPException(status_code=404, detail="Recipe not found")

@app.post("/search")
def search(search_request: SearchRequest):
    return search_recipes(search_request.query)

@app.get("/recommend/{recipe_id}")
def recommend(recipe_id: int):
    return recommend_recipes(recipe_id)

@app.get("/")
def home():
    return {"message": "Welcome to the Recipe Recommendation API!"}
