import { GoogleGenAI } from "@google/genai";

export async function generateWatchImage() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = "Hyper-realistic 3D render of a futuristic smartwatch, floating at a 45-degree angle. Titanium black body, circular holographic screen displaying a cyan-colored heart rate graph. Professional studio lighting with cyan rim light. Isolated on a transparent background, no background, no shadows on floor, 8k resolution, Unreal Engine 5 render style.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Error generating image:", error);
    // Fallback to a placeholder if generation fails
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000";
  }
  return null;
}
