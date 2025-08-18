export interface Quest {
  id: string;
  title: string;
  description: string | null;
  xp: number;
  type: 'topic' | 'project' | 'bonus';
  category: string;
  done: boolean;
  created_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string | null;
  total_pages: number;
  current_page: number;
  status: 'backlog' | 'reading' | 'finished';
  description: string | null;
  category: string;
  tags: string[];
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  platform: string | null;
  url: string | null;
  total_units: number;
  completed_units: number;
  status: 'backlog' | 'learning' | 'finished';
  description: string | null;
  category: string;
  tags: string[];
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateQuestData {
  title: string;
  description?: string;
  xp: number;
  type: 'topic' | 'project' | 'bonus';
  category: string;
}

export interface UpdateQuestData {
  done?: boolean;
  title?: string;
  description?: string;
  xp?: number;
  type?: 'topic' | 'project' | 'bonus';
  category?: string;
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

export interface AppState {
  id: number;
  streak: number;
  last_check_in: string | null;
  focus: string[];
}

export interface CheckInResponse extends AppState {
  alreadyCheckedIn: boolean;
  streakIncremented: boolean;
  streakReset: boolean;
}

export interface FocusState {
  quest?: Quest;
  book?: Book;
  course?: Course;
}

export interface ChallengeItem {
  id: string;
  title: string;
  type: 'quest' | 'book' | 'course';
  category: string;
  xp: number;
}

export interface BulkSetupData {
  title: string;
  xp?: number;
  type?: 'topic' | 'project' | 'bonus';
  category: string;
  done?: boolean;
  author?: string;
  total_pages?: number;
  current_page?: number;
  status?: 'backlog' | 'reading' | 'finished' | 'learning';
  description?: string;
  tags?: string[];
  platform?: string;
  url?: string;
  total_units?: number;
  completed_units?: number;
}
