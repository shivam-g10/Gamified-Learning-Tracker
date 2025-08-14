# AI Guidelines for Gamified Learning Tracker

## 📋 Document Information

- **Version**: 1.0.0
- **Last Updated**: 2024-12-19
- **Maintainer**: Project Lead + All Contributors
- **Review Cycle**: Every 2 weeks or after major changes
- **Enforcement**: Mandatory for all AI agents and human contributors

---

## 🎯 Purpose and Scope

This document establishes mandatory guidelines for all AI agents, developers, and contributors working on the Gamified Learning Tracker. These guidelines ensure:

- **Consistency** in code quality, architecture, and development practices
- **Alignment** with project requirements and business objectives
- **Quality** through standardized processes and review procedures
- **Collaboration** through clear communication protocols
- **Compliance** with project constraints and technical requirements

---

## 🚨 MANDATORY COMPLIANCE

**ALL AI agents and human contributors MUST:**

1. Read and understand this document before contributing
2. Follow these guidelines without exception
3. Update this document when making changes to processes or standards
4. Reference this document in all communications and code changes
5. Report violations or suggest improvements

---

## 📚 Project Requirements (IMMUTABLE)

### Core Project Definition

- **Product**: Gamified Learning Tracker
- **Purpose**: Track and gamify learning progress for self learners
- **Target Users**: Self learners
- **Business Model**: Free and open sourced

### Technical Constraints

- **Frontend**: Next.js 15 with TypeScript 5 (latest versions)
- **Backend**: Next.js API routes (no separate backend)
- **Database**: PostgreSQL with Prisma ORM (latest versions)
- **UI Components**: Shadcn/ui (latest versions)
- **Authentication**: Deferred feature (not required for current development)
- **Storage**: Deferred feature (not required for current development)
- **Email**: Deferred feature (not required for current development)
- **Package Manager**: pnpm (not npm or yarn)
- **Testing**: Deferred (not required for current development)
- **Deployment**: Docker

### Feature Requirements

#### Core Features (Current)

- Quest management (create, edit, delete)
- XP system with leveling (150 XP per level)
- Badge system (150, 400, 800, 1200, 2000 XP thresholds)
- Streak tracking with daily check-ins
- Focus management (up to 3 quests)
- Search, filter, and sort quests
- Random challenge generation
- Category-based organization
- Progress tracking and analytics

#### Planned Features (Future)

- Reading list tracking
- Course tracking
- Skill badges (beyond XP-based badges)
- Notes and file attachments (when storage is implemented)
- User authentication (when auth is implemented)

---

## 🤖 AI Agent Guidelines

### 1. Code Generation Standards

#### TypeScript Requirements

- **Strict Mode**: Always use `strict: true` in tsconfig
- **No `any` Types**: Use proper TypeScript types or `unknown`
- **Interface First**: Prefer interfaces over types for object shapes
- **Generic Constraints**: Use generics with proper constraints
- **Union Types**: Leverage union types for better type safety

#### React/Next.js Standards

- **Functional Components**: Use functional components with hooks
- **TypeScript Props**: Always type component props with interfaces
- **Error Boundaries**: Implement proper error handling
- **Performance**: Use React.memo, useMemo, useCallback appropriately
- **Accessibility**: Include proper ARIA labels and semantic HTML

#### Architecture Standards

- **Thin Views**: Keep components focused on presentation only
- **Service Layer**: Move business logic to service functions
- **Clean Code**: Follow clean code principles (SOLID, DRY, KISS)
- **Separation of Concerns**: Clear separation between UI, logic, and data layers

### 2. Architecture Standards

