from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.database.database import SessionLocal
from app.models.document import Document
import os

router = APIRouter()

UPLOAD_FOLDER = "uploads"


@router.get("/documents")
def get_documents():
    db = SessionLocal()

    documents = db.query(Document).all()

    db.close()

    return documents


@router.get("/download/{document_id}")
def download_document(document_id: int):

    db = SessionLocal()

    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    db.close()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document Not Found"
        )

    file_path = os.path.join(
        UPLOAD_FOLDER,
        document.filename
    )

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="PDF File Not Found"
        )

    return FileResponse(
        path=file_path,
        filename=document.filename,
        media_type="application/pdf"
    )


@router.delete("/documents/{document_id}")
def delete_document(document_id: int):

    db = SessionLocal()

    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Document Not Found"
        )

    db.delete(document)

    db.commit()

    db.close()

    return {
        "message": "Document Deleted Successfully"
    }
@router.get("/preview/{document_id}")
def preview_document(document_id: int):

    db = SessionLocal()

    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    db.close()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document Not Found"
        )

    file_path = os.path.join(
        UPLOAD_FOLDER,
        document.filename
    )

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="PDF File Not Found"
        )

    return FileResponse(
        path=file_path,
        filename=document.filename,
        media_type="application/pdf",
        headers={"Content-Disposition": "inline"}
    )