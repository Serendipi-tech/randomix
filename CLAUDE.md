# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> These rules are absolute. Follow them in every implementation, refactor, and code review without exception.

## Communication & Behavior Rules

- **Language**: Communicate with users in Italian. All code (variables, comments, committs) in English.
- **Commits**: Conventional commits format — `feat(scope):`, `fix(scope):`, etc.
- **Conciseness**: Explanations always welcome but must be extremely concise. No walls of text.
- **No improvisation**: Follow instructions to the letter. If something is unclear, ask — never guess or assume.
- **Literal execution**: When the user describes a layout or structure, implement it EXACTLY as described. Do not reinterpret, reorganize, or "improve" the layout. If the user says "in line", it means on a single horizontal line — not stacked, not in a grid, not in columns.
- **No unsolicited changes**: Never add features, corrections, or refactors not explicitly requested. Propose first, then act only after approval.
- **Do NOT touch existing components**: Modifying shared/existing components (in `src/components/ui/`, hooks, theme, etc.) is STRICTLY FORBIDDEN without explicit user permission. If a fix seems to require changing an existing component, ask first — never edit it directly.
- **Don't over-confirm**: Once given permission for a task, execute it without re-asking at every step.
- **Propose before acting**: For any non-trivial change, describe the approach first and wait for OK. Simple/obvious changes can proceed directly.
- **Teaching mode**: When debugging, explain the root cause so the user learns — but keep it short.

## Commands

- **Dev server**: `npx expo start` (add `--android`, `--ios`, or `--web` for specific platforms)
  [!!!] - **GraphQL codegen**: `npm run codegen` — regenerates types/hooks in `src/graphql/__generated__/` from Supabase schema. Run after changing `.gql` files.
  [!!!] - **Edge functions deploy**: After modifying any file in `supabase/functions/`, always deploy with `npx supabase functions deploy <function-name>`. Never leave a modified edge function undeployed.

## Architecture

[!!!] - **Stack**: Expo 54 (React Native 0.81) + TypeScript + Expo Router (file-based routing) + Supabase (backend) + Apollo Client (GraphQL)

[!!!] - **Stack is final**: No migration planned. Expo + Expo Router is the long-term architecture. Supabase stays as backend.

### Routing (`app/`)

File-based routing via Expo Router with route groups:

- `(auth)` — Login (Google OAuth)
- `(onboarding)` — Email consent flow
- `(app)` — Main tabbed app (Home, Applications, Analytics, Settings)
- `(admin)` — Admin dashboard (role-gated)

Auth flow in `_layout.tsx`: splash stays visible until fonts + auth resolve, then redirects based on state (no consent → onboarding, admin role → admin, else → app).

### Source (`src/`)

- `graphql/` — `.gql` query/mutation files + `__generated__/` codegen output. All data flows through Apollo + Supabase GraphQL endpoint.
- `hooks/` — Business logic layer: `useAuth` (session + profile + routing), `useApplications` (filtered/paginated queries), `usePipeline`, `useCreateApplication`, `useUpdateApplication`.
- `lib/apollo.ts` — Apollo Client setup with auth header injection. `lib/supabase.ts` — Supabase client with platform-adaptive storage (SecureStore on native, localStorage on web).
  [!!!] - `components/` — Split by domain (`applications/`, `analytics/`, `admin/`) and shared (`ui/`).
- `theme/` — ThemeContext with 2 themes (dark, light), persisted per-platform. Includes typography, spacing, glassmorphism tokens.

### Key Patterns

- **Path alias**: `@/*` maps to `src/*`
  [!!!] - **GraphQL-first**: Never use Supabase REST; always go through Apollo + codegen hooks for type safety.
- **Cursor pagination**: Applications list uses cursor-based pagination with infinite scroll.
  [!!!] - **Responsive layout**: Sidebar on desktop/tablet, bottom tabs on mobile (`useResponsive` + Platform checks).
- **Cache strategy**: Apollo uses `cache-and-network` fetch policy.
  [!!!] - **Sorting**: Always by date descending (`last_event_at > updated_at > created_at`).
  [!!!] - **UI language**: Italian (app targets Italian users). **All user-facing text must go through i18n** (`t('key')` via react-i18next). Never hardcode strings in JSX — even if only the Italian locale exists. Translation files live in `locales/it/`. When English is added, we'll translate the folder directly.
