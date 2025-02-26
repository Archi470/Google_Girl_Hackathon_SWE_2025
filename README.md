# Google Girl Hackathon SWE 2025 – Project Setup  

### **Environment Configuration**  
1. **Create a `.env.local` file** in the root directory of your project and add the following environment variables:  
   - Firebase API keys  
   - Google AI Key  
   - AI Model: `gemini-1.5-pro`  

### **Firebase Authentication Setup**  
2. **Enable the Email/Password Sign-in Method** in Firebase:  
   - Navigate to **Firebase Console > Authentication > Sign-in Method**.  
   - Enable **Email/Password Authentication**.  
   - Add your email and password to test user authentication.  

### **Running the Development Server**  
3. Install dependencies and start the development server:  
   ```bash  
   npm install  
   npm run dev  
   ```  
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.  

### **Database Structure (Firestore)**  
4. **Collections Overview:**  
   - **`users`**: Stores registered user emails.  
   - **`invoices`**: Stores invoice-related data.  

### **AI Model Selection**  
5. **Using Google Gemini AI**  
   - The project utilizes **Gemini-1.5-Pro** for AI-based document processing and automation.  
   - Ensure your API key is configured in `.env.local`.  

### **AI Processing Logic**  
6. **Extracting Invoice Details**  
   - The AI extracts the employee name and invoice number from the given text.  
    
     ```json  
     {"invoice_no": null, "emp_name": null}  
     ```  
   - Example Input:  
     THE invoice_no is 123 and emp_name is abc.
     

### **Additional Resources**  
- Refer to the [Next.js Documentation](https://nextjs.org/docs) for framework guidance.
