# 🚀 Development Setup Guide

This guide will help you set up the development environment with all the necessary tools for code quality and consistency.

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) 22.0.0 or higher
- [pnpm](https://pnpm.io/) package manager
- [Git](https://git-scm.com/) for version control

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd foundation_upskill
pnpm install
```

### 2. Setup Pre-commit Hooks

The project uses Husky v9 to manage Git hooks. After installation, set up the hooks:

```bash
# Initialize Husky (creates .husky directory and hooks)
npx husky init

# The hooks are now automatically configured to run:
# - pre-commit: lint-staged (formatting and linting)
# - commit-msg: commitlint (commit message validation)
```

**Note**: If you're setting up an existing project, the hooks should already be configured. If you need to reset them, run `npx husky init` again.

### 3. Verify Installation

Check that all tools are properly installed:

```bash
# Check Prettier
pnpm run format:check

# Check ESLint
pnpm run lint

# Check TypeScript
pnpm run type-check
```

## 🔧 Available Scripts

| Script              | Description                     |
| ------------------- | ------------------------------- |
| `pnpm dev`          | Start development server        |
| `pnpm build`        | Build for production            |
| `pnpm start`        | Start production server         |
| `pnpm lint`         | Run ESLint checks               |
| `pnpm lint:fix`     | Fix ESLint issues automatically |
| `pnpm format`       | Format code with Prettier       |
| `pnpm format:check` | Check code formatting           |
| `pnpm type-check`   | Run TypeScript type checking    |

## 🎯 Pre-commit Hooks

### What Happens on Commit

1. **Code Formatting**: Prettier automatically formats your code
2. **Linting**: ESLint checks for code quality issues
3. **Type Checking**: TypeScript validates types
4. **Commit Message Validation**: Commitlint ensures proper commit message format

### Commit Message Standards

The project follows [Conventional Commits](https://www.conventionalcommits.org/) standards:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Valid Types

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependencies, etc.
- `ci`: CI/CD changes
- `build`: Build system changes
- `revert`: Revert previous commits

#### Examples

```bash
# ✅ Good commit messages
git commit -m "feat: implement user authentication system"
git commit -m "fix: resolve database connection timeout issue"
git commit -m "docs: update API documentation with examples"
git commit -m "style: format code according to Prettier rules"

# ❌ Bad commit messages
git commit -m "fixed stuff"
git commit -m "WIP"
git commit -m "updates"
```

## 🎨 Code Formatting

### Prettier Configuration

The project uses Prettier with the following settings:

- **Semicolons**: Always
- **Quotes**: Single quotes
- **Line Length**: 80 characters
- **Tab Width**: 2 spaces
- **Trailing Commas**: ES5 compatible

### Auto-formatting

Code is automatically formatted on commit. You can also format manually:

```bash
# Format all files
pnpm run format

# Check formatting without changing files
pnpm run format:check
```

## 🔍 Code Quality

### ESLint Rules

The project extends Next.js ESLint configuration with additional rules:

- **Prettier Integration**: Ensures code formatting consistency
- **TypeScript**: Strict type checking
- **Best Practices**: Enforces modern JavaScript/TypeScript patterns

### Running Linting

```bash
# Check for issues
pnpm run lint

# Fix issues automatically
pnpm run lint:fix
```

## 🚫 What Gets Blocked

### Pre-commit Blockers

Your commit will be blocked if:

- ❌ Code doesn't pass ESLint checks
- ❌ Code isn't properly formatted
- ❌ Commit message doesn't follow conventions
- ❌ TypeScript type errors exist

### How to Fix Issues

1. **ESLint Errors**: Run `pnpm run lint:fix`
2. **Formatting Issues**: Run `pnpm run format`
3. **Type Errors**: Fix TypeScript issues in your code
4. **Commit Message**: Use proper conventional commit format

## 🐛 Troubleshooting

### Common Issues

#### Hook Installation Failed

```bash
# Reinstall Husky v9
rm -rf .husky
npx husky init
```

#### Pre-commit Hook Not Running

```bash
# Check if hooks are installed
ls -la .husky/

# Reinstall if missing
npx husky init
```

#### Permission Denied on Hooks

```bash
# Make hooks executable
chmod +x .husky/*
```

#### Dependencies Out of Sync

```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Reset Everything

If you need to start fresh:

```bash
# Remove all generated files
rm -rf node_modules .husky .next

# Reinstall everything
pnpm install
npx husky init
```

## 🔄 Workflow

### Daily Development

1. **Start Development**: `pnpm dev`
2. **Make Changes**: Edit your code
3. **Check Quality**: `pnpm run lint` and `pnpm run format:check`
4. **Commit Changes**: Git will automatically run quality checks
5. **Push**: If all checks pass, push your changes

### Before Committing

Always run these checks:

```bash
pnpm run lint
pnpm run format:check
pnpm run type-check
```

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

When contributing to this project:

1. Follow the commit message conventions
2. Ensure all pre-commit checks pass
3. Run quality checks before pushing
4. Keep code formatted and linted

---

**Happy coding! 🎉**

If you encounter any issues, check the troubleshooting section or open an issue in the repository.
