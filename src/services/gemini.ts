import { GoogleGenerativeAI } from "@google/generative-ai";
import { SkinAnalysisResult } from "../types";

export const analyzeSkin = async (imageBase64: string): Promise<SkinAnalysisResult | { error: true }> => {
  try {
    // 1. Lazy Initialize API Key inside the function
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
      console.warn("[Skin Service] API Key missing");
      return { error: true };
    }

    // 2. Initialize Client
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. Clean the Base64 string (Strict Rule)
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    if (!cleanBase64) {
      return { error: true };
    }

    // 4. Prepare the prompt
    const prompt = `
      Act as a professional dermatologist. Analyze this face scan carefully.
      Return a STRICT JSON object (no markdown, no code blocks) with the following structure:
      {
        "skinType": "Oily" | "Dry" | "Combination" | "Normal" | "Sensitive",
        "sensitivity": "Low" | "Medium" | "High",
        "mainGoal": "Clear Acne" | "Reduce Wrinkles" | "Hydrate",
        "concerns": [
          { "area": "Forehead", "issue": "Fine lines", "severity": "Mild" },
          { "area": "Cheeks", "issue": "Redness", "severity": "Medium" }
        ],
        "strengths": [
          { "title": "Jawline", "description": "Well defined" }
        ],
        "routine": [
          { "step": "1", "title": "Cleanser", "description": "Gentle Foaming Cleanser", "ingredients": "Salicylic Acid" }
        ],
      }
    `;

    // 5. Call the API
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: cleanBase64,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // 6. Parse JSON safely
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    try {
      const data = JSON.parse(jsonString) as SkinAnalysisResult;
      // Basic validation
      if (!data.skinType || !data.routine) {
        throw new Error("Invalid response structure");
      }
      return data;
    } catch (parseError) {
      console.error("[Skin Service] JSON Parse Error", parseError);
      return { error: true };
    }

  } catch (error) {
    // GLOBAL ERROR INTERCEPTOR
    // Swallow all errors (403, 500, etc) and return simplified error object
    console.error("[Skin Service] Request Failed", error);
    return { error: true };
  }
};

export const chatWithAI = async (message: string, context?: SkinAnalysisResult | null): Promise<string> => {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (!API_KEY) return "I'm having trouble connecting right now. Please try again later.";

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a helpful skincare assistant. Keep answers brief and friendly." }],
        },
        {
          role: "model",
          parts: [{ text: "Hello! I'm here to help you with your skincare journey." }],
        },
      ],
    });

    let contextPrompt = message;
    if (context) {
        contextPrompt = `
        Context about my skin:
        Type: ${context.skinType}
        Concerns: ${context.concerns.map(c => c.issue).join(", ")}
        
        My Question: ${message}
        `;
    }

    const result = await chat.sendMessage(contextPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    return "I'm having trouble connecting right now. Please try again later.";
  }
};
