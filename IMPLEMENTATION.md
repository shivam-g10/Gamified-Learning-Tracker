# 🏗️ Implementation Documentation

## Overview

This document provides a detailed technical implementation guide for the Gamified Learning Tracker system. It covers the architecture, data flow, and implementation details for each feature.

## 🏛️ System Architecture

### Technology Stack

- **Frontend**: Next.js 14.2.5 with App Router
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL 16 with Prisma ORM
- **Styling**: Tailwind CSS with custom component system
- **State Management**: SWR for data fetching and caching
- **Containerization**: Docker with multi-stage builds
- **Package Manager**: pnpm for dependency management

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/              # REST API endpoints
│   ├── globals.css       # Global styles and Tailwind
│   ├── layout.tsx        # Root layout with metadata
│   └── page.tsx          # Main application page
├── components/            # Reusable UI components
│   └── ui.tsx            # Component library
└── lib/                  # Utility functions
    ├── db.ts             # Prisma client configuration
    └── xp.ts             # XP and leveling calculations
```

## 🎯 Core Features Implementation

### 1. Quest Management System

#### Data Model (Prisma Schema)

```prisma
model Quest {
  id         String   @id @default(uuid()) @db.Uuid
  title      String
  xp         Int
  type       QuestType
  category   String
  done       Boolean  @default(false)
  created_at DateTime @default(now())
}

enum QuestType {
  topic
  project
  bonus
}
```

#### Implementation Details

- **UUID Primary Keys**: Uses PostgreSQL UUID type for unique identification
- **Quest Types**: Enumerated types for topic, project, and bonus quests
- **Timestamps**: Automatic creation timestamps for quest tracking
- **Boolean Status**: Simple done/undone state management

#### API Endpoints

- **GET /api/quests**: Retrieves quests with filtering capabilities
- **POST /api/quests**: Creates new quests with validation
- **PATCH /api/quests/[id]**: Updates quest properties
- **DELETE /api/quests/[id]**: Removes quests from the system

#### Frontend Implementation

```typescript
// Quest creation form with validation
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
  await mutateQuests(); // SWR cache invalidation
}
```

### 2. Experience Points (XP) & Leveling System

#### XP Calculation Logic

```typescript
// src/lib/xp.ts
export function totalXpToLevel(totalXp: number) {
  const level = Math.floor(totalXp / 150);
  const currentLevelXp = level * 150;
  const progress = totalXp - currentLevelXp;
  const nextLevelXp = 150;
  const pct = Math.min(100, Math.round((progress / nextLevelXp) * 100));

  return { level, progress, nextLevelXp, pct };
}
```

#### Implementation Details

- **Level Threshold**: 150 XP per level (configurable)
- **Progress Calculation**: Shows progress within current level
- **Percentage Display**: Visual progress indicators
- **Real-time Updates**: XP calculations update immediately on quest completion

#### Frontend Display

```typescript
const totalXp = useMemo(() =>
  (quests || []).filter(q => q.done).reduce((s, q) => s + q.xp, 0),
  [quests]
);
const levelInfo = totalXpToLevel(totalXp);

// Progress bar implementation
<div className="h-2 bg-neutral-800 rounded">
  <div className="h-2 bg-emerald-500 rounded"
       style={{ width: `${levelInfo.pct}%` }} />
