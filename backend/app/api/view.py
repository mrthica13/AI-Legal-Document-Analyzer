from fastapi import APIRouter, HTTPException
from app.database.database import SessionLocal
from app.models.document import Document

router = APIRouter()

@router.get("/documents/{document_id}")
def get_document(document_id: int):

    db = SessionLocal()

    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    db.close()

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    return document