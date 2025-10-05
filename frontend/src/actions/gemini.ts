import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
    apiKey: process.env.API_KEY,
})

export async function generateText(prompt: string) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{
            role: "user",
            parts: [{
                text: prompt,
                fileData: {
                    mimeType: "image/png",
                    fileUri: "https://example.com/image.png",
                }
            }],
        }],
    })
    return response.text
}
