export enum TutorialStep {
  MODEL_SELECTION = 0,
  ADD_SELFIE = 1,
  CHOOSE_CONCEPT = 2,
  ADD_PROMPT = 3,
  EDIT_AND_FINALIZE = 4
}

export interface PanelData {
  id: TutorialStep;
  title: string;
  description: string;
  shortDesc: string;
  instruction: string;
  comicScript: string;
  imageSeed: string;
  accentColor: string;
}

export interface UserState {
  modelSelected: string;
  thinkingEnabled: boolean;
  selfieImage: string | null; // Data URL or URL representation
  conceptSelected: 'plushie' | 'mohawk' | 'figurine' | null;
  promptText: string;
  currentStep: TutorialStep;
}

// 💼 CAREER SUITE TYPES

export type RoleMode = 'admin' | 'candidate' | 'visitor';

export interface McpConnector {
  id: string;
  name: string;
  category: 'Scraper' | 'Gmail' | 'Docs' | 'Gemini' | 'Search';
  description: string;
  status: 'active' | 'inactive';
  requiredKey: string;
  apiKeyValue: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  experience: {
    role: string;
    company: string;
    duration: string;
    bulletPoints: string[];
  }[];
  skills: string[];
  education: string;
}

export interface WishlistApplicant {
  id: string;
  name: string;
  email: string;
  reason: string;
  roleRequested: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ScrapedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  responsibilities: string[];
  preferredKeywords: string[];
  rawText: string;
}
