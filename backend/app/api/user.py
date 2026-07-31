from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate, UserLogin
from app.models.user import User
from app.database.database import SessionLocal
from app.utils.auth import hash_password, verify_password
from app.utils.jwt_handler import create_access_token
from fastapi import Header
from app.utils.jwt_handler import decode_access_token

router = APIRouter()


@router.post("/register")
def register(user: UserCreate):
    db: Session = SessionLocal()

    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()

    return {
        "message": "User Registered Successfully"
    }
@router.post("/login")
def login(user: UserLogin):
    db: Session = SessionLocal()

    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user.password, db_user.password):
        db.close()
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_access_token({"sub": db_user.email})

    db.close()

    return {
        "access_token": token,
        "token_type": "bearer"
    }
@router.get("/profile")
def get_profile(authorization: str = Header(...)):

    token = authorization.replace("Bearer ", "")

    payload = decode_access_token(token)

    email = payload.get("sub")

    db = SessionLocal()

    user = db.query(User).filter(User.email == email).first()

    db.close()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "username": user.username,
        "email": user.email
    }