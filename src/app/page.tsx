'use client';

import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { badgeThresholds, totalXpToLevel } from '@/lib/xp';
import { Button, Card, Input, Label, PrimaryButton, Section, Select } from '@/components/ui';

type Quest = {
  id: string;
  title: string;
  xp: number;
  type: 'topic' | 'project' | 'bonus';
  category: string;
  done: boolean;
  created_at: string;
};

type AppState = {
  id: number;
  streak: number;
  last_check_in: string | null;
  focus: string[];
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function HomePage() {
  const { data: quests, mutate: mutateQuests } = useSWR<Quest[]>('/api/quests', fetcher);
  const { data: appState, mutate: mutateState } = useSWR<AppState>('/api/app-state', fetcher);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const totalXp = useMemo(() => (quests || []).filter(q => q.done).reduce((s, q) => s + q.xp, 0), [quests]);
  const levelInfo = totalXpToLevel(totalXp);
  const categories = useMemo(() => Array.from(new Set((quests || []).map(q => q.category))).sort(), [quests]);
  const filtered = useMemo(() => {
    return (quests || []).filter(q => {
      if (search && !(`${q.title} ${q.category}`.toLowerCase().includes(search.toLowerCase()))) return false;
      if (filterType && q.type !== filterType) return false;
      if (filterCategory && q.category !== filterCategory) return false;
      return true;
    });
  }, [quests, search, filterType, filterCategory]);

  async function addQuest(formData: FormData) {
    const title = String(formData.get('title') || '');
    const xp = Number(formData.get('xp') || 0);
    const type = String(formData.get('type') || 'topic');
    const category = String(formData.get('category') || 'General');
    await fetch('/api/quests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, xp, type, category }) });
    await mutateQuests();
  }

  async function toggleDone(q: Quest) {
    await fetch(`/api/quests/${q.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ done: !q.done }) });
    await mutateQuests();
  }

  async function deleteQuest(q: Quest) {
    await fetch(`/api/quests/${q.id}`, { method: 'DELETE' });
    await mutateQuests();
  }

  async function toggleFocus(q: Quest) {
    if (!appState) return;
    const focus = new Set(appState.focus || []);
    if (focus.has(q.id)) {
      focus.delete(q.id);
    } else {
      if (focus.size >= 3) return; // enforce client-side cap
      focus.add(q.id);
    }
    await fetch('/api/app-state', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ focus: Array.from(focus) }) });
    await mutateState();
  }

  async function dailyCheckIn() {
    await fetch('/api/checkin', { method: 'POST' });
    await mutateState();
  }

  async function randomChallenge() {
    const q = await fetch('/api/random-challenge').then(r => r.json());
    if (!q) return alert('All quests are done — nice!');
    alert(`Random Challenge:\n${q.title} [${q.category}] (+${q.xp} XP)`);
  }

  function CategoryProgress() {
    const byCategory = new Map<string, { total: number; done: number }>();
    (quests || []).forEach(q => {
      const item = byCategory.get(q.category) || { total: 0, done: 0 };
      item.total += q.xp;
      if (q.done) item.done += q.xp;
      byCategory.set(q.category, item);
    });
    const entries = Array.from(byCategory.entries());
    return (
      <div className="space-y-3">
        {entries.map(([cat, v]) => {
          const pct = v.total === 0 ? 0 : Math.round((v.done / v.total) * 100);
          return (
            <div key={cat}>
              <div className="flex justify-between text-sm mb-1"><span>{cat}</span><span>{pct}%</span></div>
              <div className="h-2 bg-neutral-800 rounded">
                <div className="h-2 bg-indigo-600 rounded" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function Badges() {
    const thresholds = badgeThresholds();
    return (
      <div className="flex flex-wrap gap-2">
        {thresholds.map((t) => (
          <span key={t} className={`chip ${totalXp >= t ? 'border-indigo-500 text-indigo-300' : ''}`}>🏅 {t} XP</span>
        ))}
      </div>
    );
  }

  function FocusChips() {
    if (!appState) return null;
    const focusSet = new Set(appState.focus || []);
    const focusQuests = (quests || []).filter(q => focusSet.has(q.id));
    return (
      <div className="flex flex-wrap gap-2">
        {focusQuests.map(q => (
          <span key={q.id} className="chip">
            {q.title}
            <button className="ml-1 text-neutral-400 hover:text-neutral-200" onClick={() => toggleFocus(q)}>✕</button>
          </span>
        ))}
      </div>
    );
  }

  function QuestRow({ q }: { q: Quest }) {
    return (
      <div className="flex items-center gap-3 py-2 border-b border-neutral-800">
        <input type="checkbox" checked={q.done} onChange={() => toggleDone(q)} />
        <div className="flex-1">
          <div className="font-medium">{q.title}</div>
          <div className="text-sm text-neutral-400">{q.category} • {q.type} • +{q.xp} XP</div>
        </div>
        <button title="Toggle focus" className="chip" onClick={() => toggleFocus(q)}>{appState?.focus?.includes(q.id) ? 'Focus ✓' : 'Focus +'}</button>
        <button title="Delete" className="btn" onClick={() => deleteQuest(q)}>🗑️</button>
      </div>
    );
  }

  function AddQuestForm() {
    const [pending, setPending] = useState(false);
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setPending(true);
      const fd = new FormData(e.currentTarget);
      await addQuest(fd);
      e.currentTarget.reset();
      setPending(false);
    }
    return (
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div>
          <Label>Title</Label>
          <Input name="title" required placeholder="Learn topic X" />
        </div>
        <div>
          <Label>XP</Label>
          <Input name="xp" type="number" min={0} required defaultValue={50} />
        </div>
        <div>
          <Label>Type</Label>
          <Select name="type" defaultValue="topic">
            <option value="topic">topic</option>
            <option value="project">project</option>
            <option value="bonus">bonus</option>
          </Select>
        </div>
        <div>
          <Label>Category</Label>
          <Input name="category" placeholder="Algorithms" />
        </div>
        <div className="flex items-end">
          <PrimaryButton disabled={pending} type="submit">Add</PrimaryButton>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <Section title="Overview" actions={<Button onClick={randomChallenge}>🎲 Random challenge</Button>}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="text-sm text-neutral-400">Level</div>
            <div className="text-2xl font-bold">{levelInfo.level}</div>
            <div className="h-2 bg-neutral-800 rounded mt-2">
              <div className="h-2 bg-emerald-500 rounded" style={{ width: `${levelInfo.pct}%` }} />
            </div>
            <div className="text-xs text-neutral-400 mt-1">{levelInfo.progress}/{levelInfo.nextLevelXp} XP</div>
          </Card>
          <Card>
            <div className="text-sm text-neutral-400">Streak</div>
            <div className="text-2xl font-bold">{appState?.streak ?? 0}🔥</div>
            <Button className="mt-2" onClick={dailyCheckIn}>Daily check-in</Button>
            <div className="text-xs text-neutral-500 mt-1">Last: {appState?.last_check_in ? String(appState.last_check_in).slice(0,10) : '—'}</div>
          </Card>
          <Card>
            <div className="text-sm text-neutral-400 mb-1">Badges</div>
            <Badges />
          </Card>
        </div>
      </Section>

      <Section title="Focus">
        <FocusChips />
      </Section>

      <Section title="Category progress">
        <CategoryProgress />
      </Section>

      <Section title="Add quest">
        <AddQuestForm />
      </Section>

      <Section title="Quests" actions={
        <div className="flex gap-2">
          <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All types</option>
            <option value="topic">topic</option>
            <option value="project">project</option>
            <option value="bonus">bonus</option>
          </Select>
          <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
      }>
        <div className="divide-y divide-neutral-800">
          {filtered?.map(q => <QuestRow key={q.id} q={q} />)}
          {filtered && filtered.length === 0 && <div className="text-sm text-neutral-500 py-4">No quests yet. Add one above.</div>}
        </div>
      </Section>
    </div>
  );
}


