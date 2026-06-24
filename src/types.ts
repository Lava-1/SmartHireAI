export type Company = 
  | 'Amazon' 
  | 'Google' 
  | 'Microsoft' 
  | 'Apple' 
  | 'Meta' 
  | 'Netflix' 
  | 'Tesla' 
  | 'TCS' 
  | 'Startup';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type InterviewRound = 'Behavioral' | 'Technical Deep-Dive' | 'Live Coding';

export type QuestionCategory = 'Behavioral' | 'System Design' | 'DSA' | 'Leadership' | 'Project-based' | 'Troubleshooting';

export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
  expectedKeywords?: string[];
  round?: InterviewRound;
}

export interface EvaluationResult {
  questionId: string;
  questionText: string;
  answerText: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  betterAnswer?: string;
  detectedEmotions: string[];
  focusPercentage: number;
  timeTakenSec: number;
  codeEval?: CodeEvaluationResult;
}

export interface CodeEvaluationResult {
  score: number;
  timeComplexity: string;
  spaceComplexity: string;
  feedback: string;
  optimizationTips: string[];
  testCasesStatus: string;
}

export interface RadarScores {
  Communication: number;
  Technical: number;
  ProblemSolving: number;
  CultureFit: number;
  CodeEfficiency: number;
}

export interface RoadmapItem {
  week: string;
  topic: string;
  action: string;
}

export interface FinalReport {
  overallScore: number;
  verdict: string;
  summary: string;
  radarScores: RadarScores;
  strengths: string[];
  weaknesses: string[];
  improvementRoadmap: RoadmapItem[];
}

export interface InterviewSession {
  id: string;
  timestamp: number;
  role: string;
  company: Company;
  difficulty: Difficulty;
  selectedRounds: InterviewRound[];
  overallScore?: number;
  verdict?: string;
  report?: FinalReport;
  evaluations: EvaluationResult[];
}

export interface CompanyProfileInfo {
  name: Company;
  logoUrl: string;
  color: string;
  tagline: string;
  philosophy: string;
}
