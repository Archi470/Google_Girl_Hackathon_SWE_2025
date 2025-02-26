"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MessageCircle, X } from "lucide-react"; // ✅ Import Icons

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_AI_KEY;

export default function Chat() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Welcome to Enterprise Assist! How can I help with your invoices today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // ✅ Controls popup visibility

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]); // Append user message

    try {
      // Initialize Google Gemini AI
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // Enterprise-Specific Prompting
      const enterprisePrompt = `
        You are an AI assistant for a company specializing in **invoice processing**.
        Your tasks include:
        - Extracting **invoice numbers, employee details, and payment status**.
        - Answering **finance-related** inquiries.
        - Providing **guidance on company policies** related to invoices.

        User Query: ${input}
      `;

      // Generate response from Gemini
      const result = await model.generateContent({
        contents: [{ parts: [{ text: enterprisePrompt }] }],
      });

      const botMessage = { sender: "bot", text: result.response.text() };
      setMessages((prev) => [...prev, botMessage]); // Append bot response
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ AI Error: Unable to process your request." }]);
    }

    setLoading(false);
    setInput("");
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle size={24} />
      </button>

      {/* Popup Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-6 w-80 bg-white shadow-lg rounded-lg p-4 border">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold">Enterprise Chat</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-red-500">
              <X size={20} />
            </button>
          </div>

          <div className="h-60 overflow-y-auto border p-2 my-2 rounded">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 my-1 rounded ${
                  msg.sender === "user" ? "bg-blue-500 text-white text-right" : "bg-gray-200 text-black"
                }`}
              >
                <strong>{msg.sender === "user" ? "You" : "Bot"}: </strong> {msg.text}
              </div>
            ))}
          </div>

          <div className="flex">
            <input
              type="text"
              className="flex-grow border p-2 rounded"
              placeholder="Ask about invoices, payments, or company policies..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleSend} disabled={loading} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
