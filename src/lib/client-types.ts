// Client-safe types that can be imported on the client side
// These types don't include Prisma client imports

export interface ChallengeItem {
  id: string;
  title: string;
  type: 'quest' | 'book' | 'course';
  category: string;
  xp: number;
  status?: string;
}

export interface LevelInfo {
  level: number;
  progress: number;
  nextLevelXp: number;
  pct: number;
}

export interface CategoryProgress {
  category: string;
  total: number;
  done: number;
  percentage: number;
}

export interface CategoryBadge {
  category: string;
  badge: string;
  threshold: number;
  earned: boolean;
}

export interface CreateQuestData {
  title: string;
  xp: number;
  type: 'topic' | 'project' | 'bonus';
  category: string;
}

export interface UpdateQuestData {
  title?: string;
  xp?: number;
  type?: 'topic' | 'project' | 'bonus';
  category?: string;
  done?: boolean;
}

export interface UpdateAppStateData {
  streak?: number;
  last_check_in?: string;
  focus?: string[];
}

export interface CreateBookData {
  title: string;
  author?: string;
  total_pages: number;
  category: string;
  description?: string;
  tags?: string[];
}

export interface UpdateBookData {
  title?: string;
  author?: string;
  total_pages?: number;
  current_page?: number;
  status?: 'backlog' | 'reading' | 'finished';
  category?: string;
  description?: string;
  tags?: string[];
}

export interface LogBookProgressData {
  from_page: number;
  to_page: number;
  notes?: string;
}

export interface CreateCourseData {
  title: string;
  platform?: string;
  url?: string;
  total_units: number;
  category: string;
  description?: string;
  tags?: string[];
}

export interface UpdateCourseData {
  title?: string;
  platform?: string;
  url?: string;
  total_units?: number;
  completed_units?: number;
  status?: 'backlog' | 'learning' | 'finished';
  category?: string;
  description?: string;
  tags?: string[];
}

export interface LogCourseProgressData {
  units_delta: number;
  notes?: string;
}