- **Naming**: PascalCase for components/files. camelCase with `use` prefix for hooks. File name matches primary export.
- **Components**: Prefer "dumb" components (no external logic, render data from props). Reuse existing components — if a similar one exists, extend it rather than duplicate. Generic components (tables, cards, charts) should stay generic and reusable.
- **Typography minimum**: No font size below 14px in the app. `fontSize.sm` (14px) is the minimum for readable text. `fontSize.xs` (12px) is reserved for badges/captions only.
- **Dependencies**: Pragmatic approach — use established libraries when they save significant time, don't over-engineer.
- **Error handling**: User-friendly — show visual feedback (toast, inline messages) for errors.
- **Testing**: Write complete tests (unit + integration) for new features.
  [!!!] - **Database**: Supabase PostgreSQL, schema managed via `db push` (no migration files). User comfortable with SQL, RLS, triggers — but may need guidance on advanced patterns.

### Other specifics

## 1. Architecture Principles

The frontend is:

- **Modular** — each unit has a single, clear responsibility
- **Typed** — strict TypeScript throughout, no `any`
- **Scalable** — new features must not require restructuring existing code without it being retrocompatible
- **Reusability-oriented** — build to reuse, not to duplicate
- **UI/logic separated** — visual components never contain business logic

---

## 2. Project Structure

See [`docs\architecture.md`]

---

## 3. React Component Rules

A UI component:

- **Must** be reusable
- **Must** receive data only via typed props or typed objects
- **May** contain UI variants for the same component (e.g. `danger`, `primary`, `ghost`)
- **Must NOT** contain business logic
- **Must NOT** call GraphQL (no queries, no mutations)
- **Must NOT** perform fetches or complex data transformations
- **Must NOT** be nested matryoshka-style (e.g. `Card > TitleCard > TitleContent`)

---

## 4. Hook and Logic Rules

**All logic lives in the utils folder, indipendent and different between web and mobile**, including:

- Custom hooks
- Helpers
- Data transformation functions
- Complex state management

A UI component must only call the hook — never implement what the hook does.

```typescript
// utils/useCreateFood.ts
export function useCreateFood() {
  const [mutate, state] = useMutation(CREATE_FOOD);

  const createFood = async (input: CreateFoodInput) => {
    return mutate({ variables: input });
  };

  return { createFood, ...state };
}
// The UI component only calls createFood() — nothing more.
```

---

## 5. GraphQL Rules

    [!!!] - All GraphQL operations live **only** in `gql_crud/`

- Split by model (one folder per model)
- Queries and mutations in separate files
- **Never** write `gql` inline inside components

---

## 6. Code Size Limits

| Element   | Limit          |
| --------- | -------------- |
| Function  | ~40–80 lines   |
| Hook      | ~150 lines     |
| Component | ~200–300 lines |

- keep in mind a tollerance percentage of 50% before splitting the code
  > ex. cardComponent have 350 lines, it doesn't need to be splitted.

**If a limit is exceeded → split the code.**

---

[!!!]

## 7. Styling Rules

- Colors and design variables come **only** from `index.css`
- No inline colors that are not defined in `index.css`
- **Tailwind utility-first**
- Avoid excessively long class strings — extract reusable components instead
- Prefer `@apply` classes defined in `index.css` for repeated patterns

---

## 8. Code Comments

Comments must:

- Be written **in Italian**
- Explain **what** and **why**, only when the logic is non-obvious
- Be concise

```typescript
// Prisma richiede numeri per i campi Decimal   ✔
// assegno il valore                            ✗
```

---

## 9. Mandatory Best Practices

Always:

- Use **strict TypeScript** — no `any`, no implicit types
- Use **descriptive names** for variables, functions, and types
- Avoid **logic duplication**
- Prefer **pure functions**
- Use **early return** to reduce nesting
- Keep **UI and logic separated**

---

## 10. Forbidden

| Forbidden pattern                           |
| ------------------------------------------- |
| Business logic inside UI components         |
| GraphQL mutations called from components    |
| Giant functions (over limit)                |
| Monolithic components (over limit)          |
| Implicit types / `any`                      |
| Hardcoded styles not defined in `index.css` |
| Matryoshka-nested components                |
| Duplicated logic across files               |

---

## 11. Response Protocol (Claude's Workflow)

When receiving a task, Claude must follow this sequence:

1. **Read** any relevant existing files before suggesting or writing code
2. **Identify** the correct location for each piece of code (see §2)
3. **Check** that no rule from §3–10 is violated before writing
4. **Write** the minimal, focused change — no unrequested additions
5. **Split** anything that exceeds the size limits from §6
6. **Never** add comments that state the obvious; only add them in Italian when logic is non-trivial

Do not:

- Refactor code that was not part of the task
- Add features not explicitly requested
- Add error handling for any impossible scenarios
- Create abstractions for one-off operations
