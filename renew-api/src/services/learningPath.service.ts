import { LearningPathModel } from "../models/learningPath.model";
import { LearningPath } from "../types/domain";

export interface LearningPathFilters {
  targetProfession?: string;
  forCurrentProfession?: boolean;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

export class LearningPathService {
  static async list(
    filters: LearningPathFilters = {}
  ): Promise<LearningPath[]> {
    const query: any = {};
    if (filters.targetProfession) {
      // Use exact match to avoid returning other professions containing the substring
      query.targetProfession = filters.targetProfession;
    }
    if (filters.forCurrentProfession !== undefined) {
      query.forCurrentProfession = filters.forCurrentProfession;
    }
    if (filters.level) {
      query.level = filters.level;
    }
    const docs = await LearningPathModel.find(query).exec();
    return docs.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      targetProfession: d.targetProfession,
      forCurrentProfession: d.forCurrentProfession,
      level: d.level,
      modules: d.modules.map((m) => ({
        id: m.id,
        title: m.title,
        durationHours: m.durationHours,
        skills: m.skills,
        externalLink: m.externalLink,
      })),
    }));
  }

  static async getById(id: string): Promise<LearningPath | undefined> {
    const doc = await LearningPathModel.findOne({ id }).exec();
    if (!doc) return undefined;
    return {
      id: doc.id,
      title: doc.title,
      description: doc.description,
      targetProfession: doc.targetProfession,
      forCurrentProfession: doc.forCurrentProfession,
      level: doc.level,
      modules: doc.modules.map((m) => ({
        id: m.id,
        title: m.title,
        durationHours: m.durationHours,
        skills: m.skills,
        externalLink: m.externalLink,
      })),
    };
  }
}
