import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function extractDetailsFromPrompt(prompt) {
  const aiPrompt = `
    Extract the employee name and invoice number from the following text.
    Return the output **strictly as a valid JSON object** without any extra formatting.
    If no valid data is found, return: {"invoice_no": null, "emp_name": null}.
    
    Text: "${prompt}"
  `;

  try {
    const model = genAI.getGenerativeModel({ model: process.env.NEXT_PUBLIC_GOOGLE_AI_MODEL });
    const result = await model.generateContent(aiPrompt);

    // Get response text
    let responseText = await result.response.text();
    console.log("Raw AI Response:", responseText); // Debugging output

    //  Remove markdown formatting (e.g., ```json ... ```)
    responseText = responseText.replace(/```json|```/g, "").trim();

    //  Parse JSON safely
    let extractedData;
    try {
      extractedData = JSON.parse(responseText);
    } catch (jsonError) {
      console.error("Invalid JSON format from AI:", responseText);
      return { invoice_no: null, emp_name: null }; // Prevent crashes
    }

    if (!extractedData.invoice_no || !extractedData.emp_name) {
      console.warn("No valid details found in the text.");
      return extractedData;
    }

    return extractedData;

  } catch (error) {
    console.error("Error extracting details:", error);
    return { invoice_no: null, emp_name: null };
  }
}
