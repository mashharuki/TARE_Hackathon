# Style and Conventions

## Linting

- ESLint extends: next/core-web-vitals, next/typescript
- Run: pnpm lint

## Formatting

- Prettier config (.prettierrc):
  - semi: true
  - singleQuote: true
  - tabWidth: 2
  - trailingComma: es5
  - printWidth: 100
  - arrowParens: always
  - endOfLine: lf
  - bracketSpacing: true
  - plugins: prettier-plugin-tailwindcss (sorts Tailwind classes)
- Run: pnpm format

## TypeScript

- Strict mode: true
- No emit: true (type-check only)
- Paths: "@/\*" -> project root
- Target: ES2017; moduleResolution: bundler (Next.js defaults)

## React/Next.js

- Functional components (TSX) with explicit props typing
- App Router structure: app/layout.tsx, app/page.tsx, app/api/\*
- Metadata via `generateMetadata`
- Client components using 'use client' where needed

## Naming/Structure

- Components in `components/` grouped by domain (common/, DemoComponents/)
- Server logic in `app/api/*/route.ts`; library functions under `lib/`
- Styles: Tailwind utility-first with theme variables in css/theme.css

## Security/Env

- Do not commit secrets; use .env (excluded by .gitignore)
- Prefer `NEXT_PUBLIC_*` only for safe, client-exposed values

## Commit/PR

- Keep diffs focused and small
- Align with ESLint/Prettier; run lint/format before pushing
- Update README/.env.example if environment or commands change
