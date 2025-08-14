export interface LevelInfo {
  level: number;
  progress: number;
  nextLevelXp: number;
  pct: number;
}

export const badgeThresholds = [150, 400, 800, 1200, 2000];

export function totalXpToLevel(totalXp: number): LevelInfo {
  const level = Math.floor(totalXp / 150) + 1;
  const progress = totalXp % 150;
  const nextLevelXp = 150;
  const pct = Math.round((progress / nextLevelXp) * 100);

  return { level, progress, nextLevelXp, pct };
}
