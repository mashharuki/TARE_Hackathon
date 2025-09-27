# Task Completion Checklist

Use this checklist before considering a task done.

## Code Quality

- Run formatter: `pnpm format`
- Run linter and fix issues: `pnpm lint`
- Optional: Type-check with `pnpm exec tsc --noEmit`

## Build/Runtime

- Build the app: `pnpm build` (ensures Next.js compiles)
- If relevant, run locally: `pnpm dev` and verify affected pages/API routes

## Environment/Config

- If environment variables were added/changed:
  - Update `.env.example`
  - Verify `.env` is not committed
- If dependencies were added/removed:
  - Use `pnpm` to keep `pnpm-lock.yaml` in sync

## Features Affected

- UI changes: check light/dark themes and Tailwind class ordering
- API changes: verify `app/api/*` endpoints with sample requests
- Notifications/Webhooks:
  - Ensure `REDIS_URL` and `REDIS_TOKEN` are set for persistence
  - Validate `/api/webhook` event flow on baseSepolia and `/api/notify` sending

## Docs/Housekeeping

- Update README if commands, setup or behavior changed
- Keep changes minimal and consistent with existing patterns
- Add comments only when necessary to clarify intent
