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
  description?: string; // 사용자가 입력한 요구사항
}
