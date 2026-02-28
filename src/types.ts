export interface Concern {
  area: string;
  issue: string;
  severity: string;
}

export interface Strength {
  title: string;
  description: string;
}

export interface RoutineStep {
  step: string;
  title: string;
  description: string;
  ingredients: string;
}

export interface SkinAnalysisResult {
  skinType: string;
  sensitivity: string;
  concerns: Concern[];
  strengths: Strength[];
  mainGoal: string;
  routine: RoutineStep[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
