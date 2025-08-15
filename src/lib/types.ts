export type Quest = {
  id: string;
  title: string;
  xp: number;
  type: 'topic' | 'project' | 'bonus';
  category: string;
  done: boolean;
  created_at: string;
};

export type Book = {
  id: string;
  title: string;
  author: string | null;
  total_pages: number;
  current_page: number;
  status: 'backlog' | 'reading' | 'finished';
  cover_url: string | null;
  description: string | null;
  category: string;
  tags: string[];
  started_at: Date | null;
  finished_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type BookProgressEntry = {
  id: string;
  book_id: string;
  from_page: number;
  to_page: number;
  pages_read: number;
  notes: string | null;
  created_at: Date;
};

export type Course = {
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
  started_at: Date | null;
  finished_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type CourseProgressEntry = {
  id: string;
  course_id: string;
  units_delta: number;
  notes: string | null;
  created_at: Date;
};

export type AppState = {
  id: number;
  streak: number;
  last_check_in: string | null;
  focus: string[];
};

export type FocusSlot = {
  id: string;
  quest_id: string | null;
  book_id: string | null;
  course_id: string | null;
  updated_at: Date;
};

export type FocusState = {
  quest?: Quest;
  book?: Book;
  course?: Course;
};

export type CreateBookData = {
  title: string;
  author?: string;
  total_pages: number;
  category: string;
  description?: string;
  tags?: string[];
  cover_url?: string;
};

export type UpdateBookData = {
  title?: string;
  author?: string;
  total_pages?: number;
  current_page?: number;
  status?: 'backlog' | 'reading' | 'finished';
  category?: string;
  description?: string;
  tags?: string[];
  cover_url?: string;
  started_at?: Date;
  finished_at?: Date;
};

export type CreateCourseData = {
  title: string;
  platform?: string;
  url?: string;
  total_units: number;
  description?: string;
  tags?: string[];
};

export type UpdateCourseData = {
  title?: string;
  platform?: string;
  url?: string;
  total_units?: number;
  completed_units?: number;
  status?: 'backlog' | 'learning' | 'finished';
  description?: string;
  tags?: string[];
  started_at?: Date;
  finished_at?: Date;
};

export type LogBookProgressData = {
  from_page: number;
  to_page: number;
  notes?: string;
};

export type LogCourseProgressData = {
  units_delta: number;
  notes?: string;
};
