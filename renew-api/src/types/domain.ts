export type UserRole = "worker" | "company" | "admin";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type LearningLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface ProfessionRisk {
  profession: string;
  riskLevel: RiskLevel;
  description: string;
  trends: string[];
}

export interface LearningModule {
  id: string;
  title: string;
  durationHours: number;
  skills: string[];
  externalLink?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  targetProfession: string; // when transitioning to another role
  forCurrentProfession: boolean; // true if for upskilling in same role
  level: LearningLevel;
  modules: LearningModule[];
}
