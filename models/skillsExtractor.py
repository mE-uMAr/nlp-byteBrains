import os
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification
import torch
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import pandas as pd
from sentence_transformers import SentenceTransformer, util
import spacy

extracted_dataset = os.path.join(os.path.dirname(__file__), "trained", "extracted_skills.csv")
model_path = "mehar27/skills-extractor"

nlp = spacy.load("en_core_web_sm")

model = DistilBertForSequenceClassification.from_pretrained(model_path)
tokenizer = DistilBertTokenizerFast.from_pretrained(model_path)

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('punkt_tab')

def remove_stopwords(text):
    stop_words = set(stopwords.words('english'))
    words = word_tokenize(text)
    filtered = [word for word in words if word.lower() not in stop_words and word.isalnum()]
    return ' '.join(filtered)

def get_all_ngrams(text):
    words = text.split()
    unigrams = words
    bigrams = [' '.join(words[i:i+2]) for i in range(len(words)-1)]
    return unigrams + bigrams

def predict_skill(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class_id = logits.argmax().item()
    return predicted_class_id

def filter_nouns(skills):
    return [s for s in skills if all(token.pos_ in {'NOUN', 'PROPN'} for token in nlp(s))]

def load_labeled_skills(csv_path):
    df = pd.read_csv(csv_path)
    df.columns = [col.strip().lower() for col in df.columns]
    if 'text' not in df.columns:
        raise ValueError("CSV must contain 'text' column.")
    skills = df['text'].dropna().astype(str).str.lower().str.strip().unique().tolist()
    return skills

def match_predicted_to_known(predicted_skills, known_skills, model_name='all-MiniLM-L6-v2', threshold=0.7):
    model = SentenceTransformer(model_name)
    known_embeddings = model.encode(known_skills, convert_to_tensor=True)
    predicted_embeddings = model.encode(predicted_skills, convert_to_tensor=True)

    matched = []

    for i, pred in enumerate(predicted_skills):
        sim_scores = util.cos_sim(predicted_embeddings[i], known_embeddings)[0]
        max_score, max_idx = sim_scores.max().item(), sim_scores.argmax().item()

        if max_score >= threshold:
            matched.append((pred, known_skills[max_idx], max_score))

    return matched

def main(text):
    rms = remove_stopwords(text)
    ngrams = get_all_ngrams(rms)

    skills = []
    for txt in ngrams:
        result = predict_skill(txt)
        if result == 1:
            skills.append(txt)

    cleaned_skills = filter_nouns(skills)
    preds = list(set(s.lower().strip() for s in cleaned_skills))

    known_skills = load_labeled_skills(extracted_dataset)
    model_predictions = preds
    matched_results = match_predicted_to_known(model_predictions, known_skills)

    results = []
    for original, matched, score in matched_results:
        results.append(original)
    return results
