# AGENTS.md

Next.js 16 (App Router) frontend for "Wanderlust" — a travel/listing app. Early stage: mostly scaffolded shadcn components and a near-empty home page.

## Commands (verified)

- `npm run dev` — dev server at http://localhost:3000 (Turbopack)
- `npm run build` — production build; also runs the TypeScript check, so type errors fail the build
- `npm run lint` — bare `eslint` with flat config (`eslint.config.mjs`). Currently exits 0 with 1 warning: unused `Image` import in `src/app/page.tsx`
- `npx tsc --noEmit` — standalone typecheck (there is no `typecheck` script)

There is **no test runner** — don't hunt for one or invent a test command.

## Gotchas

- **Fresh-clone typecheck failure**: `src/app/layout.tsx` uses `LayoutProps<"/">`, a type Next.js generates into `.next/types` / `.next/dev/types`. Until you run `npm run dev` or `npm run build` once, `npx tsc --noEmit` errors on it. Run dev/build first.
- **`cn` is the npm package `cn`**, not the usual local clsx+tailwind-merge helper. `src/lib/utils.ts` merely re-exports it; components import `{ cn } from "cn"` directly. Keep it that way.
- **shadcn "base-nova" style on Base UI (`@base-ui/react`), not Radix.** Files under `src/components/ui/` are generated — do not hand-rewrite them onto Radix. Add components with `npx shadcn@latest add <name>` (config: `components.json`).
- **Tailwind v4, CSS-first**: theme lives in `src/app/globals.css` (`@theme inline` + CSS variables); there is no `tailwind.config.*`. CSS is compiled via the `@tailwindcss/turbopack` loader rule in `next.config.ts` — don't switch the build to Webpack.
- `next.config.ts` enables `cacheComponents: true` and `partialPrefetching: true`. With Cache Components, dynamic data access must be wrapped in Suspense or use `"use cache"`.

## Layout & conventions

- Source is under `src/`: `src/app/` (routes), `src/components/ui/` (shadcn), `src/lib/` (helpers). Path alias `@/*` → `./src/*`.
- Root page components export props typed via generated `LayoutProps`/`PageProps` globals (Next 16 convention) — follow `src/app/layout.tsx`.
- npm is the package manager (`package-lock.json` exists); ignore the yarn/pnpm/bun alternatives in the boilerplate README.
- `.env*` files are gitignored and none are committed; no env vars are read yet.
- TypeScript is `strict` with `noEmit`; ESLint uses `eslint-config-next` core-web-vitals + TS rules.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
