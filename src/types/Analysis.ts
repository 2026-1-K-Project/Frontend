export interface AnalysisData {
  id?: string;
  title?: string;
  date?: string;
  resultScore: number;
  shareMe: number;
  sharePartner: number;
  replyTime: string;
  syncIndex: number;
  keywords: string[];
  mbti: string;
  attachment: string;
  bigFive: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  moment: string;
  tips: string;
  warning: string;
  description?: string;
  analysisSummary?: string;
  evidence?: string[];
  riskSignals?: string[];
  recommendedQuestions?: string[];
  recommendedReplies?: string[];
  aiDeepAnalysis?: AiDeepAnalysis;
}

export interface AiDeepAnalysis {
  verdict: string;
  confidence: number;
  relationshipStage: string;
  oneLineSummary: string;
  positiveSignals: AiConversationEvidence[];
  riskSignals: AiConversationEvidence[];
  counterpartyStyle: string;
  userPattern: string;
  nextActions: AiNextAction[];
  avoidMessages: AiAvoidMessage[];
}

export interface AiConversationEvidence {
  type: 'POSITIVE' | 'RISK';
  label: string;
  quote: string;
  reason: string;
  strength: number;
}

export interface AiNextAction {
  title: string;
  message: string;
  why: string;
}

export interface AiAvoidMessage {
  message: string;
  why: string;
}
