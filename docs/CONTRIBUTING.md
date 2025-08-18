# Contributing to GyaanQuest

Thank you for your interest in contributing to GyaanQuest! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 22.0.0+
- pnpm package manager
- Git
- Docker (optional, for containerized development)

### Development Setup

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/yourusername/Gamified-Learning-Tracker.git
   cd Gamified-Learning-Tracker
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Set up environment:
   ```bash
   cp .env.example .env
   # Edit .env with your database configuration
   ```
5. Set up the database:
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   pnpm run db:seed
   ```
6. Start the development server:
   ```bash
   pnpm dev
   ```

### Running Tests

Testing is currently deferred per the project guidelines. There are no test scripts defined yet.

### Optional: Docker-based Development Database

You can run the development database with Docker for a consistent local environment:

```bash
# Start development database
cd dev_infra && docker compose up -d

# Stop database
cd dev_infra && docker compose down

# Reset database (removes all data)
cd dev_infra && docker compose down -v && docker compose up -d
```

### Issues and Pull Requests

Please use the templates in `.github/ISSUE_TEMPLATE/` and `.github/pull_request_template.md` when opening issues or PRs.
