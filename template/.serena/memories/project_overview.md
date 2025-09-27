# my-minikit-app — Project Overview (Serena Memory)

## Stack & Runtime

- Next.js 15 (App Router) + TypeScript (strict) + Tailwind CSS
- MiniKit / OnchainKit for wallet, transactions, notifications
- Farcaster Frame SDK for frame + notifications
- Wagmi + Viem (chain: `baseSepolia`)
- Optional persistence: Upstash Redis (user notification tokens)
- Node 18+

## Key Directories / Files

- `app/layout.tsx`: global styles + `generateMetadata` injects `fc:frame` header
- `app/providers.tsx`: wraps app with `MiniKitProvider` (chain `baseSepolia`, appearance config)
- `app/page.tsx`: main UI; sets MiniKit `setFrameReady`; renders demo Home
- `app/.well-known/farcaster.json/route.ts`: frame/account metadata (uses `NEXT_PUBLIC_URL`, `FARCASTER_*`)
- `app/api/webhook/route.ts`: Farcaster webhook; verifies FID↔key via Key Registry (viem), saves/deletes tokens, sends welcome notification
- `app/api/notify/route.ts`: server API to send a notification using saved token
- `components/common/*`: UI primitives (`Header`, `Footer`, `Card`, `Button`, `Icon`)
- `components/DemoComponents/Home.tsx`: demo page combining `ShootingGame` + `TransactionCard`
- `components/Game/*`: `ShootingGame` mini-game (canvas)
- `components/TransactionCard.tsx`: OnchainKit `Transaction` UI; on success sends MiniKit notification
- `lib/redis.ts`: Upstash Redis client; logs warning and returns `null` when unset
- `lib/notification.ts`: CRUD for `MiniAppNotificationDetails` in Redis (no-op when Redis unset)
- `lib/notification-client.ts`: Sends Farcaster notifications; returns `success | no_token | rate_limit | error`
- `css/globals.css`, `css/theme.css`: base and theme variables; light/dark; OnchainKit overrides
- `next.config.mjs`: externals to silence warnings (`pino-pretty`, `lokijs`, `encoding`)

## Core Flows

1. Frame metadata: `layout.tsx` adds `fc:frame`; `.well-known/farcaster.json` serves frame & account details
2. Webhook (`POST /api/webhook`): verify FID↔key on `baseSepolia` Key Registry; save/delete notification tokens; send welcome notification
3. Notifications: `POST /api/notify` -> `lib/notification-client` uses saved token to hit Farcaster endpoint
4. Transactions: `TransactionCard` provides sponsored tx UI; on success triggers MiniKit notification

## Environment Variables (high level)

- Shared/OnchainKit: `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME`, `NEXT_PUBLIC_URL`, `NEXT_PUBLIC_ICON_URL`, `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
- Frame/metadata: `FARCASTER_HEADER`, `FARCASTER_PAYLOAD`, `FARCASTER_SIGNATURE`, `NEXT_PUBLIC_APP_*` (icon, hero, og, etc.)
- Redis (optional): `REDIS_URL`, `REDIS_TOKEN` (persistence disabled when missing)
- Regenerate Farcaster account association: `npx create-onchain --manifest`

## Commands

- Dev: `pnpm dev`
- Build/Start: `pnpm build` / `pnpm start`
- Lint/Format: `pnpm lint` / `pnpm format`
- Types: `pnpm exec tsc --noEmit`

## Gotchas

- URL consistency: if `NEXT_PUBLIC_URL` changes, confirm `layout.tsx` and `.well-known` image/URL references
- Redis optional: webhook & notifications work but no persistence (`no_token` possible)
- Server-only secrets: do not expose sensitive values via `NEXT_PUBLIC_*`
- Rate limits: handle `rate_limit` state from notification responses
- Keep externals in `next.config.mjs` to avoid noisy warnings

## Acceptance Checklist

- Format/lint/types/build pass
- UI renders in light/dark; Wallet/Frame actions work
- `.well-known` JSON returns expected metadata
- Webhook/notify happy path with Redis configured; error paths handled
- README & `.env.example` updated when envs change
