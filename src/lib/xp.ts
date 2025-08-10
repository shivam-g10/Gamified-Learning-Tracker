export function totalXpToLevel(totalXp: number) {
  const level = Math.floor(totalXp / 150);
  const currentLevelXp = level * 150;
  const progress = totalXp - currentLevelXp;
  const nextLevelXp = 150;
  const pct = Math.min(100, Math.round((progress / nextLevelXp) * 100));
  return { level, progress, nextLevelXp, pct };
}

export function badgeThresholds(): number[] {
  return [150, 400, 800, 1200, 2000];
}


