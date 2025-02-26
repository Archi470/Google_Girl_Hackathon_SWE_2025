import os
import pytesseract
from PIL import Image
import spacy
import re
from datetime import datetime
import io

# Load spaCy model for NLP
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")


def extract_text_from_image(image_file):
    """Extract text from image using Tesseract OCR"""
    try:
        # Convert the uploaded file to a PIL Image
        image = Image.open(image_file)
        # Convert to RGB if needed
        if image.mode not in ('L', 'RGB'):
            image = image.convert('RGB')

        # Extract text using Tesseract
        text = pytesseract.image_to_string(image)
        print(f"Extracted text: {text}")  # Debugging line
        return text
    except Exception as e:
        print(f"Error in OCR processing: {str(e)}")
        return None


def extract_amount(text):
    """Extract total amount from text using regex and NLP"""
    # Look for patterns like "Total: $123.45" or "Total Amount: 123.45"
    amount_patterns = [
        r'total[:\s]*[\$]?(\d+\.?\d*)',
        r'amount[:\s]*[\$]?(\d+\.?\d*)',
        r'sum[:\s]*[\$]?(\d+\.?\d*)',
        r'[\$](\d+\.?\d*)\s*(?:total|amount|sum)',
    ]

    for pattern in amount_patterns:
        match = re.search(pattern, text.lower())
        if match:
            try:
                amount = float(match.group(1))
                print(f"Found amount: {amount}")  # Debugging line
                return amount
            except ValueError:
                continue
    return None


def extract_date(text):
    """Extract date from text using regex and NLP"""
    # Common date patterns
    date_patterns = [
        r'date[:\s]+([A-Za-z]+\s+\d{1,2},?\s+\d{4})',
        r'date[:\s]+(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})',
        r'(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})',
    ]

    for pattern in date_patterns:
        match = re.search(pattern, text.lower())
        if match:
            try:
                date_str = match.group(1)
                # Try different date formats
                for fmt in [
                        '%B %d, %Y', '%B %d %Y', '%m/%d/%Y', '%m-%d-%Y',
                        '%d/%m/%Y', '%d-%m-%Y'
                ]:
                    try:
                        date = datetime.strptime(date_str, fmt)
                        print(f"Found date: {date}")  # Debugging line
                        return date
                    except ValueError:
                        continue
            except ValueError:
                continue
    return datetime.now()


def extract_items(text):
    """Extract items and their descriptions using NLP"""
    doc = nlp(text)
    items = []

    # Split text into lines
    lines = text.split('\n')

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Skip lines that look like headers or totals
        if re.search(r'(total|sum|amount|date|invoice|bill)', line.lower()):
            continue

        # Look for lines that might be items (contain numbers or product-like text)
        if re.search(r'(\d+|[A-Za-z]+\s+[A-Za-z]+)', line):
            print(f"Found item: {line}")  # Debugging line
            items.append({"description": line})

    return items


def process_bill_image(image_file):
    """Main function to process bill image and extract all relevant information"""
    text = extract_text_from_image(image_file)
    if not text:
        return None

    print("Processing extracted text...")  # Debugging line
    result = {
        'text': text,
        'total_amount': extract_amount(text),
        'date': extract_date(text),
        'items': extract_items(text),
    }
    print(f"Processing result: {result}")  # Debugging line
    return result
