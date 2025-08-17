# AI Development Workflow for GyaanQuest

> **📚 Documentation Structure**: This file is part of the comprehensive documentation system. AI agents should start with `../AI_AGENT_ENTRY.md` in the root directory, then read this file along with other documentation in the `docs/` folder.

## 🚨 MANDATORY COMPLIANCE FOR AI AGENTS

**ALL AI agents working on GyaanQuest MUST follow this workflow without exception.**

---

## 🔒 Git Operations Policy

### **ABSOLUTELY FORBIDDEN: Committing Without Explicit Consent**

**AI agents MUST NEVER commit code without explicit user permission.**

- ❌ **Never commit automatically**
- ❌ **Never commit "fixes" without asking**
- ❌ **Never commit formatting changes without permission**
- ❌ **Never commit documentation updates without permission**
- ❌ **Never commit any changes without explicit consent**

### **REQUIRED: Explicit Permission Before Any Git Operation**

**Before ANY git operation, AI agents MUST:**

1. **Present Changes**: Show exactly what will be committed
2. **Explain Purpose**: Clearly state why the commit is needed
3. **Request Permission**: Ask "Should I commit these changes?"
4. **Wait for Response**: Do not proceed until user explicitly approves
5. **Execute Only After Approval**: Commit only after receiving confirmation

---

## 🛡️ Pre-Commit Quality Gates

### **Hook 1: Pre-Commit (Strict Quality Checks)**

The pre-commit hook runs automatically and **WILL BLOCK** commits if any check fails:

```bash
# Pre-commit checks (automatic - blocks commits if failed)
✅ Code formatting (Prettier)
✅ ESLint (no errors allowed)
✅ TypeScript type checking
```

**If any check fails, the commit is BLOCKED until fixed.**

### **Hook 2: Commit-Message (Format Validation)**

The commit-msg hook validates commit message format:

```bash
# Required format: <type>(<scope>): <description>
✅ feat: add new quest system
✅ fix(auth): resolve login issue
✅ docs: update API documentation
❌ "fixed stuff" (invalid format)
❌ "updated things and made improvements" (too long)
```

**If format is invalid, the commit is BLOCKED until fixed.**

### **Hook 3: Pre-Push (Full CI Validation)**

The pre-push hook runs full CI validation:

```bash
# Pre-push checks (automatic - blocks pushes if failed)
✅ Code formatting
✅ ESLint (warnings allowed, errors blocked)
✅ TypeScript type checking
✅ Next.js build
```

**If any check fails, the push is BLOCKED until fixed.**

---

## 🔍 Quality Check Commands

### **Quick Quality Check (Pre-Commit)**

```bash
pnpm pre-commit:check
```

**Runs**: Format + Lint + Type Check

### **Full CI Validation (Pre-Push)**

```bash
pnpm ci:check
```

**Runs**: Format + Lint + Type Check + Build

### **Individual Checks**

```bash
pnpm ci:check:format    # Prettier formatting
pnpm ci:check:lint      # ESLint
pnpm ci:check:types     # TypeScript
pnpm ci:check:build     # Next.js build
```

---

## 📋 AI Development Workflow

### **Step 1: Before Making Changes**

```bash
# 1. Pull latest changes
git pull origin master

# 2. Check current status
git status

# 3. Ensure clean working directory
git diff --cached
```

### **Step 2: Make Code Changes**

- Follow TypeScript standards strictly
- Use Result type pattern for error handling
- Keep components thin, move logic to services
- Follow naming conventions and file organization

### **Step 3: Quality Validation (REQUIRED)**

```bash
# Run pre-commit quality checks
pnpm pre-commit:check

# If any check fails, fix issues before proceeding
pnpm format          # Fix formatting
pnpm lint:fix        # Fix auto-fixable linting issues
# Fix TypeScript errors manually
```

### **Step 4: Present Changes to User**

**MANDATORY**: Show user exactly what will be committed:

```bash
# Show staged changes
git diff --cached

# Show all changes
git status
```

**Example Presentation:**

```
I have the following changes ready to commit:

📝 Modified files:
- src/services/quest-service.ts (added Result type pattern)
- src/app/api/quests/route.ts (updated error handling)
- src/lib/result.ts (new Result type implementation)

🔍 Changes made:
- Implemented mandatory Result type pattern
- Updated quest service to use Result<T, E>
- Added proper error handling without try-catch

Should I commit these changes?
```

