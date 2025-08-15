import useSWR from 'swr';
import type { Quest, AppState, Book, Course, FocusState } from './types';

const fetcher = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      // If the response is not ok, return empty array for array endpoints
      if (
        url.includes('/quests') ||
        url.includes('/books') ||
        url.includes('/courses')
      ) {
        return [];
      }
      // For other endpoints, throw an error
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetcher error:', error);
    // Return empty array for array endpoints on error
    if (
      url.includes('/quests') ||
      url.includes('/books') ||
      url.includes('/courses')
    ) {
      return [];
    }
    // For other endpoints, re-throw the error
    throw error;
  }
};

export function useQuests() {
  const {
    data: quests,
    mutate,
    error,
  } = useSWR<Quest[]>('/api/quests', fetcher);
  return {
    quests: quests || [],
    mutateQuests: mutate,
    error,
  };
}

export function useAppState() {
  const {
    data: appState,
    mutate,
    error,
  } = useSWR<AppState>('/api/app-state', fetcher);
  return {
    appState: appState || { id: 1, streak: 0, last_check_in: null, focus: [] },
    mutateState: mutate,
    error,
  };
}

export function useBooks() {
  const { data: books, mutate, error } = useSWR<Book[]>('/api/books', fetcher);
  return {
    books: books || [],
    mutateBooks: mutate,
    error,
  };
}

export function useCourses() {
  const {
    data: courses,
    mutate,
    error,
  } = useSWR<Course[]>('/api/courses', fetcher);
  return {
    courses: courses || [],
    mutateCourses: mutate,
    error,
  };
}

export function useFocusState() {
  const {
    data: focusState,
    mutate,
    error,
  } = useSWR<FocusState>('/api/focus', fetcher);
  return {
    focusState: focusState || {
      quest: undefined,
      book: undefined,
      course: undefined,
    },
    mutateFocusState: mutate,
    error,
  };
}
