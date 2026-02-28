import { GoogleGenerativeAI } from "@google/generative-ai";

// API Key configuration with fallback for development/demo
const getApiKey = () => {
  // Check for Vite environment variable
  if (import.meta.env.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  // Check for potential Next.js style environment variable (in case of hybrid setup)
  // @ts-ignore
  if (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    // @ts-ignore
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  }
  // Fallback to provided key for demo purposes
  return "AIzaSyDg2NPqcGJ8wrVi5m5G_rtMrerTV1eKnaI";
};

const API_KEY = getApiKey();
const genAI = new GoogleGenerativeAI(API_KEY);

export interface AnalysisResult {
  skinType: string;
  sensitivity: string;
  concerns: { area: string; issue: string; severity: string }[];
  strengths: { title: string; description: string }[];
  mainGoal: string;
  routine: { step: string; title: string; description: string; ingredients: string }[];
}

export async function analyzeSkin(imageBase64: string): Promise<AnalysisResult> {
  try {
    // Using gemini-2.5-flash as requested for stability
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Act as a professional dermatologist. Analyze this face scan carefully.
    Identify skin type, key concerns (wrinkles, dark circles, acne, etc.), and strengths.
    Create a personalized skincare routine.
    
    Return a STRICT JSON object with this exact schema:
    {
      "skinType": "Normal" | "Oily" | "Dry" | "Combination",
      "sensitivity": "Low" | "Medium" | "High",
      "concerns": [
        { "area": "Cheeks" | "Forehead" | "T-Zone" | "Eyes" | "Chin", "issue": "Short description", "severity": "Low" | "Medium" | "High" }
      ],
      "strengths": [
        { "title": "Short Title", "description": "Short positive description" }
      ],
      "mainGoal": "One clear main skincare goal",
      "routine": [
        { "step": "Step 1", "title": "Cleansing", "description": "Specific instruction", "ingredients": "Key active ingredients" },
        { "step": "Step 2", "title": "Treatment", "description": "Specific instruction", "ingredients": "Key active ingredients" },
        { "step": "Step 3", "title": "Hydration", "description": "Specific instruction", "ingredients": "Key active ingredients" },
        { "step": "Step 4", "title": "Protection", "description": "Specific instruction", "ingredients": "Key active ingredients" }
      ]
    }`;

    // Robust Base64 handling
    const base64Data = imageBase64.includes("base64,") 
      ? imageBase64.split("base64,")[1] 
      : imageBase64;

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    
    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    try {
      const parsedData = JSON.parse(cleanText);
      return parsedData;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw Text:", text);
      throw new Error("Failed to parse analysis results");
    }

  } catch (error: any) {
    console.error("Gemini Analysis Failed:", error);
    
    // Specific error handling for 500/Server Errors
    if (error.message?.includes("500") || error.status === 500) {
      throw new Error("Server Busy");
    }
    
    throw new Error("Analysis Failed. Please try again.");
  }
}

export async function chatWithAI(message: string, context: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
    You are a friendly, expert AI skincare assistant.
    User's Skin Analysis Context: ${JSON.stringify(context)}
    
    User Message: ${message}
    
    Reply in a helpful, concise, and friendly manner. Keep it short (under 3 sentences unless detailed explanation is asked).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
}
