import json
from datetime import datetime
from flask import render_template, request, jsonify, flash, redirect, url_for, send_file
from app import app, db
from models import BillData
import google.generativeai as genai
import os
import io
import csv
from werkzeug.utils import secure_filename
from ocr_processor import process_bill_image

# Configure Gemini API
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'your-gemini-api-key')
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

@app.route('/')
def index():
    return redirect(url_for('dashboard'))

@app.route('/dashboard')
def dashboard():
    return render_template('employee_dashboard.html')

@app.route('/bills')
def bills():
    bills = BillData.query.order_by(BillData.created_at.desc()).all()
    return render_template('bills.html', bills=bills)

@app.route('/api/process-image', methods=['POST'])
def process_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Check if the file is an image
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
        return jsonify({'error': 'Invalid file type. Please upload an image.'}), 400

    try:
        # Process the image
        app.logger.debug(f"Processing file: {file.filename}")
        result = process_bill_image(file)

        if not result:
            return jsonify({'error': 'Failed to process image'}), 400

        app.logger.debug(f"OCR Result: {result}")
        return jsonify({
            'customerName': '',  # To be filled by user
            'date': result['date'].strftime('%Y-%m-%d') if result['date'] else '',
            'totalAmount': result['total_amount'] or 0,
            'items': result['items'],
            'rawText': result['text']
        })
    except Exception as e:
        app.logger.error(f"Error processing image: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/save-ocr', methods=['POST'])
def save_ocr():
    try:
        data = request.json

        # Create new bill record
        bill = BillData(
            customer_name=data['customerName'],
            date=datetime.strptime(data['date'], '%Y-%m-%d') if data['date'] else datetime.utcnow(),
            total_amount=data['totalAmount'],
            items=data['items'],
            raw_text=data['rawText']
        )

        db.session.add(bill)
        db.session.commit()

        return jsonify({'status': 'success'})
    except Exception as e:
        app.logger.error(f"Error saving OCR text: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/download-bills')
def download_bills():
    bills = BillData.query.order_by(BillData.created_at.desc()).all()

    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)

    # Write header
    writer.writerow(['Date', 'Customer Name', 'Total Amount', 'Items'])

    # Write data
    for bill in bills:
        writer.writerow([
            bill.date.strftime('%Y-%m-%d'),
            bill.customer_name,
            bill.total_amount,
            ', '.join(item['description'] for item in bill.items) if bill.items else ''
        ])

    # Prepare response
    output.seek(0)
    return send_file(
        io.BytesIO(output.getvalue().encode('utf-8')),
        mimetype='text/csv',
        as_attachment=True,
        download_name=f'bills_report_{datetime.now().strftime("%Y%m%d")}.csv'
    )

@app.route('/chat')
def chat():
    return render_template('chat.html')

@app.route('/api/chat', methods=['POST'])
def chat_api():
    message = request.json.get('message')
    try:
        response = model.generate_content(message)
        return jsonify({'response': response.text})
    except Exception as e:
        app.logger.error(f"Chat API error: {str(e)}")
        return jsonify({'response': 'I apologize, but I encountered an error. Please try again later.'})