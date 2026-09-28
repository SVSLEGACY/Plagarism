"""
FastAPI Backend Application for AI/NLP Plagiarism Checker
Provides endpoints for text scanning, file ingestion (.pdf, .docx),
and comprehensive linguistic & similarity diagnostics.
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os

from backend.nlp_engine import (
    extract_text_from_pdf,
    extract_text_from_docx,
    scan_text_for_plagiarism,
    calculate_linguistic_metrics,
)

app = FastAPI(
    title="Abaanly Plagiarism Checker & NLP API",
    description="FastAPI service for semantic similarity, verbatim matching, and multi-metric linguistic evaluation.",
    version="1.0.0"
)

# Enable CORS for local development and SPA frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------------------------------------------------
# Request & Response Schemas
# -------------------------------------------------------------------------
class ScanRequest(BaseModel):
    text: Optional[str] = Field(None, description="Raw text to analyze for plagiarism.")
    title: Optional[str] = Field("Untitled Document", description="Document title.")


class FlaggedPassageSchema(BaseModel):
    text: str
    similarity: float
    matched_source: str
    source_url: Optional[str] = None
    source_domain: Optional[str] = None
    start_index: Optional[int] = None
    end_index: Optional[int] = None


class MetricsSchema(BaseModel):
    grammar_score: str
    spelling_issues: int
    conciseness: str
    readability: str
    vocabulary_richness: str
    punctuation_issues: Optional[int] = 0
    word_choice_score: Optional[str] = "Diverse"
    additional_issues: Optional[int] = 0


class ScanResponseSchema(BaseModel):
    similarity_score: float
    originality_score: float
    word_count: int
    character_count: int
    flagged_passages: List[FlaggedPassageSchema]
    metrics: MetricsSchema


class UploadResponseSchema(BaseModel):
    filename: str
    file_size_bytes: int
    word_count: int
    character_count: int
    text: str


# -------------------------------------------------------------------------
# Endpoints
# -------------------------------------------------------------------------
@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Veritas NLP Plagiarism Engine"}


@app.post("/api/upload", response_model=UploadResponseSchema)
async def upload_document(file: UploadFile = File(...)):
    """
    Accepts .pdf, .docx, or .txt file and extracts raw text with word count.
    """
    filename = file.filename or "uploaded_document"
    ext = os.path.splitext(filename)[1].lower()

    content = await file.read()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    extracted_text = ""
    try:
        if ext == ".pdf":
            extracted_text = extract_text_from_pdf(content)
        elif ext == ".docx":
            extracted_text = extract_text_from_docx(content)
        elif ext in [".txt", ".md", ".rtf"]:
            extracted_text = content.decode("utf-8", errors="replace")
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file format '{ext}'. Please upload .pdf, .docx, or .txt documents."
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process document: {str(e)}"
        )

    clean_text = extracted_text.strip()
    words = clean_text.split()
    
    return {
        "filename": filename,
        "file_size_bytes": len(content),
        "word_count": len(words),
        "character_count": len(clean_text),
        "text": clean_text
    }


@app.post("/api/scan", response_model=ScanResponseSchema)
async def scan_plagiarism(
    payload: Optional[ScanRequest] = None,
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None)
):
    """
    Unified endpoint supporting both JSON payload and multipart/form-data.
    Executes semantic vector similarity, verbatim n-gram detection, and linguistic metrics.
    """
    input_text = ""

    # 1. Check if raw file was uploaded via multipart
    if file is not None:
        content = await file.read()
        ext = os.path.splitext(file.filename or "")[1].lower()
        if ext == ".pdf":
            input_text = extract_text_from_pdf(content)
        elif ext == ".docx":
            input_text = extract_text_from_docx(content)
        elif ext in [".txt", ".md"]:
            input_text = content.decode("utf-8", errors="replace")

    # 2. Check form data or JSON body
    if not input_text and text:
        input_text = text
    elif not input_text and payload and payload.text:
        input_text = payload.text

    input_text = (input_text or "").strip()
    if not input_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document text or file is required for plagiarism scanning."
        )

    # Execute NLP pipeline
    result = scan_text_for_plagiarism(input_text)
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
