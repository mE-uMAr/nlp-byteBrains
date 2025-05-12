import os
import re
import PyPDF2
from docx import Document

def extract_text(file_path):
    ext = os.path.splitext(file_path)[1].lower()

    if ext == '.pdf':
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            return "\n".join(page.extract_text() for page in reader.pages if page.extract_text())

    elif ext == '.docx':
        doc = Document(file_path)
        return "\n".join(para.text for para in doc.paragraphs)

    else:
        raise ValueError("Unsupported file format. Please use PDF or DOCX.")

def clean_text(text):
    # text = text.lower()
    text = re.sub(r'[^\w\s@.+-,]', ' ', text) 
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def main(path):
    file_path = path.strip()

    if not os.path.exists(file_path):
        print("File does not exist.")
        return

    try:
        raw_text = extract_text(file_path)
        processed_text = clean_text(raw_text)
        return processed_text
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    print(main("C:/Users/mehar/Downloads/mehar umar cv-1.pdf"))
