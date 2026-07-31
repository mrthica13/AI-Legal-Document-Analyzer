from fastapi import APIRouter

from app.database.database import SessionLocal
from app.models.document import Document
from app.models.user import User

router = APIRouter()

@router.get("/dashboard")
def dashboard():

    db = SessionLocal()

    total_documents = db.query(Document).count()

    total_users = db.query(User).count()

    db.close()

    return {
        "total_documents": total_documents,
        "total_users": total_users,
        "todays_uploads": 0
    }