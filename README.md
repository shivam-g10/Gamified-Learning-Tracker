# 🎮 Gamified Learning Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-✓-blue.svg)](https://www.docker.com/)

A full-stack gamified learning tracker built with Next.js and PostgreSQL. Track your learning progress with XP, levels, streaks, badges, and interactive quests.

## 📚 Documentation & Guidelines

**🤖 AI Agents & Contributors**: Start with our comprehensive documentation system:

- **[📋 AI Guidelines](./docs/AI_GUIDELINES.md)** - **MANDATORY** reading for all AI interactions
- **[📖 Documentation Index](./docs/README.md)** - Complete documentation overview
- **[🤝 Contributing Guide](./docs/CONTRIBUTING.md)** - Contribution standards and workflow

**📁 All documentation is organized in the `docs/` folder for easy navigation.**

## ✨ Features

- 🎯 **Quest Management** - Create and track learning objectives
- ⭐ **XP System** - Earn experience points and level up (150 XP per level)
- 🔥 **Streaks** - Maintain learning momentum with daily check-ins
- 🏆 **Badges** - Unlock achievements at XP milestones (150, 400, 800, 1200, 2000 XP)
- 📚 **Categories** - Organize learning by subject area
- 🎲 **Random Challenges** - Get random quests to spice up your learning routine
- 📱 **Responsive Design** - Works on all devices
- 🎯 **Focus System** - Mark up to 3 quests as current focus areas
- 🔍 **Advanced Search & Filtering** - Search by title/category, filter by type and category
- 📊 **Smart Sorting** - Sort quests by title, XP, category, type, completion status, or date created
- 🐳 **Docker Development** - Hot reloading and watch mode for efficient development

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) 18+ (for local development)
- [pnpm](https://pnpm.io/) 8.15.0+ (recommended package manager)

### Security Notice

⚠️ **Important**: This application is configured with security best practices:

- Database is isolated and not accessible from outside the Docker network
- Use strong, unique passwords in production
- Never commit `.env` files to version control

### Option 1: Docker (Recommended)

1. Clone the repository:

```bash
git clone https://github.com/yourusername/Gamified-Learning-Tracker.git
cd Gamified-Learning-Tracker
```

2. Create environment file:

```bash
cp env.example .env
# Edit .env and set secure passwords
```

3. Start the application:

```bash
docker compose up --build
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

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
pnpm run db:seed
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
pnpm run prepare
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
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL 17](https://www.postgresql.org/) (latest stable)
- **ORM**: [Prisma](https://www.prisma.io/) for type-safe database access
- **Containerization**: [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/) with Watch Mode
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [SWR](https://swr.vercel.app/) for data fetching
- **Package Manager**: [pnpm](https://pnpm.io/) for fast, disk space efficient package management
- **Code Quality**: ESLint v9, Prettier, Husky pre-commit hooks
- **Development**: Hot reloading, automatic rebuilds, watch mode

## 📁 Project Structure

```
Gamified-Learning-Tracker/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── health/         # Health check endpoint
│   │   ├── globals.css     # Global styles
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable UI components
│   └── lib/               # Utility functions and database
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── docker-compose.yml     # Docker configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```env
# Database Configuration
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=tracker

# Application Environment
NODE_ENV=production
```

### Database Setup

The application uses PostgreSQL with Prisma. The database schema includes:

- **Quests** - Learning objectives and tasks with XP values
- **AppState** - User progress tracking including streaks and focus areas

## 🐳 Docker

The application is containerized with multi-stage builds for optimal production images:

- **deps stage**: Installs dependencies using Node 22
- **builder stage**: Builds the application
- **runner stage**: Production-ready image

### Development with Docker

For development with hot reloading and watch mode:

```bash
# Start development environment with watch mode
pnpm run docker:dev:watch

# Start development environment without watch mode
pnpm run docker:dev

# Start production environment
pnpm run docker:prod

# Stop all containers
pnpm run docker:down

# Clean up volumes and containers
pnpm run docker:clean
```

### Security Features

- **Database isolation**: Database is not exposed to external ports in production
- **Network isolation**: Services communicate only within Docker network
- **Environment variables**: Secure credential management
- **Health checks**: Automatic service monitoring
- **Restart policies**: Production-ready reliability
- **PostgreSQL 17**: Latest stable database version with enhanced performance

## 📊 API Endpoints

- `GET /health` - Health check
- `GET /api/quests` - List all quests (with optional search, type, category, done filters)
- `GET /api/quests/[id]` - Get specific quest
- `PATCH /api/quests/[id]` - Update quest (mark as done/undone)
- `DELETE /api/quests/[id]` - Delete quest
- `POST /api/checkin` - Record daily progress
- `GET /api/app-state` - Application state (streaks, focus areas)
- `PUT /api/app-state` - Update application state
- `GET /api/random-challenge` - Get random unfinished quest

## 🎮 Game Mechanics

- **XP System**: Each quest has an XP value. Complete quests to earn XP and level up
- **Levels**: Every 150 XP grants a new level
- **Streaks**: Maintain daily check-ins to build momentum
- **Focus Areas**: Mark up to 3 quests as your current focus
- **Badges**: Earn badges at XP milestones (150, 400, 800, 1200, 2000 XP)
- **Quest Types**: topic, project, or bonus quests
- **Categories**: Organize quests by learning subject

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

- Use TypeScript for type safety
- Follow Next.js best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Use pnpm as the package manager
- Ensure pnpm-lock.yaml is committed to version control
- **Follow the established project architecture and patterns**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database powered by [PostgreSQL](https://www.postgresql.org/)
- Containerized with [Docker](https://www.docker.com/)
- Data fetching with [SWR](https://swr.vercel.app/)

## 📞 Support

If you have any questions or need help:

- **📚 Check our documentation** in the [`docs/`](./docs/) folder
- **🐛 Open an issue** using our [issue template](.github/ISSUE_TEMPLATE.md)
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
