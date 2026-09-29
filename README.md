# NLP Text Summarizer

Summarizes articles using two methods:
- **Extractive**: TF-IDF scoring with spaCy sentence splitting
- **Abstractive**: Facebook BART model via Hugging Face

## Setup

### 1. Install dependencies
pip install -r requirements.txt
python -m spacy download en_core_web_sm

### 2. Start Backend
cd backend
python app.py

### 3. Open Frontend
Open frontend/index.html in your browser

## API Endpoints
- POST /summarize/extractive — { "text": "...", "num_sentences": 3 }
- POST /summarize/abstractive — { "text": "..." }
- GET /health

## Evaluate
cd backend
python evaluate.py

## Author

pranesh S
