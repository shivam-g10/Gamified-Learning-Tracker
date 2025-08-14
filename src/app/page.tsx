'use client';

import { useState, useMemo } from 'react';
import { Quest, AppState } from '@/lib/types';
import { useQuests, useAppState } from '@/lib/hooks';
import { badgeThresholds, totalXpToLevel } from '@/lib/xp';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/components/ui/card';
import { Button } from '@/components/components/ui/button';
import { Input } from '@/components/components/ui/input';
import { Label } from '@/components/components/ui/label';
import { Badge } from '@/components/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/components/ui/select';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Target,
  Trash2,
} from 'lucide-react';

export default function HomePage() {
  const { quests, mutateQuests } = useQuests();
  const { appState, mutateState } = useAppState();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState<
    'title' | 'xp' | 'category' | 'type' | 'created_at' | 'done'
  >('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const totalXp = useMemo(
    () => (quests || []).filter(q => q.done).reduce((s, q) => s + q.xp, 0),
    [quests]
  );
  const levelInfo = totalXpToLevel(totalXp);
  const categories = useMemo(() => {
    const cats = new Set<string>();
    (quests || []).forEach(q => cats.add(q.category));
    return Array.from(cats).sort();
  }, [quests]);

  const filtered = useMemo(() => {
    const filteredQuests = (quests || []).filter(q => {
      if (
        search &&
        !`${q.title} ${q.category}`.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (filterType && q.type !== filterType) return false;
      if (filterCategory && q.category !== filterCategory) return false;
      return true;
    });

    // Sort the filtered quests
    const sortedQuests = [...filteredQuests].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      // Handle special cases
      if (sortBy === 'done') {
        // Sort done quests to the bottom
        if (aValue === bValue) return 0;
        return aValue ? 1 : -1;
      }

      // Handle string comparisons
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const aLower = aValue.toLowerCase();
        const bLower = bValue.toLowerCase();
        if (aLower < bLower) return sortOrder === 'asc' ? -1 : 1;
        if (aLower > bLower) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }

      // Handle numeric comparisons
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle boolean comparisons
      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        if (aValue === bValue) return 0;
        return aValue ? 1 : -1;
      }

      // Default case - no change in order
      return 0;
    });

    return sortedQuests;
  }, [quests, search, filterType, filterCategory, sortBy, sortOrder]);

  async function addQuest(formData: FormData) {
    const title = String(formData.get('title') || '');
    const xp = Number(formData.get('xp') || 0);
    const type = String(formData.get('type') || 'topic');
    const category = String(formData.get('category') || 'General');
    await fetch('/api/quests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, xp, type, category }),
    });
    await mutateQuests();
  }

  async function toggleDone(q: Quest) {
    await fetch(`/api/quests/${q.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !q.done }),
    });
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
    await fetch('/api/app-state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ focus: Array.from(focus) }),
    });
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
      <div className='space-y-3'>
        {entries.map(([cat, v]) => {
          const pct = v.total === 0 ? 0 : Math.round((v.done / v.total) * 100);
          return (
            <div key={cat}>
              <div className='flex justify-between text-sm mb-1'>
                <span>{cat}</span>
                <span>{pct}%</span>
              </div>
              <div className='h-2 bg-neutral-800 rounded'>
                <div
                  className='h-2 bg-indigo-600 rounded'
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function Badges() {
    return (
      <div className='flex gap-2 flex-wrap'>
        {badgeThresholds.map(t => (
          <Badge
            key={t}
            variant={totalXp >= t ? 'default' : 'secondary'}
            className={
              totalXp >= t
                ? 'bg-yellow-600 text-white'
                : 'bg-neutral-800 text-neutral-400'
            }
          >
            {t} XP
          </Badge>
        ))}
      </div>
    );
  }

  function FocusChips() {
    if (!appState) return null;
    const focusSet = new Set(appState.focus || []);
    const focusQuests = (quests || []).filter(q => focusSet.has(q.id));
    return (
      <div className='flex flex-wrap gap-2'>
        {focusQuests.map(q => (
          <span key={q.id} className='chip'>
            {q.title}
            <button
              className='ml-1 text-neutral-400 hover:text-neutral-200'
              onClick={() => toggleFocus(q)}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    );
  }

  function QuestRow({ q }: { q: Quest }) {
    return (
      <div className='flex items-center gap-4 py-4 px-3 rounded-lg hover:bg-neutral-900/30 transition-all duration-200 group border-b border-neutral-800/50 last:border-b-0'>
        <input
          type='checkbox'
          checked={q.done}
          onChange={() => toggleDone(q)}
          className='w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-0 transition-all duration-200'
        />
        <div className='flex-1 min-w-0'>
          <div
            className={`font-medium transition-all duration-200 ${q.done ? 'line-through text-neutral-500' : 'text-neutral-100'}`}
          >
            {q.title}
          </div>
          <div className='flex items-center gap-2 mt-1'>
            <Badge
              variant='secondary'
              className='bg-neutral-800 text-neutral-300 border-neutral-700'
            >
              {q.category}
            </Badge>
            <Badge
              variant='secondary'
              className='bg-neutral-800 text-neutral-300 border-neutral-700'
            >
              {q.type}
            </Badge>
            <Badge variant='default' className='bg-emerald-600 text-white'>
              +{q.xp} XP
            </Badge>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            onClick={() => toggleFocus(q)}
            variant={appState?.focus?.includes(q.id) ? 'default' : 'outline'}
            size='sm'
            className={
              appState?.focus?.includes(q.id)
                ? 'bg-indigo-600 hover:bg-indigo-500'
                : ''
            }
          >
            <Target className='w-4 h-4 mr-1' />
            {appState?.focus?.includes(q.id) ? 'Focused' : 'Focus'}
          </Button>
          <Button
            onClick={() => deleteQuest(q)}
            variant='outline'
            size='icon'
            className='opacity-0 group-hover:opacity-100 hover:bg-red-900/30 hover:text-red-400 hover:border-red-700/50'
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
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
      <form
        onSubmit={onSubmit}
        className='grid grid-cols-1 md:grid-cols-5 gap-4'
      >
        <div className='space-y-2'>
          <Label className='text-sm text-neutral-300 font-medium'>Title</Label>
          <Input name='title' required placeholder='Learn topic X' />
        </div>
        <div className='space-y-2'>
          <Label className='text-sm text-neutral-300 font-medium'>XP</Label>
          <Input name='xp' type='number' min={0} required defaultValue={50} />
        </div>
        <div className='space-y-2'>
          <Label className='text-sm text-neutral-300 font-medium'>Type</Label>
          <Select name='type' defaultValue='topic'>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='topic'>Topic</SelectItem>
              <SelectItem value='project'>Project</SelectItem>
              <SelectItem value='bonus'>Bonus</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label className='text-sm text-neutral-300 font-medium'>
            Category
          </Label>
          <Input name='category' placeholder='Algorithms' />
        </div>
        <div className='flex items-end'>
          <Button disabled={pending} type='submit' className='w-full'>
            {pending ? 'Adding...' : 'Add Quest'}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>Overview</span>
            <Button onClick={randomChallenge} variant='outline' size='sm'>
              <Target className='w-4 h-4 mr-2' />
              Random challenge
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Card>
              <CardContent className='pt-6'>
                <div className='text-sm text-neutral-400'>Level</div>
                <div className='text-2xl font-bold'>{levelInfo.level}</div>
                <div className='h-2 bg-neutral-800 rounded mt-2'>
                  <div
                    className='h-2 bg-emerald-500 rounded'
                    style={{ width: `${levelInfo.pct}%` }}
                  />
                </div>
                <div className='text-xs text-neutral-400 mt-1'>
                  {levelInfo.progress}/{levelInfo.nextLevelXp} XP
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='pt-6'>
                <div className='text-sm text-neutral-400'>Streak</div>
                <div className='text-2xl font-bold'>
                  {appState?.streak ?? 0}🔥
                </div>
                <Button
                  className='mt-2'
                  onClick={dailyCheckIn}
                  variant='outline'
                  size='sm'
                >
                  Daily check-in
                </Button>
                <div className='text-xs text-neutral-500 mt-1'>
                  Last:{' '}
                  {appState?.last_check_in
                    ? new Date(appState.last_check_in).toLocaleDateString()
                    : '—'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className='pt-6'>
                <div className='text-sm text-neutral-400'>Total XP</div>
                <div className='text-2xl font-bold'>{totalXp}</div>
                <div className='text-xs text-neutral-400 mt-1'>
                  {totalXp} / ∞ XP
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <Badges />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Focus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-neutral-400'>Current focus:</span>
              <span className='text-sm font-medium'>
                {appState?.focus?.length || 0}/3
              </span>
            </div>
            <div className='flex gap-2 flex-wrap'>
              {appState?.focus?.map(id => {
                const q = quests?.find(q => q.id === id);
                return q ? (
                  <Badge
                    key={id}
                    variant='outline'
                    className='bg-indigo-900/30 text-indigo-300 border-indigo-700'
                  >
                    {q.title}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Quest</CardTitle>
        </CardHeader>
        <CardContent>
          <AddQuestForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <span>Quests</span>
            {sortBy !== 'created_at' && (
              <span className='text-sm text-neutral-400 font-normal'>
                (sorted by {sortBy} {sortOrder === 'asc' ? '↑' : '↓'})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Search Bar - Full Width with Enhanced Styling */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5' />
            <Input
              placeholder='Search quests by title or category...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              className='pl-10'
            />
          </div>

          {/* Filter and Sort Controls - Enhanced Layout */}
          <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
            {/* Filter Controls - Grouped with Labels */}
            <div className='flex flex-col sm:flex-row gap-3'>
              <div className='flex flex-col gap-1'>
                <Label className='text-xs text-neutral-400 uppercase tracking-wide'>
                  Type
                </Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className='min-w-[120px]'>
                    <SelectValue placeholder='All Types' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>All Types</SelectItem>
                    <SelectItem value='topic'>Topic</SelectItem>
                    <SelectItem value='project'>Project</SelectItem>
                    <SelectItem value='bonus'>Bonus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col gap-1'>
                <Label className='text-xs text-neutral-400 uppercase tracking-wide'>
                  Category
                </Label>
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className='min-w-[140px]'>
                    <SelectValue placeholder='All Categories' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>All Categories</SelectItem>
                    {categories.map(c => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Visual Separator */}
            <div className='hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-neutral-600 to-transparent'></div>

            {/* Sort Controls - Enhanced with Better Visual Hierarchy */}
            <div className='flex flex-col sm:flex-row gap-3 items-start sm:items-center'>
              <div className='flex flex-col gap-1'>
                <Label className='text-xs text-neutral-400 uppercase tracking-wide'>
                  Sort by
                </Label>
                <div className='flex gap-2 items-center'>
                  <Select
                    value={sortBy}
                    onValueChange={value =>
                      setSortBy(
                        value as
                          | 'title'
                          | 'xp'
                          | 'category'
                          | 'type'
                          | 'created_at'
                          | 'done'
                      )
                    }
                  >
                    <SelectTrigger className='min-w-[140px]'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='created_at'>Date Created</SelectItem>
                      <SelectItem value='title'>Title</SelectItem>
                      <SelectItem value='xp'>XP Value</SelectItem>
                      <SelectItem value='category'>Category</SelectItem>
                      <SelectItem value='type'>Type</SelectItem>
                      <SelectItem value='done'>Completion</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={() =>
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    }
                    variant='outline'
                    size='icon'
                    title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                  >
                    <ArrowUpDown className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quest List */}
          <div className='divide-y divide-neutral-800/50 bg-neutral-900/20 rounded-lg border border-neutral-800/30 overflow-hidden'>
            {filtered?.map(q => (
              <QuestRow key={q.id} q={q} />
            ))}
            {filtered && filtered.length === 0 && (
              <div className='text-center py-12 text-neutral-500'>
                <div className='text-4xl mb-3'>🎯</div>
                <div className='text-lg font-medium mb-2'>No quests found</div>
                <div className='text-sm'>
                  Try adjusting your search or filters, or add a new quest
                  above!
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
