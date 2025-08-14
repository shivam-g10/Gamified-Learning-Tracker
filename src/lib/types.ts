export type Quest = {
  id: string;
  title: string;
  xp: number;
  type: 'topic' | 'project' | 'bonus';
  category: string;
  done: boolean;
  created_at: string;
};

export type AppState = {
  id: number;
  streak: number;
  last_check_in: string | null;
  focus: string[];
};
