# AI Guidelines for GyaanQuest

> **📚 Documentation Structure**: This file is part of the comprehensive documentation system. AI agents should start with `../AI_AGENT_ENTRY.md` in the root directory, then read this file along with other documentation in the `docs/` folder.

## 📋 Document Information

- **Version**: 2.2.0
- **Last Updated**: 2024-12-19
- **Maintainer**: Project Lead + All Contributors
- **Review Cycle**: Every 2 weeks or after major changes
- **Enforcement**: Mandatory for all AI agents and human contributors

---

## 🎯 Purpose and Scope

This document establishes mandatory guidelines for all AI agents, developers, and contributors working on GyaanQuest. These guidelines ensure:

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

- **Product**: GyaanQuest
- **Purpose**: Track and gamify learning progress for self learners
- **Target Users**: Self learners
- **Business Model**: Free and open sourced

### Technical Constraints

- **Frontend**: Next.js 15.4.6 with TypeScript 5.4.5 (latest versions)
- **Backend**: Next.js API routes (no separate backend)
- **Database**: PostgreSQL 17 with Prisma ORM 6.13.0 (latest versions)
- **UI Components**: Shadcn/ui (latest versions)
- **Authentication**: Deferred feature (not required for current development)
- **Storage**: Deferred feature (not required for current development)
- **Email**: Deferred feature (not required for current development)
- **Package Manager**: pnpm (not npm or yarn)
- **Testing**: Deferred (not required for current development)
- **Deployment**: Docker

### Feature Requirements

#### Core Features (Current)

- **Quest Management**: Create, edit, delete, and track learning objectives
- **Books System**: Track reading progress with page-based progress logging
- **Courses System**: Track learning progress with unit-based completion
- **XP System**: 150 XP per level with focus boost (20% bonus for focused items)
- **Badge System**: 150, 400, 800, 1200, 2000 XP thresholds
- **Streak Tracking**: Daily check-ins with momentum building
- **Focus Management**: 1+1+1 limit (1 Quest + 1 Book + 1 Course simultaneously)
- **Search & Filtering**: Advanced search, filter, and sort capabilities
- **Random Challenge Generation**: Dynamic quest selection with focus validation
- **Category-based Organization**: Organize content by learning subject
- **Progress Tracking**: Comprehensive analytics and progress visualization
- **Tabbed Interface**: Seamless switching between Quests, Books, and Courses

#### Planned Features (Future)

- **Skill Badges**: Beyond XP-based badges (reading, learning achievements)
- **Notes and File Attachments**: When storage is implemented
- **User Authentication**: When auth is implemented
- **Social Features**: Community sharing and recommendations
- **Advanced Analytics**: Detailed progress insights and reporting

---

## 🤖 AI Agent Guidelines

### 1. Code Generation Standards

#### Git Operations Requirements

**MANDATORY**: AI agents MUST ask for explicit user confirmation before making any Git commits.

- **Never commit without permission**: Always ask "Should I commit these changes?"
- **Present changes clearly**: Show what will be committed and why
- **Wait for approval**: Do not proceed until user explicitly approves
- **Document exceptions**: Only commit without permission in critical emergencies

#### TypeScript Requirements

- **Strict Mode**: Always use `strict: true` in tsconfig
- **No `any` Types**: Use proper TypeScript types or `unknown`
- **Interface First**: Prefer interfaces over types for object shapes
- **Generic Constraints**: Use generics with proper constraints
- **Union Types**: Leverage union types for better type safety
- **Result Pattern**: **MANDATORY** for all functions that can fail

#### Result Type Pattern (MANDATORY)

**ALL functions that can fail MUST use the Result type pattern instead of try-catch blocks:**

```typescript
// ❌ FORBIDDEN: Try-catch with boolean success flags
try {
  const result = await someOperation();
  return { success: true, message: 'Success!' };
} catch (error) {
  return { success: false, message: 'Failed!' };
}

// ✅ REQUIRED: Result type pattern
const result = await someOperation();
if (!result.ok) {
  return fail('Operation failed');
}
return succeed('Operation successful');
```

**Benefits of Result Pattern:**

- **Eliminates try-catch blocks** - Errors are handled explicitly in return values
- **Type-safe error handling** - Success/failure cases are discriminated unions
- **Mandatory error handling** - Callers must handle both success and failure
- **Composable error handling** - Results can be chained and combined
- **No runtime exceptions** - All errors are part of the function signature

**Required Result Types:**

```typescript
// For operations that return data
Promise<Result<T, E>>;

// For operations that don't return data
Promise<Result<void, E>>;

// For synchronous operations
Result<T, E>;
```

**Usage Examples:**

```typescript
// Service methods
static async createQuest(data: CreateQuestData): Promise<Result<string>> {
  const response = await fetch('/api/quests', { method: 'POST', body: JSON.stringify(data) });

  if (!response.ok) {
    return fail('Failed to create quest');
  }

  return succeed('Quest created successfully!');
}

// API endpoints
export async function POST(req: Request): Promise<NextResponse> {
  const result = await QuestService.createQuest(data);

  if (result._tag === 'Failure') {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ message: result.data });
}
```

**Result Type Implementation:**

