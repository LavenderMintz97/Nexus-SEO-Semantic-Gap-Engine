export type SemanticGapType = 
  | 'Entity Co-occurrence' 
  | 'Latent User Need' 
  | 'Empirical Evidence' 
  | 'SERP Feature Gap' 
  | 'Contrarian Angle';

export interface SemanticGap {
  concept: string;
  relevance: number; // 0-100
  competitorCoverage: number; // 0-100 (how well others cover it)
  opportunityScore: number; // 0-100
  description: string;
  suggestedContent: string;
  gapType?: SemanticGapType;
  searchIntentNuance?: string;
  serpTarget?: string;
}

export interface EntityKnowledgeNode {
  entity: string;
  category: string; // e.g. 'Technology', 'Methodology', 'Industry Standard', 'Metric', 'Regulatory'
  salience: number; // 0-100
  competitorStatus: 'Absent' | 'Superficial' | 'Covered';
  suggestedPlacement: string;
}

export interface SERPFeatureOpportunity {
  feature: 'Featured Snippet' | 'AI Overview' | 'People Also Ask' | 'Direct Answer' | 'Comparative Table';
  queryAngle: string;
  recommendedFormat: string;
  winningFactor: string;
}

export interface CompetitorBlindSpot {
  concept: string;
  competitorCoverage: number; // 0-100%
  yourOpportunity: number; // 0-100%
  tactic: string;
}

export interface CompetitorAudit {
  competitorDomain: string;
  competitorStrengths: string[];
  blindSpots: CompetitorBlindSpot[];
  whitespaceOpportunities: string[];
  counterStrategy: string;
}

export interface SEOAnalysis {
  id: string;
  timestamp: number;
  keyword: string;
  competitor?: string;
  competitorAudit?: CompetitorAudit;
  primaryIntent: 'Informational' | 'Transactional' | 'Navigational' | 'Commercial';
  semanticGaps: SemanticGap[];
  informationGainPotential: number; // 0-100
  topicalAuthorityScore?: number; // 0-100
  contentDepthScore?: number; // 0-100
  entityGraph?: EntityKnowledgeNode[];
  serpOpportunities?: SERPFeatureOpportunity[];
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
