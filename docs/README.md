# 📚 Documentation Index

Welcome to the **GyaanQuest** documentation. This folder contains all the information needed to understand, contribute to, and maintain this comprehensive learning tracker project.

## 🎯 Quick Start for AI Agents

**⚠️ IMPORTANT: Before making any changes, AI agents MUST read these files:**

1. **[AI_GUIDELINES.md](./AI_GUIDELINES.md)** - **REQUIRED READING** for all AI interactions
2. **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute to this project
3. **[DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)** - Local development environment setup

## 📖 Documentation Structure

### Core Guidelines (AI Agents Start Here)

- **[AI_GUIDELINES.md](./AI_GUIDELINES.md)** - **MANDATORY** for all AI interactions
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution standards and workflow

### Development & Implementation

- **[DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)** - Local development setup
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - Technical implementation details
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - UI/UX design system and color scheme

### Project Overview

- **[../README.md](../README.md)** - Project overview and quick start (in root directory)
- **[../LICENSE](../LICENSE)** - Project license (in root directory)

## 🤖 AI Agent Workflow

1. **ALWAYS** read `AI_GUIDELINES.md` first
2. **ALWAYS** read `CONTRIBUTING.md` for contribution standards
3. **ALWAYS** ask for explicit confirmation before making Git commits
4. Follow the established code standards and architecture
5. Update relevant documentation when making changes

## 🔍 Finding Information

- **New to the project?** Start with `AI_GUIDELINES.md` and `CONTRIBUTING.md`
- **Setting up development?** See `DEVELOPMENT_SETUP.md`
- **Understanding the code?** Check `IMPLEMENTATION.md`
- **Working on UI/UX?** Reference `DESIGN_SYSTEM.md`
- **General project info?** See the root `README.md`

## 📚 Project Overview

GyaanQuest is a comprehensive learning tracker that includes:

### 🎯 Core Learning Systems

- **Quest System**: Learning objectives and tasks with XP values
- **Books System**: Reading progress tracking with page-based logging
- **Courses System**: Learning progress tracking with unit completion
- **Tabbed Interface**: Seamless switching between Quests, Books, and Courses

### ⭐ Gamification & Progress

- **XP System**: 150 XP per level with focus boost (20% bonus for focused items)
- **Badge System**: Achievement milestones at XP thresholds (150, 400, 800, 1200, 2000 XP)
- **Streak Tracking**: Daily check-ins with momentum building
- **Progress Analytics**: Comprehensive tracking and visualization

### 🎯 Focus & Organization

- **Smart Focus System**: 1+1+1 limit (1 Quest + 1 Book + 1 Course simultaneously)
- **Category Management**: Organize content by learning subject area
- **Advanced Search & Filtering**: Search, filter, and sort capabilities
- **Status Tracking**: Automatic transitions (backlog → active → finished)

## 🏗️ Architecture Overview

The project follows a clean service layer architecture:

- **Components**: Handle only presentation and user interaction
- **Services**: Contain all business logic and data operations
- **Hooks**: Provide data access and state management
- **Types**: Define clear interfaces for data structures

### Key Services

- **QuestService**: Quest management and operations
- **BookService**: Book management and reading progress
- **CourseService**: Course management and learning progress
- **FocusService**: Focus management with 1+1+1 limit
- **XPService**: XP calculations and leveling
- **CategoryBadgeService**: Progress tracking and achievements

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.4.6 with App Router
- **React**: React 19.1.1 with modern hooks
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Database**: PostgreSQL 17 with Prisma 6.13.0 ORM
- **Language**: TypeScript 5.4.5 with strict mode
- **State Management**: SWR 2.2.5 for data fetching
- **Package Manager**: pnpm for dependency management
- **Code Quality**: ESLint v9, Prettier, Husky v9, commitlint

## 📝 Documentation Standards

- All documentation is written in Markdown
- Use clear, concise language
- Include code examples where helpful
- Keep documentation up-to-date with code changes
- Follow the established formatting patterns
- Update version numbers when making significant changes

## 🔄 Recent Updates

### Version 2.0.0 (2024-12-19)

- **Books System**: Complete CRUD operations with progress tracking
- **Courses System**: Complete CRUD operations with progress tracking
- **New Focus System**: 1+1+1 limit (1 Quest + 1 Book + 1 Course)
- **Enhanced XP System**: Focus boost (20% bonus) for focused items
- **Tabbed Interface**: Seamless switching between content types
- **Progress Logging**: API endpoints for tracking progress
- **Service Layer**: Comprehensive business logic separation

### Previous Versions

- **Version 1.0.0**: Initial Quest system with XP and badges
- **UI Refactor**: Complete transformation to GyaanQuest design
- **Design System**: Mint Arcade brand skin implementation

---

**Remember: AI agents must read the guidelines before proceeding with any changes!**

## 📞 Getting Help

- **Documentation Issues**: Open an issue with "documentation" label
- **Guideline Questions**: Create issue with "guidelines" label
- **Process Questions**: Ask in team discussions
- **Clarification Requests**: Tag project lead or senior team members
