import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

nlp = spacy.load("en_core_web_sm")

def extractive_summary(text: str, num_sentences: int = 3) -> str:
    doc = nlp(text)
    sentences = [sent.text.strip() for sent in doc.sents if len(sent.text.strip()) > 10]

    if len(sentences) <= num_sentences:
        return " ".join(sentences)

    # TF-IDF scoring
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(sentences)

    # Score each sentence by sum of its TF-IDF values
    scores = np.array(tfidf_matrix.sum(axis=1)).flatten()

    # Pick top N sentences and preserve original order
    top_indices = np.argsort(scores)[::-1][:num_sentences]
    top_indices = sorted(top_indices)

    summary = " ".join([sentences[i] for i in top_indices])
    return summary
