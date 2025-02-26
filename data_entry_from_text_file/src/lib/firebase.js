import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { db } from "./firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, db, storage };

//  Function to save extracted details to Firestore
export async function saveInvoiceData(invoice_no, emp_name) {
  try {
    if (!invoice_no) {
      throw new Error("Invalid invoice number");
    }
    const docRef = doc(db, "invoices", invoice_no); // Store by invoice_no
    await setDoc(docRef, { invoice_no, emp_name, timestamp: new Date() });

    console.log("Data saved to Firebase successfully.");
  } catch (error) {
    console.error("Error saving to Firebase:", error);
  }
}
