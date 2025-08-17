# Contributing to GyaanQuest

Thank you for your interest in contributing to GyaanQuest! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Docker (optional, for containerized development)

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/Gamified-Learning-Tracker.git
   cd Gamified-Learning-Tracker
   ```

````
3. Install dependencies:
   ```bash
   pnpm install
````

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

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage
```
