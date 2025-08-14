import useSWR from 'swr';
import { Quest, AppState } from './types';

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
