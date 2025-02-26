"use client";

import { useState } from "react";
import { extractDetailsFromPrompt } from "@/lib/googleAI";
import { saveInvoiceData } from "@/lib/firebase";
import Chat from "../chat";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const extractedData = await extractDetailsFromPrompt(prompt);
      
      if (extractedData?.invoice_no && extractedData?.emp_name) {
        await saveInvoiceData(extractedData.invoice_no, extractedData.emp_name);
        setResponse(`✅ Saved: Invoice No: ${extractedData.invoice_no}, Employee: ${extractedData.emp_name}`);
      } else {
        setResponse("⚠️ Could not extract details. Please check your input.");
      }
    } catch (error) {
      setResponse("⚠️ Error processing request.");
      console.error("Processing error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Extract Invoice Details</h1>
        <textarea
          rows="4"
          placeholder="Enter text containing Invoice No & Employee Name..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleGenerate} 
          disabled={loading} 
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Extracting..." : "Extract & Save"}
        </button>
        {response && (
          <div className="mt-4 p-3 border rounded-lg bg-gray-50 text-gray-700">
            <strong>Result:</strong>
            <p>{response}</p>
          </div>
        )}
      </div>
      <div className="mt-6 w-full max-w-lg">
        <Chat />
      </div>
    </div>
  );
}