# Abaanly - FastAPI NLP & Plagiarism Detection Backend

A production-ready Python FastAPI service that powers the Abaanly Plagiarism Checker application with document ingestion (.pdf, .docx), sentence-level semantic similarity, verbatim n-gram overlap, and multi-metric linguistic evaluation.

## Features
- **Document Ingestion**:
  - PDF text extraction using `pypdf` with fallback to `pdfplumber`.
  - Microsoft Word text extraction using `python-docx`.
  - Clean text normalization, sentence tokenization, and whitespace stripping.
- **NLP & Plagiarism Detection Engine**:
  - **Verbatim N-Gram & Jaccard Matching**: Uncovers direct copy-pasted blocks.
  - **Semantic Vector Matching**: Cross-references against an indexed academic & encyclopedic corpus.
  - **Linguistic Metrics**:
    - **Type-Token Ratio (TTR)**: Vocabulary richness & lexical diversity.
    - **Flesch-Kincaid & Flesch Reading Ease**: Readability index.
    - **Grammar, Spelling, Punctuation & Conciseness**: Automated heuristic analysis.

## Setup & Running the FastAPI Server

1. **Create and activate a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Start the FastAPI application**:
   ```bash
   uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
   ```

4. **Access the interactive Swagger API Docs**:
   - URL: `http://localhost:8000/docs`

## API Schema & Contracts

### `POST /api/scan`
Accepts either `application/json`:
```json
{
  "text": "Computing machinery and intelligence begins with the question: Can machines think?...",
  "title": "Turing Essay"
}
```
Or `multipart/form-data` with an uploaded `.pdf`, `.docx`, or `.txt` file.

**Response**:
```json
{
  "similarity_score": 14.5,
  "originality_score": 85.5,
  "word_count": 420,
  "character_count": 2840,
  "flagged_passages": [
    {
      "text": "Computing machinery and intelligence begins with the question...",
      "similarity": 0.88,
      "matched_source": "Computing Machinery and Intelligence (A. M. Turing)",
      "source_url": "https://academic.oup.com/mind/article/LIX/236/433/986238",
      "source_domain": "academic.oup.com"
    }
  ],
  "metrics": {
    "grammar_score": "Good",
    "spelling_issues": 1,
    "conciseness": "Clear",
    "readability": "College Level (64.2)",
    "vocabulary_richness": "0.72 TTR",
    "punctuation_issues": 0,
    "word_choice_score": "Diverse",
    "additional_issues": 1
  }
}
```

### `POST /api/upload`
Accepts `multipart/form-data` with key `file`. Returns parsed text, word count, character count, and file metadata.
