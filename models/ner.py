import spacy
import re

# Load SpaCy transformer model
nlp = spacy.load("en_core_web_trf")

# Updated phone number regex to handle various formats
PHONE_REGEX = r"(?:\+?\d{1,4}[-.\s]?)?(?:\(?\d{3,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{4}"

# Custom regex for email
EMAIL_REGEX = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"

def extract_info(text):
    doc = nlp(text)
    
    # Extract emails
    emails = re.findall(EMAIL_REGEX, text)
    
    # Extract phone numbers with improved filtering
    phone_matches = re.findall(PHONE_REGEX, text)
    
    # Filter out date-like patterns and validate phone numbers
    phone_numbers = []
    for match in phone_matches:
        # Skip if it looks like a date (4 digits followed by 4 digits)
        if re.match(r'^\d{4}\s*\d{4}$', match):
            continue
            
        # Skip if it's just a sequence of 4 digits
        if re.match(r'^\d{4}$', match):
            continue
            
        # Clean up the phone number
        cleaned = re.sub(r'[-.\s]', '', match)
        
        # Only include if it has a reasonable length for a phone number (8-15 digits)
        if 8 <= len(cleaned) <= 15:
            phone_numbers.append(match)

    # Extract named entities
    names = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
    addresses = [ent.text for ent in doc.ents if ent.label_ in ("LOC", "GPE")]
    organizations = [ent.text for ent in doc.ents if ent.label_ == "ORG"]

    return {
    "name": next(iter(set(names)), ''),
    "email": next(iter(set(emails)), ''),
    "phone": next(iter(set(phone_numbers)), ''),
    "address": ', '.join(set(addresses)),
    "Organizations": next(iter(set(organizations)), '')
}