"use client";

import { useState } from "react";
import { extractDetailsFromPrompt } from "@/lib/googleAI"; // ✅ Import AI function
import { saveInvoiceData } from "@/lib/firebase"; // ✅ Import Firebase function

import Chat from "../chat";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return; // Prevent empty prompts
    setLoading(true);
    setResponse("");

    try {
      const extractedData = await extractDetailsFromPrompt(prompt);
      
      if (extractedData && extractedData.invoice_no && extractedData.emp_name) {
        await saveInvoiceData(extractedData.invoice_no, extractedData.emp_name);
        setResponse(`Saved: Invoice No: ${extractedData.invoice_no}, Employee: ${extractedData.emp_name}`);
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
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Extract Invoice Details</h1>

      <textarea
        rows="4"
        placeholder="Enter text containing Invoice No & Employee Name..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
      />

      <button onClick={handleGenerate} disabled={loading} style={{ marginTop: "10px" }}>
        {loading ? "Extracting..." : "Extract & Save"}
      </button>

      {response && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <strong>Result:</strong>
          <p>{response}</p>
        </div>
      )}

<Chat />

    </div>
  );
}
