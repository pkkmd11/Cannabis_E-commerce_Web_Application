# Contributing to Cannabis E-commerce Platform

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Please:

- Be respectful and considerate in all interactions
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Accept responsibility for mistakes and learn from them

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/cannabis-ecommerce.git
   cd cannabis-ecommerce
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/cannabis-ecommerce.git
   ```

## Development Setup

### Prerequisites

- Node.js v18.0.0 or higher
- npm v8.0.0 or higher
- PostgreSQL v14.0 or higher (or Supabase account)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Configure your `.env` file with your database and storage credentials

4. Push the database schema:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Making Changes

### Branch Naming

Create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
# or
git checkout -b docs/your-documentation-update
```

### Commit Messages

Follow these conventions for commit messages:

- Use present tense: "Add feature" not "Added feature"
- Use imperative mood: "Fix bug" not "Fixes bug"
- Keep the first line under 72 characters
- Reference issues when applicable: "Fix login bug (#123)"

Examples:
```
feat: Add product search functionality
fix: Resolve image upload error on mobile
docs: Update installation instructions
style: Format code according to style guide
refactor: Simplify product filtering logic
```

## Submitting Changes

1. **Ensure your code follows the style guidelines**

2. **Test your changes** thoroughly

3. **Update documentation** if needed

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub with:
   - Clear title describing the change
   - Description of what changed and why
   - Screenshots for UI changes
   - Reference to related issues

### Pull Request Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated if needed
- [ ] No new warnings or errors
- [ ] Tests pass (if applicable)

## Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Keep functions small and focused
- Add types for all function parameters and return values

### React Components

- Use functional components with hooks
- Keep components focused on a single responsibility
- Use the existing UI components from `@/components/ui`
- Follow the existing file structure for new components

### CSS/Styling

- Use Tailwind CSS classes
- Follow the existing color scheme and design patterns
- Ensure responsive design for mobile devices
- Use the existing shadcn/ui component library

### File Organization

```
client/src/
  components/     # React components
    ui/           # shadcn/ui primitives
  hooks/          # Custom React hooks
  pages/          # Page components
  lib/            # Utility functions
  types/          # TypeScript types

server/
  routes/         # API route handlers
  storage.ts      # Data access layer
  database.ts     # Database connection
```

## Reporting Issues

When reporting issues, please include:

1. **Clear title** describing the problem
2. **Steps to reproduce** the issue
3. **Expected behavior** vs actual behavior
4. **Screenshots** if applicable
5. **Environment details**:
   - Node.js version
   - Browser (for frontend issues)
   - Operating system

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed

## Questions?

If you have questions about contributing, feel free to:

- Open an issue with the `question` label
- Check existing issues and discussions

Thank you for contributing!
