export interface StudentProfile {
  name: string;
  email: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  targetRole: string;
  targetCompanies: string[];
  skills: string[];
  resumeText: string;
  gitHubUrl: string;
  linkedInUrl: string;
  leetCodeUser: string;
  hackerRankUser: string;
  codeforcesUser: string;
  codeChefUser: string;
  interests?: string[];
  languages?: string[];
}

export type SkillCategory = 'Technical' | 'Soft Skills' | 'Core CS';

export interface SkillProgress {
  name: string;
  category: SkillCategory;
  currentLevel: number; // 1 to 10
  targetLevel: number;  // 1 to 10
  lastPracticeDate: string;
  progressPercentage: number;
  aiFeedback: string;
}

export interface RoadmapTask {
  id: string;
  phase: string;
  title: string;
  description: string;
  resource: string;
  duration: string;
  isCompleted: boolean;
  category: string;
  timeframe?: 'Daily' | 'Weekly' | 'Monthly';
  priority?: 'High' | 'Medium' | 'Low';
  isRevision?: boolean;
  type?: 'Study' | 'Revision' | 'Project' | 'Certification';
  associatedSkill?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  techStack: string[];
  description: string;
  gitHubUrl: string;
  liveDemoUrl: string;
  completionStatus: 'In Progress' | 'Completed';
  aiReview?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  userAnswer: string;
  aiFeedback: string;
  score: number; // 0 to 10
}

export interface InterviewSession {
  id: string;
  date: string;
  type: 'Technical' | 'HR';
  role: string;
  company: string;
  score: number; // 0 to 100
  questions: InterviewQuestion[];
  generalFeedback: string;
}

export interface CodingStats {
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  streak: number;
  contestRating: number;
  topicsPerformance: { topic: string; percentage: number }[];
  languagesUsed: { language: string; percentage: number }[];
}

export interface CompanyPrepPlan {
  company: string;
  readinessScore: number;
  requiredTechnicalSkills: string[];
  interviewPattern: string[];
  frequentlyAskedQuestions: string[];
  resumeSuggestions: string;
  importantTopics: string[];
}

export interface ResumeAnalysisResult {
  atsCompatibilityScore: number;
  formattingScore: number;
  grammarScore: number;
  keywordsScore: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  improvedBulletPoints: string[];
  measurableSuggestions: string[];
}

export interface DashboardOverview {
  placementReadinessScore: number;
  studyStreak: number;
  completedTasksCount: number;
  totalTasksCount: number;
  xpPoints: number;
  level: number;
  weeklyProgress: { day: string; studyHours: number; solvedCount: number }[];
}