### **Step 5: Wait for Explicit Permission**

- **Do NOT proceed** until user says "yes" or "commit"
- **Do NOT interpret** vague responses as permission
- **Ask for clarification** if response is unclear

### **Step 6: Execute Git Operations (After Permission)**

```bash
# 1. Stage changes
git add .

# 2. Commit with proper message
git commit -m "feat: implement Result type pattern for error handling"

# 3. Push (will trigger pre-push validation)
git push origin master
```

---

## 🚫 Common Violations and Prevention

### **Violation 1: Auto-Commit Without Permission**

**❌ WRONG:**

```
"I'll fix the formatting and commit the changes."
```

**✅ CORRECT:**

```
"I can see formatting issues. Should I fix them and then ask for permission to commit?"
```

### **Violation 2: Assuming Permission from Context**

**❌ WRONG:**

```
"Since you asked me to fix the types, I'll commit the fixes."
```

**✅ CORRECT:**

```
"I've fixed the TypeScript errors. Should I commit these fixes?"
```

### **Violation 3: Committing "Minor" Changes**

**❌ WRONG:**

```
"I'll commit this small formatting fix."
```

**✅ CORRECT:**

```
"I notice some formatting inconsistencies. Should I fix them and then ask for permission to commit?"
```

---

## 🔧 Troubleshooting Quality Check Failures

### **Prettier Formatting Failed**

```bash
# Fix formatting
pnpm format

# Verify fix
pnpm format:check
```

### **ESLint Failed**

```bash
# Try auto-fix
pnpm lint:fix

# Check remaining issues
pnpm lint

# Fix manually if needed
```

### **TypeScript Type Check Failed**

```bash
# Check specific errors
pnpm type-check

# Fix type errors manually
# Common issues:
# - Missing type definitions
# - Incorrect interface usage
# - Schema mismatches
```

### **Build Failed**

```bash
# Check build errors
pnpm build

# Common issues:
# - Missing dependencies
# - Type errors
# - Import/export issues
# - Next.js configuration problems
```

---

## 📚 Required Reading for AI Agents

**Before starting any work, AI agents MUST read:**

1. `../AI_AGENT_ENTRY.md` - Entry point and overview
2. `./AI_GUIDELINES.md` - Mandatory coding standards
3. `./AI_DEVELOPMENT_WORKFLOW.md` - This workflow document
4. `./IMPLEMENTATION.md` - Current project status
5. `./DEVELOPMENT_SETUP.md` - Development environment

---

## ✅ Compliance Checklist for AI Agents

- [ ] Read and understood all mandatory documents
- [ ] Never commit without explicit user permission
- [ ] Always present changes before requesting commit permission
- [ ] Wait for explicit approval before proceeding
- [ ] Run quality checks before presenting changes
- [ ] Use proper commit message format
- [ ] Follow TypeScript and coding standards
- [ ] Implement Result type pattern for error handling
- [ ] Keep components thin, move logic to services
- [ ] Document all public interfaces and methods

---

## 🚨 Emergency Procedures

### **Critical System Failure (Rare Exception)**

**ONLY** in case of critical system failure that prevents the application from running:

1. **Document the emergency** with detailed explanation
2. **Make minimal necessary changes** to restore functionality
3. **Immediately notify user** of what was done and why
4. **Request permission** to commit emergency fixes
5. **Explain why** emergency action was necessary

**This exception is RARELY applicable and should be avoided.**

---

## 📞 Getting Help

### **Workflow Questions**

- Create issue with "workflow" label
- Ask in team discussions
- Reference this document

### **Quality Check Failures**

- Run individual checks to isolate issues
- Check error messages for specific guidance
- Use troubleshooting section above

### **Permission Clarification**

- If user response is unclear, ask for clarification
- Don't assume permission from context
- Be explicit about what you're asking

---

**⚠️ REMEMBER: This workflow is MANDATORY. Failure to comply will result in code rejection and may affect future collaboration opportunities.**

---

## 📅 Document History

| Version | Date       | Changes          | Author       |
| ------- | ---------- | ---------------- | ------------ |
| 1.0.0   | 2024-12-19 | Initial creation | Project Lead |

---

**Last Updated**: 2024-12-19  
**Next Review**: 2025-01-02  
**Enforcement**: Mandatory for all AI agents
