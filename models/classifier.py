from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F
import os

# Step 1: Load your fine-tuned model from local directory
model_path = "mehar27/resume-classifier"

# Load tokenizer and model from local files
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)
model.eval()  # Set model to evaluation mode

# Step 2: Define your label mapping
labels = ['Accountant', 'Advocate', 'Agriculture', 'Apparel', 'Architecture', 'Arts',
          'Automobile', 'Aviation', 'Banking', 'Blockchain', 'BPO', 'Building and Construction',
          'Business Analyst', 'Civil Engineer', 'Consultant', 'Data Science', 'Database',
          'Designing', 'DevOps', 'Digital Media', 'DotNet Developer', 'Education',
          'Electrical Engineering', 'ETL Developer', 'Finance', 'Food and Beverages',
          'Health and Fitness', 'Human Resources', 'Information Technology', 'Java Developer',
          'Management', 'Mechanical Engineer', 'Network Security Engineer', 'Operations Manager',
          'PMO', 'Public Relations', 'Python Developer', 'React Developer', 'Sales',
          'SAP Developer', 'SQL Developer', 'Testing', 'Web Designing']

# Step 3: Prediction function
def predict_category(resume_text):
    inputs = tokenizer(resume_text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    probs = F.softmax(outputs.logits, dim=-1)
    predicted_index = torch.argmax(probs, dim=-1).item()
    predicted_label = labels[predicted_index]
    confidence = probs[0][predicted_index].item()
    return predicted_label