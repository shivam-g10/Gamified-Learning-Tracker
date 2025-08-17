import useSWR from 'swr';
import { Quest, AppState, Book, Course, FocusState } from './types';
import { Result, succeed, fail } from './result';

const fetcher = async <T>(url: string): Promise<Result<T>> => {
  const response = await fetch(url);

  if (!response.ok) {
    return fail(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return succeed(data);
};

export function useQuests() {
  const { data, mutate } = useSWR<Result<Quest[]>>(
    '/api/quests',
    fetcher<Quest[]>
  );
  return {
    quests: data?._tag === 'Success' ? data.data : [],
    mutateQuests: mutate,
  };
}

export function useAppState() {
  const { data, mutate } = useSWR<Result<AppState>>(
    '/api/app-state',
    fetcher<AppState>
  );
  return {
    appState:
      data?._tag === 'Success'
        ? data.data
        : { id: 1, streak: 0, last_check_in: null, focus: [] },
    mutateState: mutate,
  };
}

export function useBooks() {
  const { data, mutate } = useSWR<Result<Book[]>>(
    '/api/books',
    fetcher<Book[]>
  );
  return {
    books: data?._tag === 'Success' ? data.data : [],
    mutateBooks: mutate,
  };
}

export function useCourses() {
  const { data, mutate } = useSWR<Result<Course[]>>(
    '/api/courses',
    fetcher<Course[]>
  );
  return {
    courses: data?._tag === 'Success' ? data.data : [],
    mutateCourses: mutate,
  };
}

export function useFocusState() {
  const { data, mutate } = useSWR<Result<FocusState>>(
    '/api/focus',
    fetcher<FocusState>
  );
  return {
    focusState:
      data?._tag === 'Success'
        ? data.data
        : { quest: undefined, book: undefined, course: undefined },
    mutateFocusState: mutate,
  };
}
