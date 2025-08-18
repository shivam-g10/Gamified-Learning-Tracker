# 🎮 GyaanQuest

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17.x-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-✓-blue.svg)](https://www.docker.com/)

A full-stack gamified learning tracker built with Next.js 15 and PostgreSQL 17. Track your learning progress with XP, levels, streaks, badges, interactive quests, reading progress, and course completion.

## 📚 Documentation & Guidelines

**🤖 AI Agents & Contributors**: Start with our comprehensive documentation system:

- **[📋 AI Guidelines](./docs/AI_GUIDELINES.md)** - **MANDATORY** reading for all AI interactions
- **[📖 Documentation Index](./docs/README.md)** - Complete documentation overview
- **[🤝 Contributing Guide](./docs/CONTRIBUTING.md)** - Contribution standards and workflow

**📁 All documentation is organized in the `docs/` folder for easy navigation.**

## ✨ Features

### 🎯 Core Learning Systems

- **Quest Management** - Create and track learning objectives with XP values
- **Books System** - Track reading progress with page-based logging and status management
- **Courses System** - Track learning progress with unit completion and platform integration
- **Tabbed Interface** - Seamless switching between Quests, Books, and Courses

### ⭐ Gamification & Progress

- **XP System** - Earn experience points and level up (150 XP per level)
- **Focus Boost** - 20% XP bonus for items currently in focus
- **Badge System** - Unlock achievements at XP milestones (150, 400, 800, 1200, 2000 XP)
- **Streaks** - Maintain learning momentum with daily check-ins
- **Progress Analytics** - Comprehensive tracking and visualization

### 🎯 Focus & Organization

- **Smart Focus System** - 1+1+1 limit (1 Quest + 1 Book + 1 Course simultaneously)
- **Category Management** - Organize content by learning subject area
- **Advanced Search & Filtering** - Search by title/category, filter by type, status, and category
- **Smart Sorting** - Sort by any field with visual indicators

### 🎲 Interactive Features

- **Random Challenges** - Get random quests with focus validation
- **Progress Logging** - Log reading progress and course completion
- **Status Tracking** - Automatic status transitions (backlog → active → finished)
- **Responsive Design** - Works on all devices with mobile-first approach

### 🛠️ Development Features

- **Docker Development** - Hot reloading and watch mode for efficient development
- **Code Quality Tools** - ESLint v9, Prettier, Husky, and commitlint
- **Service Layer Architecture** - Clean separation of business logic and presentation
- **TypeScript 5.4.5** - Strict type safety throughout the application

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) 22.0.0+ (for local development)
- [pnpm](https://pnpm.io/) 8.15.0+ (recommended package manager)

### Security Notice

⚠️ **Important**: This application is configured with security best practices:

- Database is isolated and not accessible from outside the Docker network
- Use strong, unique passwords in production
- Never commit `.env` files to version control

### Option 1: Docker Development Database

1. Clone the repository:

```bash
git clone https://github.com/yourusername/Gamified-Learning-Tracker.git
cd Gamified-Learning-Tracker
```

2. Create environment file:

```bash
cp env.example .env
```

3. Start the development database:

```bash
cd dev_infra
docker compose up -d
cd ..
```

4. Set up the database:

```bash
pnpm prisma generate
pnpm prisma db push
```

5. Start the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Option 2: Local Development

1. Clone and install dependencies:

```bash
git clone https://github.com/yourusername/Gamified-Learning-Tracker.git
cd Gamified-Learning-Tracker
pnpm install
```

2. Set up environment:

```bash
cp env.example .env
# Edit .env with your database configuration
```

3. Set up the database:

```bash
pnpm prisma generate
pnpm prisma db push
```

4. Run the development server:

```bash
pnpm dev
```

### Option 3: Development with Quality Tools

For contributors and developers who want to ensure code quality:

1. Follow the [Development Setup Guide](./docs/DEVELOPMENT_SETUP.md) for detailed instructions
2. Install dependencies and set up pre-commit hooks:

```bash
pnpm install
# Husky is auto-initialized on install. If needed, run:
pnpm dlx husky@9 init
```

3. Verify the setup:

```bash
pnpm run lint
pnpm run format:check
pnpm run type-check
```

**Note**: The project includes automatic code formatting, linting, and commit message validation. See the development setup guide for complete details.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15.4.6](https://nextjs.org/) with App Router
- **React**: [React 19.1.1](https://react.dev/) with modern hooks and patterns
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with shadcn/ui components
- **Database**: [PostgreSQL 17](https://www.postgresql.org/) (latest stable)
- **ORM**: [Prisma 6.13.0](https://www.prisma.io/) for type-safe database access
- **Language**: [TypeScript 5.4.5](https://www.typescriptlang.org/) with strict mode
- **State Management**: [SWR 2.2.5](https://swr.vercel.app/) for data fetching and caching
- **Containerization**: [Docker](https://www.docker.com/) for development database setup
- **Package Manager**: [pnpm](https://pnpm.io/) for fast, disk space efficient package management
- **Code Quality**: ESLint v9, Prettier, Husky v9 pre-commit hooks, commitlint
- **Development**: Hot reloading, automatic rebuilds, watch mode, service layer architecture

## 📁 Project Structure

```
GyaanQuest/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes (quests, books, courses, focus)
│   │   ├── health/         # Health check endpoint
│   │   ├── globals.css     # Global styles and Tailwind
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   └── app/           # App-specific components
│   ├── lib/               # Utility functions, hooks, and types
│   └── services/          # Business logic services
│       ├── quest-service.ts      # Quest management
│       ├── book-service.ts       # Book management
│       ├── course-service.ts     # Course management
│       ├── focus-service.ts      # Focus management
│       ├── xp-service.ts         # XP calculations
│       └── ...                   # Additional services
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── dev_infra/            # Development infrastructure (Docker database)
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tracker?schema=public

# Application Environment
NODE_ENV=development
```

### Database Setup

The application uses PostgreSQL 17 with Prisma. The database schema includes:

- **Quests** - Learning objectives and tasks with XP values
- **Books** - Reading progress with page tracking and status management
- **Courses** - Learning progress with unit completion and platform info
- **AppState** - User progress tracking including streaks and focus areas
- **FocusSlot** - Focus management with 1+1+1 limit enforcement

## 🐳 Docker

The application uses Docker for development database setup and production deployment:

### Development Database

For local development, use the included Docker Compose setup:

```bash
# Start development database
cd dev_infra
docker compose up -d

# Stop database
docker compose down

# Reset database (removes all data)
docker compose down -v
docker compose up -d
```

### Production Deployment

The application is containerized with multi-stage builds for optimal production images:

- **deps stage**: Installs dependencies using Node 22
- **builder stage**: Builds the application
- **runner stage**: Production-ready image

### Security Features

- **Database isolation**: Development database runs in isolated container
- **Environment variables**: Secure credential management
- **Health checks**: Automatic service monitoring
- **PostgreSQL 17**: Latest stable database version with enhanced performance

## 📊 API Endpoints

### Core Endpoints

- `GET /health` - Health check
- `GET /api/app-state` - Application state (streaks, focus areas)
- `PUT /api/app-state` - Update application state
- `POST /api/checkin` - Record daily progress

### Quest Management

- `GET /api/quests` - List all quests (with optional search, type, category, done filters)
- `POST /api/quests` - Create new quest
- `GET /api/quests/[id]` - Get specific quest
- `PATCH /api/quests/[id]` - Update quest (mark as done/undone)
- `DELETE /api/quests/[id]` - Delete quest
- `GET /api/random-challenge` - Get random unfinished quest

### Book Management

- `GET /api/books` - List all books with filtering
- `POST /api/books` - Create new book
- `GET /api/books/[id]` - Get book details
- `PATCH /api/books/[id]` - Update book
- `DELETE /api/books/[id]` - Delete book
- `POST /api/books/[id]/log` - Log reading progress

### Course Management

- `GET /api/courses` - List all courses with filtering
- `POST /api/courses` - Create new course
- `GET /api/courses/[id]` - Get course details
- `PATCH /api/courses/[id]` - Update course
- `DELETE /api/courses/[id]` - Delete course
- `POST /api/courses/[id]/log` - Log learning progress

### Focus Management

- `GET /api/focus` - Get current focus state
- `PUT /api/focus` - Update focus (set/remove/switch)
- `DELETE /api/focus` - Clear all focus

## 🎮 Game Mechanics

### XP & Leveling System

- **XP System**: Each quest, book session, and course unit has an XP value
- **Levels**: Every 150 XP grants a new level
- **Focus Boost**: Items in focus receive 20% XP bonus on progress
- **Badges**: Earn badges at XP milestones (150, 400, 800, 1200, 2000 XP)

### Progress Tracking

- **Quests**: Complete learning objectives for XP
- **Books**: Log page progress and earn XP for reading sessions
- **Courses**: Complete units and earn XP for learning progress
- **Streaks**: Maintain daily check-ins to build momentum

### Focus Management

- **1+1+1 Limit**: Maximum 1 Quest + 1 Book + 1 Course in focus simultaneously
- **Smart Validation**: Prevents adding items when focus slots are full
- **Visual Feedback**: Clear indication of focus state and available actions
- **XP Bonus**: Focused items receive 20% XP boost on progress

### Content Organization

- **Quest Types**: topic, project, or bonus quests
- **Book Status**: backlog, reading, or finished
- **Course Status**: backlog, learning, or finished
- **Categories**: Organize content by learning subject
- **Tags**: Flexible labeling system for content organization

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

### 📚 Documentation First

**Before contributing, please read our comprehensive documentation:**

- **[📋 AI Guidelines](./docs/AI_GUIDELINES.md)** - **REQUIRED** for AI agents and contributors
- **[🤝 Contributing Guide](./docs/CONTRIBUTING.md)** - Detailed contribution standards
- **[🚀 Development Setup](./docs/DEVELOPMENT_SETUP.md)** - Local development environment
- **[📖 Implementation Details](./docs/IMPLEMENTATION.md)** - Technical architecture
- **[🎨 Design System](./docs/DESIGN_SYSTEM.md)** - UI/UX guidelines

### Development Workflow

1. **Read the documentation** in the `docs/` folder
2. Fork the repository
3. Create a feature branch (`git checkout -b feature/amazing-feature`)
4. Follow the coding standards and guidelines
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Use TypeScript 5.4.5 for type safety
- Follow Next.js 15 best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Use pnpm as the package manager
- Ensure pnpm-lock.yaml is committed to version control
- **Follow the established project architecture and patterns**
- **Keep all business logic in the service layer**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js 15](https://nextjs.org/)
- Powered by [React 19](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database powered by [PostgreSQL 17](https://www.postgresql.org/)
- Containerized with [Docker](https://www.docker.com/)
- Data fetching with [SWR](https://swr.vercel.app/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)

## 📞 Support

If you have any questions or need help:

- **📚 Check our documentation** in the [`docs/`](./docs/) folder
- **🐛 Open an issue** using our [issue templates](.github/ISSUE_TEMPLATE/)
- **🤝 Submit a PR** following our [contributing guidelines](./docs/CONTRIBUTING.md)
- **📖 Read the [AI Guidelines](./docs/AI_GUIDELINES.md)** if you're an AI agent

---

⭐ **Star this repository if you found it helpful!**

## 🔧 Available Scripts

| Script                  | Description                            |
| ----------------------- | -------------------------------------- |
| `pnpm dev`              | Start development server               |
| `pnpm build`            | Build for production                   |
| `pnpm start`            | Start production server                |
| `pnpm lint`             | Run ESLint checks                      |
| `pnpm lint:fix`         | Fix ESLint issues automatically        |
| `pnpm format`           | Format code with Prettier              |
| `pnpm format:check`     | Check code formatting                  |
| `pnpm type-check`       | Run TypeScript type checking           |
| `pnpm docker:dev`       | Start Docker development environment   |
| `pnpm docker:dev:watch` | Start Docker dev with watch mode       |
| `pnpm docker:prod`      | Start Docker production environment    |
| `pnpm docker:down`      | Stop all Docker containers             |
| `pnpm docker:clean`     | Clean up Docker volumes and containers |
