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

### **Additional Resources**  
- Refer to the [Next.js Documentation](https://nextjs.org/docs) for framework guidance.  
