import { GoogleGenAI, Type } from "@google/genai";
import { SEOAnalysis, CompetitorAudit } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeSEO(keyword: string, context?: string, competitor?: string): Promise<SEOAnalysis> {
  const prompt = `
    Analyze the following SEO target keyword: "${keyword}"
    ${context ? `Current context/content provided: "${context}"` : "No current content provided."}
    ${competitor ? `Primary competitor to benchmark against: "${competitor}"` : ""}

    Task:
    Calculate the "Semantic Gaps" and "Information Gain" opportunities with deep semantic SEO precision.
    Most SEO tools focus on keywords already saturated by competitors. 
    We want to find concepts that are HIGHLY RELEVANT but LOW COVERAGE in top SERPs to maximize Google's Information Gain scoring (Patent US 10,698,958 B2) and AI Overview citations.

    Provide:
    1. 5-7 semantic gaps, categorized by archetype (Entity Co-occurrence, Latent User Need, Empirical Evidence, SERP Feature Gap, Contrarian Angle) with concrete suggested content, search intent nuance, and SERP target.
    2. Entity Knowledge Graph analysis: 5-8 salient entities (Wikidata/Google Knowledge Graph concepts) that establish true topical authority, their category, salience score (0-100), competitor status (Absent, Superficial, or Covered), and placement advice.
    3. SERP Feature & AI Overview Opportunities: 3-4 specific opportunities to capture Google AI Overview citations, Featured Snippets, Comparative Tables, or PAA boxes.
    4. Differentiator Strategy explaining how to provide unique value and out-reason competitors.
    5. Content outline designed for maximum information gain with headings, subpoints, and semantic focus.
    6. 5-8 related keywords/topics representing new discovery opportunities.
    ${competitor ? `7. A thorough competitor gap audit for "${competitor}", detailing their strengths, their blind spots, uncontested whitespace topics, and a counter-strategy.` : ""}
  `;

  const properties: Record<string, any> = {
    keyword: { type: Type.STRING },
    primaryIntent: { 
      type: Type.STRING, 
      enum: ['Informational', 'Transactional', 'Navigational', 'Commercial'] 
    },
    informationGainPotential: { type: Type.NUMBER },
    topicalAuthorityScore: { type: Type.NUMBER },
    contentDepthScore: { type: Type.NUMBER },
    differentiatorStrategy: { type: Type.STRING },
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
          suggestedContent: { type: Type.STRING },
          gapType: { 
            type: Type.STRING, 
            enum: ['Entity Co-occurrence', 'Latent User Need', 'Empirical Evidence', 'SERP Feature Gap', 'Contrarian Angle'] 
          },
          searchIntentNuance: { type: Type.STRING },
          serpTarget: { type: Type.STRING }
        },
        required: ['concept', 'relevance', 'competitorCoverage', 'opportunityScore', 'description', 'suggestedContent']
      }
    },
    entityGraph: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          entity: { type: Type.STRING },
          category: { type: Type.STRING },
          salience: { type: Type.NUMBER },
          competitorStatus: { 
            type: Type.STRING, 
            enum: ['Absent', 'Superficial', 'Covered'] 
          },
          suggestedPlacement: { type: Type.STRING }
        },
        required: ['entity', 'category', 'salience', 'competitorStatus', 'suggestedPlacement']
      }
    },
    serpOpportunities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          feature: { 
            type: Type.STRING, 
            enum: ['Featured Snippet', 'AI Overview', 'People Also Ask', 'Direct Answer', 'Comparative Table'] 
          },
          queryAngle: { type: Type.STRING },
          recommendedFormat: { type: Type.STRING },
          winningFactor: { type: Type.STRING }
        },
        required: ['feature', 'queryAngle', 'recommendedFormat', 'winningFactor']
      }
    },
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
  };

  const requiredFields = ['keyword', 'primaryIntent', 'semanticGaps', 'informationGainPotential', 'differentiatorStrategy', 'outline', 'relatedKeywords'];

  if (competitor) {
    properties.competitor = { type: Type.STRING };
    properties.competitorAudit = {
      type: Type.OBJECT,
      properties: {
        competitorDomain: { type: Type.STRING },
        competitorStrengths: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        blindSpots: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              concept: { type: Type.STRING },
              competitorCoverage: { type: Type.NUMBER },
              yourOpportunity: { type: Type.NUMBER },
              tactic: { type: Type.STRING }
            },
            required: ['concept', 'competitorCoverage', 'yourOpportunity', 'tactic']
          }
        },
        whitespaceOpportunities: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        counterStrategy: { type: Type.STRING }
      },
      required: ['competitorDomain', 'competitorStrengths', 'blindSpots', 'whitespaceOpportunities', 'counterStrategy']
    };
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties,
        required: requiredFields
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  const parsed = JSON.parse(text);
  if (competitor && !parsed.competitor) {
    parsed.competitor = competitor;
  }
  return parsed;
}

export async function analyzeCompetitorGap(keyword: string, competitorDomain: string): Promise<CompetitorAudit> {
  const prompt = `
    Conduct a granular semantic gap check for keyword: "${keyword}" against competitor domain/brand: "${competitorDomain}".
    
    Identify:
    1. Competitor Strengths: 2-3 specific angles/entities this competitor covers heavily or ranks well for.
    2. Competitor Blind Spots: 3-5 specific subtopics or technical nuances that this competitor completely glosses over or handles superficially.
    3. Whitespace Opportunities: 3-4 adjacent or latent search intent angles that the competitor does not address at all.
    4. Counter-Strategy: The definitive editorial strategy to out-reason and out-rank this competitor with higher Information Gain.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          competitorDomain: { type: Type.STRING },
          competitorStrengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          blindSpots: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                concept: { type: Type.STRING },
                competitorCoverage: { type: Type.NUMBER },
                yourOpportunity: { type: Type.NUMBER },
                tactic: { type: Type.STRING }
              },
              required: ['concept', 'competitorCoverage', 'yourOpportunity', 'tactic']
            }
          },
          whitespaceOpportunities: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          counterStrategy: { type: Type.STRING }
        },
        required: ['competitorDomain', 'competitorStrengths', 'blindSpots', 'whitespaceOpportunities', 'counterStrategy']
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  const parsed = JSON.parse(text);
  if (!parsed.competitorDomain) parsed.competitorDomain = competitorDomain;
  return parsed;
}
