# Google Girl Hackathon SWE 2025 – Project Setup

## Data Entry from Text File

### **Go to the project folder:**
   ```bash
   cd path/to/Google_Girl_Hackathon_SWE_2025/data_entry_from_text_file
   ```

### **Environment Configuration**
Create a `.env.local` file in the root directory of your project and add the following environment variables:
- Firebase API keys
- Google AI Key
- AI Model: `gemini-1.5-pro`

### **Firebase Authentication Setup**
Enable the Email/Password Sign-in Method in Firebase:
- Navigate to **Firebase Console > Authentication > Sign-in Method**.
- Enable **Email/Password Authentication**.
- Add your email and password to test user authentication.

### **Running the Development Server**
Install dependencies and start the development server:
```bash
npm install  
npm run dev 
npm install -D tailwindcss postcss autoprefixer
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### **Database Structure (Firestore)**
#### **Collections Overview:**
- **`users`**: Stores registered user emails.
- **`invoices`**: Stores invoice-related data.

### **AI Model Selection**
#### **Using Google Gemini AI**
- The project utilizes **Gemini-1.5-Pro** for AI-based document processing and automation.
- Ensure your API key is configured in `.env.local`.

### **AI Processing Logic**
#### **Extracting Invoice Details**
The AI extracts the employee name and invoice number from the given text.

```json
{"invoice_no": null, "emp_name": null}
```
**Example Input:**  
```
THE invoice_no is 123 and emp_name is abc.
```

---

## Data Entry from Image File (Deployed)
### **Document Processing System with OCR**
A web application designed to streamline document processing for employees, featuring advanced Python-based OCR capabilities and intelligent data extraction.

### **Features**
- OCR-powered bill processing using Tesseract
- Natural Language Processing for data extraction
- Interactive chat interface with AI responses
- Bill management and reporting
- Data visualization and export capabilities

### **Tech Stack**
- **Backend:** Flask (Python)
- **Database:** PostgreSQL with SQLAlchemy
- **OCR Engine:** Tesseract with Python bindings
- **NLP:** spaCy for text processing
- **Frontend:** Bootstrap with dark theme
- **AI Integration:** Google Gemini API for chat

### **Environment Variables Required**
Make sure to set up the following environment variables:
- `DATABASE_URL`: PostgreSQL database connection URL
- `GEMINI_API_KEY`: Google Gemini API key for chat functionality
- `SESSION_SECRET`: Secret key for Flask sessions

### **Setup Instructions**
1. **Go to the project folder:**
   ```bash
   cd path/to/Google_Girl_Hackathon_SWE_2025/data_entry_from_image_file
   ```
2. **Install required system dependencies:**
   - Python 3.11
   - PostgreSQL
   - Tesseract OCR
3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Set up environment variables (mentioned above).**
5. **Initialize the database:**
   ```bash
   flask db upgrade
   ```
6. **Run the application:**
   ```bash
   python main.py
   ```

### **Deployment & Live Demo**
Access the deployed version for image-based data entry:  
🔗 **[Live Demo](http://bit.ly/4gWcnaP)**

### **Contributing**
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
