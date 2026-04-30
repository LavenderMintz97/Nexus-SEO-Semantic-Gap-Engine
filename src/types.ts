export interface SemanticGap {
  concept: string;
  relevance: number; // 0-100
  competitorCoverage: number; // 0-100 (how well others cover it)
  opportunityScore: number; // 0-100
  description: string;
  suggestedContent: string;
}

export interface SEOAnalysis {
  id: string;
  timestamp: number;
  keyword: string;
  primaryIntent: 'Informational' | 'Transactional' | 'Navigational' | 'Commercial';
  semanticGaps: SemanticGap[];
  informationGainPotential: number; // 0-100
  differentiatorStrategy: string;
  outline: {
    title: string;
    sections: {
      heading: string;
      subPoints: string[];
      semanticFocus: string;
    }[];
  };
  relatedKeywords: string[];
}

export type AppState = 'landing' | 'analyzing' | 'results' | 'history' | 'compare';
