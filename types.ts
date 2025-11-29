export type ViewState = 'intake' | 'session' | 'report' | 'archives';

export type AnalysisMode = 'CBT' | 'Psychoanalysis' | 'Humanistic';

export type Language = 'zh' | 'en';

export interface ClientInfo {
  name: string;
  age: string;
  gender: string;
  contact: string;
  initialProblem: string;
}

export interface Session {
  id: number;
  timestamp: string;
  clientStatement: string;
  analysis: string;
  plan: string;
  feedback: string;
  mode: AnalysisMode;
}

export interface Archive {
  id: string;
  lastModified: string;
  clientInfo: ClientInfo;
  sessions: Session[];
  executiveSummary: string;
  comprehensivePlan: string;
  analysisMode: AnalysisMode;
  language: Language; // Track language of the archive
}

export interface ReportData {
  executiveSummary: string;
  comprehensivePlan: string;
}

export interface GeminiResponse {
  analysis: string;
  plan: string;
}