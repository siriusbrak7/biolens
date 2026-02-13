import { GoogleGenAI, Type, Schema } from '@google/genai';
import { GeneratedContent } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('API Key is required. Please set VITE_GEMINI_API_KEY in your .env.local file');
}

const ai = new GoogleGenAI({ apiKey });

const contentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    notes: {
      type: Type.STRING,
      description: "Comprehensive study notes in Markdown format. Use headers (#, ##), bullet points, and bold text for key terms.",
    },
    visuals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          prompt: { type: Type.STRING, description: "A highly detailed, descriptive prompt for an educational diagram or illustration (e.g., 'A cross-section diagram of a mitochondrion with labels for matrix and cristae on a white background')." },
          caption: { type: Type.STRING, description: "A short, educational caption explaining the diagram." }
        },
        required: ["prompt", "caption"]
      },
      description: "Generate 2 distinct visual aids (diagrams or illustrations) that help explain the most complex parts of this topic.",
    },
    flashcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          front: { type: Type.STRING, description: "The term or concept." },
          back: { type: Type.STRING, description: "The definition or explanation." },
        },
        required: ["front", "back"],
      },
      description: "5 key flashcards for the topic.",
    },
    checkpoints: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswerIndex: { type: Type.INTEGER, description: "Index of the correct option (0-3)." },
          explanation: { type: Type.STRING, description: "Explanation of why the answer is correct." },
        },
        required: ["question", "options", "correctAnswerIndex", "explanation"],
      },
      description: "3 multiple choice questions to test understanding.",
    },
    lab: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        objective: { type: Type.STRING },
        materials: { type: Type.ARRAY, items: { type: Type.STRING } },
        procedure: { type: Type.ARRAY, items: { type: Type.STRING } },
        safety: { type: Type.STRING },
      },
      required: ["title", "objective", "materials", "procedure", "safety"],
      description: "A virtual lab experiment guide related to the topic.",
    },
  },
  required: ["notes", "visuals", "flashcards", "checkpoints", "lab"],
};

export const generateTopicContent = async (unitName: string, topicName: string): Promise<GeneratedContent | null> => {
  try {
    const prompt = `Generate educational content for a high school biology course.
    Unit: ${unitName}
    Topic: ${topicName}

    Please provide:
    1. Study notes (markdown).
    2. 2 Visual Aid descriptions (for generating diagrams).
    3. 5 Flashcards.
    4. 3 Quiz Questions.
    5. A Virtual Lab.
    
    Make the tone engaging and student-friendly.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: contentSchema,
        systemInstruction: "You are an expert biology teacher. Focus on clear explanations and visual learning. Use markdown for the notes section, including bold text, lists, and headers.",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedContent;
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error (Text Content):", error);
    throw error;
  }
};

export const generateBiologyImage = async (prompt: string): Promise<string | null> => {
  try {
    // We enhance the prompt to ensure the style is consistent (textbook diagram style)
    const enhancedPrompt = `educational science illustration, biology textbook style, white background, high resolution, clear details: ${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        parts: [
          { text: enhancedPrompt }
        ]
      },
    });

    // The SDK returns parts; we need to find the inlineData part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error (Image Generation):", error);
    return null;
  }
};