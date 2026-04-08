
import { GoogleGenAI, Type } from "@google/genai";
import { Classification, DetectionResult } from "../types";

/**
 * Orchestrates the detection pipeline. 
 * Uses Gemini-3-Flash for low-latency multimodal reasoning to perform forensic audio analysis.
 */
export async function detectVoiceAuthenticity(base64Audio: string, duration: number): Promise<DetectionResult> {
  // Always initialize GoogleGenAI inside the function to use the most recent API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    ROLE: LEAD FORENSIC AUDIO ANALYST (TRUEVOICE LABS).
    TASK: Analyze the provided audio for signs of AI/Deepfake synthesis vs. Organic Human Speech.
    
    CRITICAL: 
    1. Scan the entire file. Look for segments where natural room tone suddenly shifts to digital silence.
    2. Identify "Robot-Cadence": perfectly timed speech with zero breathing artifacts.
    3. HYBRID DETECTION: Check if a real person's voice was used as a "hook" before switching to AI.

    OUTPUT:
    Return JSON with classification (HUMAN, AI_GENERATED, or HYBRID), confidence (0.5-1.0), language, and a 2-sentence analysis_report.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Switched to Flash for speed
      contents: [
        {
          parts: [
            { text: prompt },
            { 
              inlineData: { 
                data: base64Audio, 
                mimeType: "audio/mp3" 
              } 
            }
          ]
        }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for maximum speed/low latency
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classification: { 
                type: Type.STRING, 
                description: "AI_GENERATED, HUMAN, or HYBRID" 
            },
            confidence: { 
                type: Type.NUMBER, 
                description: "Probability score" 
            },
            language: { 
                type: Type.STRING, 
                description: "Detected language" 
            },
            analysis_report: { 
                type: Type.STRING, 
                description: "Brief forensic findings" 
            }
          },
          required: ["classification", "confidence", "language", "analysis_report"]
        }
      }
    });

    const textResult = response.text?.trim() || "{}";
    const data = JSON.parse(textResult);
    
    return {
      classification: data.classification as Classification,
      confidence: data.confidence,
      language: data.language,
      audio_duration_sec: duration,
      model_version: "truevoice-v3.5-flash-fast",
      analysis_report: data.analysis_report
    };
  } catch (error) {
    console.error("TrueVoice Detection Error:", error);
    throw error;
  }
}
