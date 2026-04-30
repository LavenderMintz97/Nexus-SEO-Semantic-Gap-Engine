import { GoogleGenAI, Type } from "@google/genai";
import { SEOAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeSEO(keyword: string, context?: string): Promise<SEOAnalysis> {
  const prompt = `
    Analyze the following SEO target keyword: "${keyword}"
    ${context ? `Current context/content provided: "${context}"` : "No current content provided."}

    Task:
    Calculate the "Semantic Gaps" and "Information Gain" opportunities.
    Most SEO tools focus on keywords already used by competitors. 
    I want you to find concepts that are HIGHLY RELEVANT but LOW COVERAGE in the top search results.
    Provide a "Differentiator Strategy" that explains how to provide unique value that search engines crave (Helpful Content).

    Identify 5-7 semantic gaps.
    Identify 5-8 related keywords or topics that represent new discovery opportunities.
    Provide a detailed content outline designed for maximum information gain.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          keyword: { type: Type.STRING },
          primaryIntent: { 
            type: Type.STRING, 
            enum: ['Informational', 'Transactional', 'Navigational', 'Commercial'] 
          },
          semanticGaps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                concept: { type: Type.STRING },
                relevance: { type: Type.NUMBER },
                competitorCoverage: { type: Type.NUMBER },
                opportunityScore: { type: Type.NUMBER },
                description: { type: Type.STRING },
                suggestedContent: { type: Type.STRING }
              },
              required: ['concept', 'relevance', 'competitorCoverage', 'opportunityScore', 'description', 'suggestedContent']
            }
          },
          informationGainPotential: { type: Type.NUMBER },
          differentiatorStrategy: { type: Type.STRING },
          outline: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    heading: { type: Type.STRING },
                    subPoints: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    semanticFocus: { type: Type.STRING }
                  },
                  required: ['heading', 'subPoints', 'semanticFocus']
                }
              }
            },
            required: ['title', 'sections']
          },
          relatedKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ['keyword', 'primaryIntent', 'semanticGaps', 'informationGainPotential', 'differentiatorStrategy', 'outline', 'relatedKeywords']
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text);
}
