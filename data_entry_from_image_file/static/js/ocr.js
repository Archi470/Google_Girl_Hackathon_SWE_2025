let worker = null;

async function initializeOCR() {
    try {
        console.log('Starting Tesseract initialization...');
        worker = await Tesseract.createWorker();
        console.log('Worker created successfully');

        await worker.loadLanguage('eng');
        console.log('English language loaded');

        await worker.initialize('eng');
        console.log('OCR initialized successfully');

        // Enable the file input once OCR is ready
        document.getElementById('imageInput').disabled = false;
        document.querySelector('.text-muted').textContent = 'OCR system ready. Upload a bill image.';
    } catch (error) {
        console.error('Error initializing OCR:', error);
        alert('Error initializing OCR system. Please try refreshing the page.');
        document.getElementById('imageInput').disabled = true;
    }
}

async function processImage(file) {
    if (!worker) {
        console.error('OCR worker not initialized');
        alert('OCR system is not initialized. Please refresh the page.');
        return;
    }

    const preview = document.getElementById('imagePreview');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const extractedFields = document.getElementById('extractedFields');
    const reader = new FileReader();

    reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
    }

    if (file) {
        try {
            reader.readAsDataURL(file);
            loadingSpinner.classList.remove('d-none');
            console.log('Starting OCR processing...');

            const result = await worker.recognize(file);
            console.log('OCR Result:', result.data);

            if (!result.data || !result.data.text) {
                throw new Error('No text was extracted from the image');
            }

            const extractedData = extractBillData(result.data.text);
            console.log('Extracted Data:', extractedData);
            displayExtractedData(extractedData);
            extractedFields.style.display = 'block';
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Error processing image: ' + error.message);
            extractedFields.style.display = 'none';
        } finally {
            loadingSpinner.classList.add('d-none');
        }
    }
}

function extractBillData(text) {
    console.log('Raw OCR text:', text);
    // Simple pattern matching for bill fields
    const patterns = {
        customerName: /customer[:\s]+([^\n]+)/i,
        date: /date[:\s]+([^\n]+)/i,
        totalAmount: /total[:\s]*[\$]?(\d+\.?\d*)/i,
        // Modified items pattern to be more flexible
        items: /(?:items?|products?|description)[:\s]+([\s\S]+?)(?=\btotal\b|$)/i
    };

    const extracted = {
        customerName: '',
        date: '',
        totalAmount: 0,
        items: [],
        rawText: text
    };

    // Extract customer name
    const customerMatch = text.match(patterns.customerName);
    if (customerMatch) {
        extracted.customerName = customerMatch[1].trim();
        console.log('Found customer name:', extracted.customerName);
    }

    // Extract date
    const dateMatch = text.match(patterns.date);
    if (dateMatch) {
        const dateStr = dateMatch[1].trim();
        try {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                extracted.date = date.toISOString().split('T')[0];
                console.log('Found date:', extracted.date);
            }
        } catch (e) {
            console.warn('Could not parse date:', dateStr);
        }
    }

    // Extract total amount
    const totalMatch = text.match(patterns.totalAmount);
    if (totalMatch) {
        extracted.totalAmount = parseFloat(totalMatch[1]);
        console.log('Found total amount:', extracted.totalAmount);
    }

    // Extract items with improved processing
    const itemsMatch = text.match(patterns.items);
    if (itemsMatch) {
        const itemsText = itemsMatch[1];
        console.log('Found items section:', itemsText);

        // Split items by newline and process each item
        const itemLines = itemsText.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        // Process each line as a potential item
        extracted.items = itemLines
            .filter(line => {
                // Keep lines that have either numbers or product-like text
                return /(\d+|[A-Za-z]+\s+[A-Za-z]+)/.test(line);
            })
            .map(item => {
                console.log('Processing item line:', item);
                return { description: item };
            });

        console.log('Processed items:', extracted.items);
    }

    return extracted;
}

function displayExtractedData(data) {
    const fieldsDiv = document.getElementById('extractedFields');
    fieldsDiv.innerHTML = `
        <div class="mb-3">
            <label class="form-label">Customer Name</label>
            <input type="text" class="form-control" id="customerName" value="${data.customerName || ''}" placeholder="Enter customer name">
        </div>
        <div class="mb-3">
            <label class="form-label">Date</label>
            <input type="date" class="form-control" id="date" value="${data.date || new Date().toISOString().split('T')[0]}">
        </div>
        <div class="mb-3">
            <label class="form-label">Total Amount ($)</label>
            <input type="number" step="0.01" class="form-control" id="totalAmount" value="${data.totalAmount || 0}">
        </div>
        <div class="mb-3">
            <label class="form-label">Items</label>
            <textarea class="form-control" id="items" rows="4" placeholder="Each item on a new line">${data.items.map(item => item.description).join('\n')}</textarea>
        </div>
        <div class="mb-3">
            <label class="form-label">Raw OCR Text</label>
            <textarea class="form-control" id="rawText" rows="4" readonly>${data.rawText || ''}</textarea>
        </div>
    `;
}

async function saveExtractedText() {
    const billData = {
        customerName: document.getElementById('customerName').value,
        date: document.getElementById('date').value,
        totalAmount: parseFloat(document.getElementById('totalAmount').value),
        items: document.getElementById('items').value.split('\n')
            .map(item => item.trim())
            .filter(item => item.length > 0)
            .map(item => ({ description: item })),
        rawText: document.getElementById('rawText').value
    };

    try {
        console.log('Saving bill data:', billData);
        const response = await fetch('/api/save-ocr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(billData),
        });

        if (response.ok) {
            alert('Bill data saved successfully!');
            window.location.href = '/employee/bills';  // Redirect to bills list
        } else {
            const data = await response.json();
            alert(`Error saving bill data: ${data.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error saving bill data. Please try again.');
    }
}

// Initialize OCR when the page loads
window.addEventListener('load', () => {
    console.log('Page loaded, initializing OCR...');
    document.getElementById('imageInput').disabled = true; // Disable until OCR is ready
    document.getElementById('extractedFields').style.display = 'none'; // Hide fields initially
    initializeOCR();
});