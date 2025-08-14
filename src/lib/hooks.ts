import useSWR from 'swr';
import type { Quest, AppState, Book, Course, FocusState } from './types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useQuests() {
  const { data: quests, mutate } = useSWR<Quest[]>('/api/quests', fetcher);
  return { quests, mutateQuests: mutate };
}

export function useAppState() {
  const { data: appState, mutate } = useSWR<AppState>(
    '/api/app-state',
    fetcher
  );
  return { appState, mutateState: mutate };
}

export function useBooks() {
  const { data: books, mutate } = useSWR<Book[]>('/api/books', fetcher);
  return { books, mutateBooks: mutate };
}

export function useCourses() {
  const { data: courses, mutate } = useSWR<Course[]>('/api/courses', fetcher);
  return { courses, mutateCourses: mutate };
}

export function useFocusState() {
  const { data: focusState, mutate } = useSWR<FocusState>(
    '/api/focus',
    fetcher
  );
  return { focusState, mutateFocusState: mutate };
}
