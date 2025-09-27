# Suggested Commands

## Install

- pnpm install
  - Alternatives per README: npm install | yarn install | bun install

## Development

- pnpm dev
  - Starts Next.js dev server with App Router

## Build & Run

- pnpm build
- pnpm start

## Lint & Format

- pnpm lint
- pnpm format
- Optional type-check: pnpm exec tsc --noEmit

## Farcaster Setup

- Regenerate account association/manifests:
  - npx create-onchain --manifest

## Environment

- Copy example and fill values:
  - cp .env.example .env
  - Edit .env to set NEXT*PUBLIC*\_, FARCASTER\_\_, REDIS\_\* as needed

## System (Darwin/macOS) Notes

- Use coreutils/grep/rg as preferred; recommended for search:
  - rg <pattern>
- Node/npm via asdf/nvm if needed; ensure Node 18+ for Next.js 15
