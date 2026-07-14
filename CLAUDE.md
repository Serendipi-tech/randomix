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

- **Web dev server**: `cd web && npm run dev` (Next.js)
- **Mobile dev server**: `cd mobile && npx expo start` (add `--android`, `--ios`, or `--web`)
- **GraphQL codegen**: `npm run codegen` in `packages/graphql-schema` — regenerates the schema + typed operations shared by both apps from the Next.js GraphQL endpoint. Run after changing any `.gql` file in `gql_crud/`. Both `web` and `mobile` import the generated output as a workspace dependency (build-time only — never a runtime call between the two apps).
- **Edge functions deploy**: After modifying any file in `web/supabase/functions/`, always deploy with `npx supabase functions deploy <function-name>`. Never leave a modified edge function undeployed.

## Architecture

- **Monorepo, two independently hosted apps**:
  - `web/` — Next.js. Backend (API routes / GraphQL resolvers) + admin dashboard. Deployed standalone (e.g. Vercel).
  - `mobile/` — Expo 57 (React Native 0.86) + TypeScript + Expo Router. Consumer app, published to Play Store/App Store.
  - `packages/graphql-schema` — shared GraphQL schema + generated typed operations, consumed by both apps at build time only.
  - No shared i18n: each app keeps its own `locales/it/`, since user-facing copy differs by nature between admin and consumer app.

- **Stack is final**: No further migration planned. Next.js (web) + Expo/Expo Router (mobile) is the long-term architecture. Supabase stays as the single database (Postgres).

- **Data flow**: Next.js is the only service that talks to Supabase. Both web (admin) and mobile (consumer) consume the **same GraphQL API exposed by Next.js** via Apollo Client — including subscriptions for realtime (e.g. live group draw). Mobile never calls Supabase directly, not even for auth — everything goes through the Next.js GraphQL layer.
- **Backend logic split**: some logic stays in Supabase Edge Functions (DB triggers, cron jobs); everything else (resolvers, business rules reachable from clients) lives in Next.js API routes / GraphQL resolvers.

### Routing (`mobile/app/`)

File-based routing via Expo Router with route groups:

- `(auth)` — Login (Google OAuth)
- `(app)` — Main tabbed app (Home, Applications, Analytics, Settings)

Admin dashboard lives only in `web/` now — no `(admin)` route group on mobile.

Auth flow in `_layout.tsx`: splash stays visible until fonts + auth resolve, then redirects based on state (no consent → onboarding, else → app).

### Source (`mobile/src/`, mirrored conceptually in `web/src/`)

- `gql_crud/` (in `packages/graphql-schema`) — `.gql` query/mutation files shared between web and mobile where the underlying data is the same, split by model. Each app's own `__generated__` hooks import from there.
- `hooks/` — Business logic layer: `useAuth` (session + profile + routing), `useApplications` (filtered/paginated queries), `usePipeline`, `useCreateApplication`, `useUpdateApplication`.
- `lib/apollo.ts` — Apollo Client setup with auth header injection, pointed at the Next.js GraphQL endpoint.
- `components/` — Split by domain (`applications/`, `analytics/`) and shared (`ui/`). Admin-domain components live only in `web/`.
- `theme/` — Tailwind/NativeWind tokens (colors, typography, spacing, glassmorphism), shared design language between web and mobile via a common Tailwind config.

### Key Patterns

- **Path alias**: `@/*` maps to `src/*` in each app.
- **GraphQL-first, shared endpoint**: Never call Supabase REST or SDK directly from either app; always go through Apollo + codegen hooks against the Next.js GraphQL API, for type safety on both web and mobile.
- **Cursor pagination**: Applications list uses cursor-based pagination with infinite scroll.
- **Responsive layout — split by project, not by breakpoint**: `web/` always renders the sidebar layout (desktop-first admin), `mobile/` always renders bottom tabs. No shared cross-platform `useResponsive` layout switch — each app owns one fixed layout shape.
- **Cache strategy**: Apollo uses `cache-and-network` fetch policy.
- **Sorting**: Always by date descending (`last_event_at > updated_at > created_at`).
- **UI language**: Italian (app targets Italian users). **All user-facing text must go through i18n** (`t('key')` via react-i18next). Never hardcode strings in JSX — even if only the Italian locale exists. Translation files live in each app's own `locales/it/` (not shared). When English is added, we'll translate the folder directly.
- **Naming**: PascalCase for components/files. camelCase with `use` prefix for hooks. File name matches primary export.
- **Components**: Prefer "dumb" components (no external logic, render data from props). Reuse existing components — if a similar one exists, extend it rather than duplicate. Generic components (tables, cards, charts) should stay generic and reusable.
- **Typography minimum**: No font size below 14px in the app. `fontSize.sm` (14px) is the minimum for readable text. `fontSize.xs` (12px) is reserved for badges/captions only.
- **Dependencies**: Pragmatic approach — use established libraries when they save significant time, don't over-engineer.
- **Error handling**: User-friendly — show visual feedback (toast, inline messages) for errors.
- **Testing**: Write complete tests (unit + integration) for new features.
- **Database**: Supabase PostgreSQL as the instance, Prisma as the ORM/schema layer (`web/prisma/schema/`). Schema changes go through `prisma db push` — no Prisma migration files, and never `supabase db push`. Reachable only from `web/` (Next.js). Connection pooling via **Prisma Accelerate** (Postgres-standard, not Supabase-specific — keeps the DB layer portable). RLS/triggers as needed. User comfortable with SQL, RLS, triggers — but may need guidance on advanced patterns.

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

Two distinct layers — do not confuse them:

- **Schema/resolver definition** (backend, code-first): `web/graphql/` (`builder.ts`, `schema.ts`, `models/.../model.queries.ts`, `model.mutations.ts`). Defines what the API can do. Lives only in `web/`.
- **Client operation layer** (frontend consumption): `packages/graphql-schema/gql_crud/`, shared by `web/` and `mobile/` (workspace dependency, build-time only — no runtime coupling between the two deployed apps). Each file just references an operation name defined in `web/graphql/` plus the variables to pass — this is what gets fed to codegen to produce typed hooks for the frontend.

Rules:

- Split by model (one folder per model), in both layers
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

## 7. Styling Rules

Applies to **both** `web/` (Tailwind) and `mobile/` (NativeWind) — same design tokens, shared via a common Tailwind config so the two apps stay visually consistent.

- Colors and design variables come **only** from the shared Tailwind config / `index.css` (web) — no ad-hoc hex values in either app
- No inline colors that are not defined there
- **Tailwind utility-first** on web, **NativeWind** (Tailwind classes) on mobile
- Avoid excessively long class strings — extract reusable components instead
- Prefer `@apply` classes (web) / shared style presets (mobile) for repeated patterns

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
