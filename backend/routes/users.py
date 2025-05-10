from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt

router = APIRouter()

# Fake database (Replace with real DB later)
users_db = {}

SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

def create_token(data: dict, expires_delta: timedelta):
    """Generates JWT token for authentication."""
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/signup")
def signup(user: User):
    """Registers a new user with encrypted password."""
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_password = pwd_context.hash(user.password)
    users_db[user.username] = {"username": user.username, "password": hashed_password}
    return {"message": "User registered successfully"}

@router.post("/login", response_model=Token)
def login(user: User):
    """Authenticates user and returns JWT token."""
    if user.username not in users_db:
        raise HTTPException(status_code=400, detail="User not found")
    
    hashed_password = users_db[user.username]["password"]
    if not pwd_context.verify(user.password, hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    
    access_token = create_token({"sub": user.username}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}
