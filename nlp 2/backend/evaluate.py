import pandas as pd
from rouge_score import rouge_scorer
from extractive_summarizer import extractive_summary
from abstractive_summarizer import abstractive_summary

def evaluate(articles_path: str, references_path: str):
    with open(articles_path, "r", encoding="utf-8") as f:
        articles = [line.strip() for line in f if line.strip()]

    with open(references_path, "r", encoding="utf-8") as f:
        references = [line.strip() for line in f if line.strip()]

    assert len(articles) == len(references), "Mismatch between articles and references count."

    scorer = rouge_scorer.RougeScorer(["rouge1", "rouge2", "rougeL"], use_stemmer=True)

    ext_scores = {"rouge1": [], "rouge2": [], "rougeL": []}
    abs_scores = {"rouge1": [], "rouge2": [], "rougeL": []}

    for article, reference in zip(articles, references):
        ext = extractive_summary(article)
        abs_ = abstractive_summary(article)

        for key in ext_scores:
            ext_scores[key].append(scorer.score(reference, ext)[key].fmeasure)
            abs_scores[key].append(scorer.score(reference, abs_)[key].fmeasure)

    print("\n=== Extractive Summarization ===")
    for key, vals in ext_scores.items():
        print(f"  {key}: {sum(vals)/len(vals):.4f}")

    print("\n=== Abstractive Summarization ===")
    for key, vals in abs_scores.items():
        print(f"  {key}: {sum(vals)/len(vals):.4f}")

if __name__ == "__main__":
    evaluate(
        "../data/sample_articles.txt",
        "../data/reference_summaries.txt"
    )