</div>
```

### 3. Badge & Achievement System

#### Badge Thresholds

```typescript
export function badgeThresholds(): number[] {
  return [150, 400, 800, 1200, 2000];
}
```

#### Implementation Details

- **Milestone-based**: Badges unlock at specific XP thresholds
- **Visual Feedback**: Badges highlight when thresholds are reached
- **Dynamic Display**: Badge status updates in real-time
- **Responsive Design**: Badges adapt to different screen sizes

#### Frontend Implementation

```typescript
function Badges() {
  const thresholds = badgeThresholds();
  return (
    <div className="flex flex-wrap gap-2">
      {thresholds.map((t) => (
        <span key={t} className={`chip ${totalXp >= t ? 'border-indigo-500 text-indigo-300' : ''}`}>
          🏅 {t} XP
        </span>
      ))}
    </div>
  );
}
```

### 4. Streak & Momentum System

#### Data Model

```prisma
model AppState {
  id            Int       @id @default(1)
  streak        Int       @default(0)
  last_check_in DateTime? @db.Date
  focus         String[]  @db.Uuid
}
```

#### Check-in Logic

```typescript
// src/app/api/checkin/route.ts
function todayDateString(): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCFullMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCFullDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export async function POST() {
  const state = await prisma.appState.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  const today = todayDateString();
  const last = state.last_check_in
    ? state.last_check_in.toISOString().slice(0, 10)
    : null;

  if (last === today) {
    return NextResponse.json({
      streak: state.streak,
      last_check_in: state.last_check_in,
      changed: false,
    });
  }

  const updated = await prisma.appState.update({
    where: { id: 1 },
    data: { streak: state.streak + 1, last_check_in: new Date(today) },
  });

  return NextResponse.json({
    streak: updated.streak,
    last_check_in: updated.last_check_in,
    changed: true,
  });
}
```

#### Implementation Details

- **Daily Tracking**: Uses UTC dates for consistent timezone handling
- **Streak Logic**: Increments streak only once per day
- **State Persistence**: Maintains streak across application restarts
- **User Feedback**: Shows last check-in date and current streak

### 5. Focus Management System

#### Implementation Details

- **Maximum Focus**: Limited to 3 quests simultaneously
- **Toggle Functionality**: Easy add/remove from focus
- **Visual Indicators**: Clear display of focused quests
- **State Synchronization**: Focus state persists across sessions

#### Frontend Implementation

```typescript
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
```

#### Focus Display

```typescript
function FocusChips() {
  if (!appState) return null;
  const focusSet = new Set(appState.focus || []);
  const focusQuests = (quests || []).filter(q => focusSet.has(q.id));

  return (
    <div className="flex flex-wrap gap-2">
      {focusQuests.map(q => (
        <span key={q.id} className="chip">
          {q.title}
          <button className="ml-1 text-neutral-400 hover:text-neutral-200"
                  onClick={() => toggleFocus(q)}>✕</button>
        </span>
      ))}
    </div>
  );
}
```

### 6. Search & Filtering System

#### API Implementation

```typescript
// src/app/api/quests/route.ts
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || undefined;
  const type = searchParams.get('type') || undefined;
  const category = searchParams.get('category') || undefined;
  const doneParam = searchParams.get('done');
  const done = doneParam === null ? undefined : doneParam === 'true';

  const quests = await prisma.quest.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        type ? { type: type as 'topic' | 'project' | 'bonus' } : {},
        category ? { category: { equals: category, mode: 'insensitive' } } : {},
        done !== undefined ? { done } : {},
      ],
    },
    orderBy: { created_at: 'desc' },
  });

  return NextResponse.json(quests);
}
```

#### Frontend Filtering

```typescript
const filtered = useMemo(() => {
  return (quests || []).filter(q => {
    if (
      search &&
      !`${q.title} ${q.category}`.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (filterType && q.type !== filterType) return false;
    if (filterCategory && q.category !== filterCategory) return false;
    return true;
  });
}, [quests, search, filterType, filterCategory]);
```

#### Implementation Details

- **Real-time Search**: Instant filtering as user types
- **Multiple Filters**: Type, category, and completion status
- **Case-insensitive**: Search works regardless of text case
- **Performance Optimized**: Uses useMemo for efficient filtering

### 7. Random Challenge System

#### API Implementation

```typescript
// src/app/api/random-challenge/route.ts
export async function GET() {
  const quests = await prisma.quest.findMany({
    where: { done: false },
  });

  if (quests.length === 0) return NextResponse.json(null);

  const idx = Math.floor(Math.random() * quests.length);
  return NextResponse.json(quests[idx]);
}
```

#### Frontend Integration

```typescript
async function randomChallenge() {
  const q = await fetch('/api/random-challenge').then(r => r.json());
  if (!q) return alert('All quests are done — nice!');
  alert(`Random Challenge:\n${q.title} [${q.category}] (+${q.xp} XP)`);
}
```

#### Implementation Details

- **Unfinished Quests Only**: Only selects from incomplete quests
- **Random Selection**: Uses Math.random() for challenge variety
- **User Feedback**: Clear display of selected challenge
- **Completion Check**: Handles case when all quests are done

### 8. Progress Analytics

#### Category Progress Calculation

```typescript
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
            <div className="flex justify-between text-sm mb-1">
              <span>{cat}</span><span>{pct}%</span>
            </div>
            <div className="h-2 bg-neutral-800 rounded">
              <div className="h-2 bg-indigo-600 rounded"
                   style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

#### Implementation Details

- **Dynamic Categories**: Automatically detects all quest categories
- **Progress Calculation**: Shows XP completion percentage per category
- **Visual Progress Bars**: Intuitive progress visualization
- **Real-time Updates**: Progress updates immediately on quest completion

## 🎨 UI Component System

### Component Library (src/components/ui.tsx)

#### Card Component

```typescript
export function Card(props: HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div className={clsx('card p-4', className)} {...rest} />;
}
```

#### Button Components

```typescript
export function Button({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={clsx('btn', className)} {...rest} />;
}

export function PrimaryButton({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={clsx('btn btn-primary', className)} {...rest} />;
}
```

#### Form Components

```typescript
export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx('w-full', className)} {...rest} />;
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { children?: ReactNode }) {
  return (
    <select className={clsx('w-full', className)} {...rest}>
      {children}
    </select>
  );
}
```

#### Section Component

```typescript
export function Section({ title, children, actions }: {
  title: string;
  children: ReactNode;
  actions?: ReactNode
}) {
  return (
    <Card className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold">{title}</h2>
        {actions}
      </div>
      {children}
    </Card>
  );
}
```

### Styling System

#### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

#### Custom CSS Classes

```css
/* src/app/globals.css */
.card {
  @apply bg-neutral-900 border border-neutral-800 rounded-lg shadow-sm;
}

.btn {
  @apply inline-flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-700 hover:bg-neutral-800 active:bg-neutral-800/80 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-primary {
  @apply bg-indigo-600 border-indigo-500 hover:bg-indigo-500;
}

.chip {
  @apply inline-flex items-center gap-1 px-2 py-1 rounded bg-neutral-800 border border-neutral-700 text-sm;
}
```

## 🗄️ Database Implementation

### Prisma Client Configuration

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}
```

### Database Schema Features

- **UUID Primary Keys**: Secure, globally unique identifiers
- **Enum Types**: Type-safe quest categorization
- **Array Fields**: Support for focus quest IDs
- **Automatic Timestamps**: Creation time tracking
- **Default Values**: Sensible defaults for new records

### Data Seeding

The system includes a comprehensive seed file with 50+ pre-configured quests across multiple categories:

- Core CS (7 quests)
- Systems (5 quests)
- Networking (5 quests)
- Databases (5 quests)
- Distributed Systems (8 quests)
- Software Engineering (6 quests)
- Performance & Debugging (5 quests)
- Security (5 quests)
- Architecture & Leadership (6 quests)
- Math (5 quests)

## 🔄 State Management

### SWR Integration

```typescript
const { data: quests, mutate: mutateQuests } = useSWR<Quest[]>(
  '/api/quests',
  fetcher
);
const { data: appState, mutate: mutateState } = useSWR<AppState>(
  '/api/app-state',
  fetcher
);
```

#### Implementation Benefits

- **Automatic Caching**: Efficient data storage and retrieval
- **Real-time Updates**: Immediate UI synchronization
- **Optimistic Updates**: Fast user feedback
- **Background Revalidation**: Keeps data fresh
- **Error Handling**: Graceful fallback on failures

### Data Fetching Pattern

```typescript
const fetcher = (url: string) => fetch(url).then(r => r.json());