```typescript
// src/lib/result.ts
export type Result<T, E = string> = Success<T> | Failure<E>;

export function succeed<T>(data: T): Success<T> {
  return { _tag: 'Success', data };
}

export function fail<E>(error: E): Failure<E> {
  return { _tag: 'Failure', error };
}
```

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
│   ├── types.ts          # TypeScript type definitions
│   ├── result.ts         # Result type pattern implementation
│   ├── client-types.ts   # Client-safe type definitions
│   └── client-services.ts # Client-safe service methods
├── services/              # Business logic services
│   ├── quest-service.ts   # Quest management logic
│   ├── book-service.ts    # Book management logic
│   ├── course-service.ts  # Course management logic
│   ├── focus-service.ts   # Focus management logic
│   ├── xp-service.ts      # XP and leveling logic
│   └── category-badge-service.ts   # Badge calculation logic
```

#### Naming Conventions

- **Files**: kebab-case (e.g., `quest-service.ts`)
- **Components**: PascalCase (e.g., `QuestRow`)
- **Functions**: camelCase (e.g., `calculateXp`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `XP_PER_LEVEL`)
- **Types/Interfaces**: PascalCase (e.g., `Quest`, `Book`, `Course`)
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

- **Naming**: Use resource-based URLs (e.g., `/api/quests`, `/api/books`, `/api/courses`)
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

### 3. Git Operations and Commits

#### Commit Confirmation Requirement

**MANDATORY**: AI agents MUST ask for explicit user confirmation before making any Git commits, including:

- **Initial Commits**: First commit of new features or changes
- **Feature Commits**: Commits implementing new functionality
- **Refactor Commits**: Commits restructuring existing code
- **Documentation Commits**: Commits updating documentation
- **Format Commits**: Commits fixing code formatting
- **Any Other Commits**: All Git operations that modify repository history

#### Confirmation Process

1. **Present Changes**: Show user what will be committed
2. **Explain Purpose**: Clearly state why the commit is needed
3. **Request Permission**: Ask "Should I commit these changes?"
4. **Wait for Response**: Do not proceed until user explicitly approves
5. **Execute Only After Approval**: Commit only after receiving confirmation

#### Examples of Required Confirmations

```
❌ INCORRECT - No confirmation:
"I'll commit these changes now."

✅ CORRECT - With confirmation:
"I have the following changes ready to commit:
- Added Books and Courses system
- Implemented new 1+1+1 focus system
- Updated XP system with focus boost

Should I commit these changes?"
```

#### Exception Cases

- **No Commits Without Permission**: Never commit without explicit user approval
- **Emergency Situations**: Only in critical system failures (document and explain afterward)
- **User-Initiated Commits**: When user explicitly says "commit this" or similar

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
- **DESIGN_SYSTEM.md**: UI/UX design system and color scheme

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
- **No Try-Catch with Boolean Flags**: **FORBIDDEN** - Use Result type pattern instead
- **Result Type Pattern**: **MANDATORY** - All functions that can fail must return Result<T, E>

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
- [ ] **Use Result type pattern for all functions that can fail**
- [ ] **ALWAYS ask for confirmation before committing changes**

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
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - UI/UX design system
- [package.json](../package.json) - Dependencies and scripts
- [tsconfig.json](../tsconfig.json) - TypeScript configuration
- [docker-compose.yml](../docker-compose.yml) - Docker configuration

---

## 📅 Review and Update History

| Version | Date       | Changes                                                                       | Author       |
| ------- | ---------- | ----------------------------------------------------------------------------- | ------------ |
| 2.2.0   | 2024-12-19 | Added Result type pattern implementation and client-safe services             | Project Lead |
| 2.1.0   | 2024-12-19 | Added Result type pattern as MANDATORY for error handling                     | Project Lead |
| 2.0.0   | 2024-12-19 | Updated with Books & Courses system, new focus system, and current tech stack | Project Lead |
| 1.0.0   | 2024-12-19 | Initial creation                                                              | Project Lead |

---

**⚠️ IMPORTANT: This document is MANDATORY for all contributors. Failure to comply may result in code rejection or removal from the project. Always check this document before starting work and update it when making process changes.**

---

## 🎯 **Project-Specific Standards**

### Quest Management

- **Quest Structure**: Always include title, XP, type, category, completion status
- **XP Values**: Use realistic XP values (10-150 range)
- **Categories**: Use consistent category names across the system
- **Types**: Limit to 'topic', 'project', 'bonus' only

### Books & Courses System

- **Book Structure**: Include title, author, total pages, current page, status, category, tags
- **Course Structure**: Include title, platform, total units, completed units, status, category, tags
- **Progress Tracking**: Log progress with from/to pages (books) or units (courses)
- **Status Management**: Automatic status transitions (backlog → reading/learning → finished)

### Focus Management

- **1+1+1 Limit**: Maximum 1 Quest + 1 Book + 1 Course in focus simultaneously
- **Focus Boost**: 20% XP bonus for items currently in focus
- **Validation**: Prevent adding items when focus slots are full
- **Visual Feedback**: Clear indication of focus state and available actions

### XP System

- **Level Calculation**: 150 XP per level, starting from level 1
- **Progress Tracking**: Show progress within current level
- **Badge Thresholds**: Maintain existing thresholds (150, 400, 800, 1200, 2000)
- **Focus Boost**: 20% bonus for focused items on session progress

### UI/UX Standards

- **Shadcn/ui Components**: Use Shadcn/ui components exclusively for UI
- **Dark Theme**: Maintain dark theme consistency
- **Responsive Design**: Ensure mobile-first responsive design
- **Accessibility**: Include proper ARIA labels and keyboard navigation
- **Tabbed Interface**: Seamless switching between Quests, Books, and Courses

### Code Organization

- **Service Layer**: All business logic must be in service functions
- **Component Purity**: Components should only handle presentation and user interaction
- **Type Safety**: Use strict TypeScript with no `any` types
- **Error Handling**: Implement proper error boundaries and user feedback
- **Progress Logging**: Comprehensive progress tracking with API endpoints
