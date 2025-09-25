import { GoogleGenerativeAI } from '@google/generative-ai';

// UPDATED: Your new, working API key has been added.
const GEMINI_API_KEY = "AIzaSyCmhgTbsPlcQXBBiB_4O0GnEB9GhU40dyY";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function analyzeContentWithGemini(articleText, domain) {
    if (!articleText) {
        throw new Error("Article text cannot be empty.");
    }

    const prompt = `
        Please analyze the following news article content and its source domain.
        Provide your analysis in a strict JSON format. Do not include any text outside of the JSON object.

        The JSON object should have three keys:
        1. "classification": A string, either "REAL" or "FAKE".
        2. "confidenceScore": A number between 0 and 1 representing your confidence in the classification.
        3. "sourceCredibility": A brief, neutral, 2-3 sentence analysis of the news source with the domain "${domain}".

        Here is the article text to analyze:
        ---
        ${articleText.substring(0, 8000)}
        ---
    `;

    try {
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        
        const jsonString = responseText.match(/```json\n([\s\S]*?)\n```/)?.[1] || responseText;
        
        const parsedResult = JSON.parse(jsonString);

        return {
            classification: {
                label: parsedResult.classification || 'Error',
                score: parsedResult.confidenceScore || 0,
            },
            sourceAnalysis: {
                credibility: parsedResult.sourceCredibility || "Could not analyze source.",
                domain: domain,
            }
        };

    } catch (error) {
        console.error("Gemini Full Analysis Error:", error);
        throw new Error(`Gemini API Error: ${error.message}`);
    }
}