// Usage in components
const { data, error, mutate } = useSWR('/api/endpoint', fetcher);
```

## 🚀 Performance Optimizations

### React Optimizations

- **useMemo**: Prevents unnecessary recalculations
- **useCallback**: Stable function references
- **Component Memoization**: Efficient re-rendering
- **Lazy Loading**: On-demand component loading

### Database Optimizations

- **Indexed Queries**: Efficient database lookups
- **Connection Pooling**: Optimized database connections
- **Query Optimization**: Minimal data transfer
- **Caching Strategy**: Reduced database load

### Frontend Optimizations

- **Code Splitting**: Reduced bundle sizes
- **Image Optimization**: Efficient asset delivery
- **CSS Optimization**: Minimal CSS output
- **Bundle Analysis**: Performance monitoring

## 🔒 Security Implementation

### Input Validation

```typescript
// API route validation
const { title, xp, type, category } = body || {};
if (!title || typeof xp !== 'number' || xp < 0 || !type || !category) {
  return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
}
```

### Database Security

- **Parameterized Queries**: Prevents SQL injection
- **Type Safety**: Prisma ORM protection
- **Input Sanitization**: Clean data processing
- **Access Control**: Database-level security

### API Security

- **Request Validation**: Comprehensive input checking
- **Error Handling**: Secure error responses
- **Rate Limiting**: Built-in protection
- **CORS Configuration**: Cross-origin security

## 🐳 Docker Implementation

### Multi-stage Build

```dockerfile
# Dependencies stage
FROM node:21-alpine AS deps
# ... dependency installation

