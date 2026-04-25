import { levels } from "./levels";
import type { ProgressState } from "./types";

const STORAGE_KEY = "seat-shenanigans-progress";

const defaultProgress = (): ProgressState => ({
  unlockedLevelIds: [levels[0]?.id].filter(Boolean),
  completedLevelIds: [],
});

export const loadProgress = (): ProgressState => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultProgress();
    }

    const parsed = JSON.parse(stored) as ProgressState;
    return {
      unlockedLevelIds: Array.from(new Set([...defaultProgress().unlockedLevelIds, ...parsed.unlockedLevelIds])),
      completedLevelIds: parsed.completedLevelIds ?? [],
    };
  } catch {
    return defaultProgress();
  }
};

export const saveProgress = (progress: ProgressState) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const completeLevel = (progress: ProgressState, levelId: string): ProgressState => {
  const index = levels.findIndex((level) => level.id === levelId);
  const nextLevelId = levels[index + 1]?.id;

  return {
    completedLevelIds: Array.from(new Set([...progress.completedLevelIds, levelId])),
    unlockedLevelIds: Array.from(
      new Set([...progress.unlockedLevelIds, levelId, ...(nextLevelId ? [nextLevelId] : [])]),
    ),
  };
};