#### File Organization

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # Reusable UI components
│   ├── ui/                # shadcn/ui components
│   └── app/               # App-specific components
├── lib/                   # Utility functions and services
│   ├── db.ts             # Database utilities
│   ├── xp.ts             # XP calculation logic
│   ├── hooks.ts          # Custom React hooks
│   └── types.ts          # TypeScript type definitions
├── services/              # Business logic services
│   ├── quest-service.ts   # Quest management logic
│   ├── xp-service.ts      # XP and leveling logic
│   └── badge-service.ts   # Badge calculation logic
└── types/                 # TypeScript type definitions
```

#### Naming Conventions

- **Files**: kebab-case (e.g., `quest-service.ts`)
- **Components**: PascalCase (e.g., `QuestRow`)
- **Functions**: camelCase (e.g., `calculateXp`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `XP_PER_LEVEL`)
- **Types/Interfaces**: PascalCase (e.g., `Quest`, `AppState`)
- **Services**: kebab-case with `-service.ts` suffix

#### Import/Export Standards

- **Named Exports**: Prefer named exports over default exports
- **Barrel Exports**: Use index.ts files for clean imports
- **Relative Paths**: Use relative paths within src/
- **Type Imports**: Use `import type` for type-only imports

### 3. Database Standards

#### Prisma Schema

- **Naming**: Use PascalCase for models, camelCase for fields
- **Relations**: Define explicit relationships with proper constraints
- **Indexes**: Add indexes for frequently queried fields
- **Validation**: Use Prisma's built-in validation features
- **Migrations**: Never modify production schema directly

#### Query Patterns

- **Transactions**: Use transactions for multi-step operations
- **Error Handling**: Proper error handling for database operations
- **Connection Management**: Proper connection lifecycle management
- **Performance**: Use select() to limit returned fields

### 4. API Design Standards

#### REST Endpoints

- **Naming**: Use resource-based URLs (e.g., `/api/quests`)
- **HTTP Methods**: Use appropriate HTTP methods (GET, POST, PUT, DELETE)
- **Status Codes**: Return proper HTTP status codes
- **Error Responses**: Consistent error response format
- **Validation**: Use Zod for request/response validation (when implemented)

#### Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

---

## 👥 Human Contributor Guidelines

### 1. Development Workflow

#### Before Starting Work

1. **Pull Latest**: Always pull latest changes from main branch
2. **Create Branch**: Create feature branch from main
3. **Review Guidelines**: Ensure understanding of current guidelines
4. **Check Dependencies**: Verify all dependencies are installed

#### During Development

1. **Follow Standards**: Adhere to all coding standards
2. **Test Locally**: Test functionality manually before committing
3. **Lint Code**: Ensure code passes linting
4. **Document Changes**: Update relevant documentation

#### Before Committing

1. **Manual Testing**: Test all functionality manually
2. **Lint Code**: Run linter and fix any issues
3. **Format Code**: Use Prettier for consistent formatting
4. **Review Changes**: Self-review all changes

### 2. Code Review Process

#### Review Requirements

- **All Changes**: Every change must be reviewed
- **Functionality**: Ensure new features work as expected
- **Documentation**: Verify documentation is updated
- **Guidelines**: Check compliance with these guidelines

#### Review Checklist

- [ ] Code follows TypeScript standards
- [ ] Functionality works as expected
- [ ] Linting passes without errors
- [ ] Documentation is updated
- [ ] No breaking changes introduced
- [ ] Performance considerations addressed
- [ ] Clean code principles followed

---

## 📝 Documentation Standards

### 1. Code Documentation

#### JSDoc Comments

```typescript
/**
 * Calculates XP required for the next level
 * @param currentXp - Current total XP
 * @returns XP required for next level
 */