# Builder stage
FROM node:21-alpine AS builder
# ... application building

# Production stage
FROM node:21-alpine AS runner
# ... production deployment
```

### Security Features

- **Non-root User**: Runs as nextjs user (UID 1001)
- **Minimal Base Image**: Alpine Linux for security
- **Dependency Scanning**: Regular security updates
- **Network Isolation**: Internal communication only

### Health Checks

```yaml
healthcheck:
  test: ['CMD', 'curl', '-f', 'http://localhost:3000/api/health']
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## 📱 Responsive Design

### Mobile-First Approach

- **Grid System**: Responsive grid layouts
- **Flexbox**: Flexible component arrangements
- **Media Queries**: Device-specific styling
- **Touch Targets**: Mobile-optimized interactions

### Breakpoint Strategy

- **Small**: Mobile devices (< 768px)
- **Medium**: Tablets (768px - 1024px)
- **Large**: Desktop (> 1024px)

## 🔧 Development Features

### TypeScript Integration

- **Full Type Safety**: Comprehensive type definitions
- **Interface Definitions**: Clear data contracts
- **Error Prevention**: Compile-time error checking
- **Developer Experience**: Enhanced IDE support

### Development Tools

- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Hot Reload**: Fast development iteration

## 📊 Monitoring & Observability

### Health Checks

- **API Endpoints**: Service health monitoring
- **Database Connectivity**: Connection status
- **Service Status**: Application health
- **Performance Metrics**: Response time tracking

### Error Handling

- **Graceful Degradation**: Fallback mechanisms
- **User Feedback**: Clear error messages
- **Logging**: Comprehensive error tracking
- **Recovery**: Automatic error recovery

## 🚀 Deployment Features

### Coolify Integration

- **Dynamic Port Allocation**: Automatic port assignment
- **Subdomain Support**: Automatic proxy configuration
- **Environment Variables**: Flexible configuration
- **Health Monitoring**: Built-in health checks

### Production Readiness

- **Environment Configuration**: Production settings
- **Database Migrations**: Schema management
- **Backup Strategy**: Data protection
- **Scaling Support**: Horizontal scaling ready

## 🔮 Future Implementation Considerations

### Potential Enhancements

- **User Authentication**: Multi-user support
- **Data Export**: Progress reporting
- **Social Features**: Community sharing
- **Advanced Analytics**: Detailed progress tracking
- **Mobile App**: Native mobile application
- **API Versioning**: Backward compatibility
- **Webhooks**: External integrations
- **Real-time Updates**: WebSocket support

### Scalability Considerations

- **Database Sharding**: Horizontal scaling
- **Caching Layer**: Redis integration
- **Load Balancing**: Traffic distribution
- **Microservices**: Service decomposition
- **Event Sourcing**: Event-driven architecture

---

This implementation documentation provides a comprehensive technical overview of the Gamified Learning Tracker system. Each feature is implemented with modern best practices, ensuring maintainability, performance, and user experience.
