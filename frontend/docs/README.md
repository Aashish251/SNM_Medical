# SNM Medical — Development Documentation

Official development guidelines for the SNM Medical frontend application. **Read these documents before implementing any feature, bug fix, or refactor.**

## Purpose

This documentation establishes consistent architecture, coding standards, and enterprise-grade development practices for a codebase expected to scale to **100,000+ users**, multiple developer teams, and long-term maintenance.

## Quick Start for New Contributors

1. Read [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md) — understand the system layout
2. Read [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) — know where to put new code
3. Read [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) — daily workflow rules
4. Read [FUTURE_DEVELOPMENT_RULES.md](./FUTURE_DEVELOPMENT_RULES.md) — mandatory rules checklist

## Documentation Index

| Document | Description |
|----------|-------------|
| [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md) | System architecture, layers, and dependency flow |
| [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) | General development workflow and standards |
| [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) | Where every type of file belongs |
| [ROUTING_GUIDELINES.md](./ROUTING_GUIDELINES.md) | Centralized routing, guards, and navigation |
| [COMPONENT_GUIDELINES.md](./COMPONENT_GUIDELINES.md) | Component design, composition, and sizing |
| [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) | Redux, RTK Query, and local state rules |
| [API_GUIDELINES.md](./API_GUIDELINES.md) | RTK Query, service layer, and error handling |
| [FORM_GUIDELINES.md](./FORM_GUIDELINES.md) | React Hook Form, validation, and shared fields |
| [UI_UX_GUIDELINES.md](./UI_UX_GUIDELINES.md) | Layouts, tables, dialogs, loading states |
| [THEME_GUIDELINES.md](./THEME_GUIDELINES.md) | Colors, typography, tokens, dark mode |
| [REUSABILITY_GUIDELINES.md](./REUSABILITY_GUIDELINES.md) | DRY principles and component reuse |
| [PERFORMANCE_GUIDELINES.md](./PERFORMANCE_GUIDELINES.md) | Lazy loading, memoization, bundle size |
| [SECURITY_GUIDELINES.md](./SECURITY_GUIDELINES.md) | Auth, RBAC, input validation, tokens |
| [ERROR_HANDLING_GUIDELINES.md](./ERROR_HANDLING_GUIDELINES.md) | Boundaries, API errors, logging |
| [ACCESSIBILITY_GUIDELINES.md](./ACCESSIBILITY_GUIDELINES.md) | A11y standards and Radix UI usage |
| [TYPESCRIPT_GUIDELINES.md](./TYPESCRIPT_GUIDELINES.md) | Typing rules and type organization |
| [SOLID_PRINCIPLES.md](./SOLID_PRINCIPLES.md) | SOLID applied to this codebase |
| [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md) | Files, folders, variables, routes |
| [TESTING_GUIDELINES.md](./TESTING_GUIDELINES.md) | Vitest, coverage expectations |
| [CODE_REVIEW_CHECKLIST.md](./CODE_REVIEW_CHECKLIST.md) | PR review checklist |
| [FUTURE_DEVELOPMENT_RULES.md](./FUTURE_DEVELOPMENT_RULES.md) | Master mandatory rules document |

## Related Documents

- [ARCHITECTURE_BASELINE.md](./ARCHITECTURE_BASELINE.md) — Phase 0 snapshot (historical reference)

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Build | Vite 7, TypeScript 5.9 |
| UI | React 19, Tailwind CSS 4, Radix UI (shadcn) |
| State | Redux Toolkit, RTK Query, redux-persist |
| Routing | React Router 7, centralized `@app/router` |
| Forms | React Hook Form 7 |
| Testing | Vitest 4, Testing Library |

## Application Experiences

The app serves three distinct UX shells:

| Experience | Base Path | Layout | Code Location |
|------------|-----------|--------|---------------|
| Public site | `/`, `/login`, etc. | Header + Footer | `features/`, `pages/public/` |
| Medical Staff Admin | `/ms-admin/*` | Header + Footer | `features/admin/medical-staff/` |
| Administrator Portal | `/admin/*` | Sidebar shell | `features/admin/admin/` |

Legacy redirects: `/ms/*` → `/ms-admin/*`, `/admin/*` → `/admin/*`.

## Getting Help

When in doubt:

1. Search the codebase for an existing pattern before inventing a new one
2. Follow the closest existing feature as a template
3. Reference the relevant doc from this index
4. Ask in code review if your approach deviates from these guidelines
