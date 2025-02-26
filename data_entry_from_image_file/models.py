from app import db
from datetime import datetime

class BillData(db.Model):
    __tablename__ = 'bill_data'

    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    total_amount = db.Column(db.Float)
    items = db.Column(db.JSON)  # Store items as JSON array
    raw_text = db.Column(db.Text)  # Store original OCR text
    created_at = db.Column(db.DateTime, default=datetime.utcnow)