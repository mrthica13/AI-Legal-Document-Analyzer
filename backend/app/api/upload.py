from fastapi import APIRouter, UploadFile, File
from app.services.ai_service import summarize_text
from app.services.pdf_service import extract_text_from_pdf
from app.database.database import SessionLocal
from app.models.document import Document
import shutil
import os

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
def upload_pdf(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        text = extract_text_from_pdf(file_path)

        summary = summarize_text(text)

        db = SessionLocal()

        document = Document(
            filename=file.filename,
            extracted_text=text,
            summary=summary
        )

        db.add(document)
        db.commit()
        db.refresh(document)
        db.close()

        return {
            "id": document.id,
            "filename": file.filename,
            "text": text,
            "summary": summary
        }

    except Exception as e:
        print("UPLOAD ERROR:", e)
        raise