export function getXpForNextLevel(currentXp: number): number;
```

#### README Files

- **Purpose**: Clear description of what the file/component does
- **Usage**: Examples of how to use the code
- **Dependencies**: List of required dependencies
- **API**: Document public interfaces and methods

### 2. Project Documentation

#### Living Documents

- **AI_GUIDELINES.md**: This document (update when processes change)
- **README.md**: Project overview and setup instructions
- **DEVELOPMENT_SETUP.md**: Development environment setup
- **IMPLEMENTATION.md**: Current progress and next steps
- **DOCKER.md**: Docker setup and deployment instructions

#### Update Process

1. **Identify Need**: Recognize when documentation needs updating
2. **Propose Changes**: Suggest updates through issues or discussions
3. **Review Changes**: Have changes reviewed by team members
4. **Update Document**: Make changes and commit
5. **Notify Team**: Inform team of documentation updates

---

## 🔄 Update and Maintenance Process

### 1. Guideline Updates

#### When to Update

- **Process Changes**: When development processes change
- **New Standards**: When new coding standards are adopted
- **Tool Changes**: When development tools are updated
- **Team Feedback**: When team members suggest improvements

#### Update Process

1. **Propose Change**: Create issue or discussion for proposed changes
2. **Team Review**: Have proposed changes reviewed by team
3. **Approval**: Get approval from project lead or team consensus
4. **Implementation**: Update the document
5. **Communication**: Notify all team members of changes
6. **Training**: Ensure team understands new guidelines

### 2. Version Control

#### Version Numbering

- **Major**: Significant changes to guidelines or processes
- **Minor**: New guidelines or standards added
- **Patch**: Minor corrections or clarifications

#### Change Log

- **Track Changes**: Document all changes with version numbers
- **Rationale**: Explain why changes were made
- **Impact**: Describe how changes affect team members
- **Migration**: Provide guidance for adapting to changes

---

## 🚫 Prohibited Practices

### 1. Code Quality Violations

- **No `any` Types**: Never use `any` type in TypeScript
- **No Console Logs**: Remove console.log statements in production code
- **No Unused Imports**: Remove unused imports and dependencies
- **No Hardcoded Values**: Use environment variables or configuration files
- **No Magic Numbers**: Define constants for numeric values
- **No Business Logic in Components**: Move logic to service layer

### 2. Process Violations

- **No Direct Commits**: Never commit directly to main branch
- **No Untested Code**: Never commit code without manual testing
- **No Unreviewed Changes**: Never merge unreviewed code
- **No Breaking Changes**: Never introduce breaking changes without notice
- **No Documentation Skipping**: Never skip documentation updates

---

## ✅ Compliance Checklist

### For AI Agents

- [ ] Read and understood all guidelines
- [ ] Follow TypeScript standards strictly
- [ ] Implement proper error handling
- [ ] Use proper naming conventions
- [ ] Follow file organization standards
- [ ] Document all public interfaces
- [ ] Handle edge cases appropriately
- [ ] Keep components thin and move logic to services
- [ ] Follow clean code principles

### For Human Contributors

- [ ] Read and understood all guidelines
- [ ] Follow development workflow
- [ ] Test all new functionality manually
- [ ] Update documentation as needed
- [ ] Participate in code reviews
- [ ] Report guideline violations
- [ ] Suggest guideline improvements
- [ ] Stay updated on guideline changes

---

## 📞 Support and Questions

### Getting Help

- **Guideline Questions**: Create issue with "guidelines" label
- **Process Questions**: Ask in team discussions
- **Clarification Requests**: Tag project lead or senior team members
- **Improvement Suggestions**: Submit through issues or discussions

### Escalation Process

1. **Team Discussion**: Discuss with team members first
2. **Project Lead**: Escalate to project lead if needed
3. **Documentation Update**: Update guidelines based on resolution
4. **Team Notification**: Inform team of changes and rationale

---

## 🔗 Related Documents

- [README.md](./README.md) - Project overview and setup
- [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) - Development environment setup
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Current progress and next steps
- [package.json](./package.json) - Dependencies and scripts
- [tsconfig.json](./tsconfig.json) - TypeScript configuration
- [docker-compose.yml](./docker-compose.yml) - Docker configuration

---

## 📅 Review and Update History

| Version | Date       | Changes          | Author       |
| ------- | ---------- | ---------------- | ------------ |
| 1.0.0   | 2024-12-19 | Initial creation | Project Lead |

---

**⚠️ IMPORTANT: This document is MANDATORY for all contributors. Failure to comply may result in code rejection or removal from the project. Always check this document before starting work and update it when making process changes.**

---

## 🎯 **Project-Specific Standards**

### Quest Management

- **Quest Structure**: Always include title, XP, type, category, completion status
- **XP Values**: Use realistic XP values (10-150 range)
- **Categories**: Use consistent category names across the system
- **Types**: Limit to 'topic', 'project', 'bonus' only

### XP System

- **Level Calculation**: 150 XP per level, starting from level 1
- **Progress Tracking**: Show progress within current level
- **Badge Thresholds**: Maintain existing thresholds (150, 400, 800, 1200, 2000)

### UI/UX Standards

- **Shadcn/ui Components**: Use Shadcn/ui components exclusively for UI
- **Dark Theme**: Maintain dark theme consistency
- **Responsive Design**: Ensure mobile-first responsive design
- **Accessibility**: Include proper ARIA labels and keyboard navigation

### Code Organization

- **Service Layer**: All business logic must be in service functions
- **Component Purity**: Components should only handle presentation and user interaction
- **Type Safety**: Use strict TypeScript with no `any` types
- **Error Handling**: Implement proper error boundaries and user feedback
