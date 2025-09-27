# AGENTS

このドキュメントは、本プロジェクト（my-minikit-app）に対して作業を行うエージェント/開発者向けの実務ガイドです。変更方針、実行コマンド、設計パターン、注意点、受け入れ基準をまとめています。

## プロジェクト概要（要約）

- Next.js(App Router) + TypeScript + Tailwind のミニアプリ。
- MiniKit/OnchainKit を用いたウォレット連携・トランザクション UI。
- Farcaster Frame と通知（@farcaster/frame-sdk）。
- 通知トークンは Upstash Redis に保存（任意、未設定なら機能限定）。

主要ディレクトリ/ファイル

- `app/layout.tsx` : フレーム用メタデータ注入、グローバルスタイル適用
- `app/providers.tsx` : `MiniKitProvider`（`baseSepolia`）
- `app/page.tsx` : メイン UI（`useMiniKit`）
- `app/api/webhook/route.ts` : Farcaster webhook（FID↔Key 検証、通知トークン保存）
- `app/api/notify/route.ts` : 通知送信 API（保存済みトークンで通知送信）
- `app/.well-known/farcaster.json/route.ts` : フレーム/アカウント関連メタデータ
- `components/` : UI コンポーネント（`common/` とデモ）
- `lib/` : `redis.ts`, `notification.ts`, `notification-client.ts`
- `css/` : `globals.css`, `theme.css`（テーマ変数・ダーク/ライト対応）

## 環境変数と秘密情報

- `.env.example` を `.env` にコピーして値を設定。
- 主なキー:
  - 共有/OnchainKit: `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME`, `NEXT_PUBLIC_URL`, `NEXT_PUBLIC_ICON_URL`, `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
  - フレーム: `FARCASTER_HEADER`, `FARCASTER_PAYLOAD`, `FARCASTER_SIGNATURE`, `NEXT_PUBLIC_APP_*`
  - Redis: `REDIS_URL`, `REDIS_TOKEN`（任意。未設定時は警告の上、永続化なしで動作）
- Farcaster アカウント関連の再生成: `npx create-onchain --manifest`
- 機密は絶対に `NEXT_PUBLIC_*` へ入れない（クライアントに露出）。サーバールートやサーバー側で参照。

## 推奨コマンド

- 依存解決: `pnpm install`（`npm|yarn|bun` も可）
- 開発サーバ: `pnpm dev`
- ビルド/起動: `pnpm build` / `pnpm start`
- Lint/整形: `pnpm lint` / `pnpm format`
- 型チェック（任意）: `pnpm exec tsc --noEmit`
- Node は 18+ を想定（Next.js 15）

## 変更方針（最小差分・安全第一）

- 目的に直結する最小限の変更のみを行う。無関係な修正や大規模リファクタは避ける。
- 既存のパターン/命名/スタイルに合わせる（コンポーネント配置、関数分割、ファイル名）。
- 依存追加は慎重に（本当に必要か、代替がないか検討）。
- 環境変数を追加・変更したら `.env.example` と README の該当箇所を更新。
- 資格情報や鍵はコミットしない。`NEXT_PUBLIC_*` は公開前提の値のみ。

## コードスタイル/ツール

- ESLint: `next/core-web-vitals`, `next/typescript`。`pnpm lint` で検証。
- Prettier: `.prettierrc` に従う。Tailwind 並び替えプラグイン有効。`pnpm format`。
- TypeScript: `strict: true`。パスエイリアス `@/*` はプロジェクトルート。

## Next.js/アプリ設計の約束

- App Router 前提（`app/`）。新規 API は `app/api/<name>/route.ts`。
- クライアント側で Node 専用 API を使わない。秘密値はサーバーで扱う。
- メタデータは `generateMetadata` から設定（`app/layout.tsx`）。
- クライアントコンポーネントは必要時のみ `"use client"` を付与。

## MiniKit / OnchainKit

- `app/providers.tsx` の `MiniKitProvider` を起点に、`useMiniKit` やトランザクション UI を利用。
- 既定チェーンは `baseSepolia`。変更時は UI/通知/API の影響範囲を確認。
- 取引 UI 例: `components/TransactionCard.tsx`（`Transaction*` コンポーネント群）。

## Farcaster/通知フロー

1. フレームメタデータ: `app/.well-known/farcaster.json/route.ts`
2. Webhook: `app/api/webhook/route.ts`
   - Key Registry で `fid` と `key` の所有を検証（`baseSepolia`）。
   - 通知トークン (`MiniAppNotificationDetails`) を Redis に保存/削除。
   - 追加/通知有効化時には歓迎通知を送信。
3. 通知送信: `app/api/notify/route.ts` → `lib/notification-client.ts`
   - 保存済みトークンで通知 API を叩く。`no_token`/`rate_limit`/`error` を考慮。

Redis 未設定時の制約

- `lib/redis.ts` は未設定を許容する設計（警告ログ + 機能限定）。
- Webhook によるトークン保存・通知の永続化は無効化される点に留意。

## よくある作業パターン（プレイブック）

- UI の追加:
  - `components/common/` に再利用可能な部品を作成。
  - Tailwind はユーティリティ中心。テーマ変数は `css/theme.css` を更新。
- API ルート追加:
  - `app/api/<name>/route.ts` に `GET/POST` を実装。`NextResponse`/`Response` を返す。
  - バリデーション/エラーハンドリングを明示し、クライアントに安全な情報のみ返却。
- 通知の拡張:
  - 送信は `lib/notification-client.ts` を経由。必要に応じてレスポンスを呼び出し元で分岐。
  - Webhook に新イベント対応する場合は Redis 保存/削除の整合を維持。
- スタイル/テーマ調整:
  - `css/theme.css` の CSS 変数を更新。関連クラスの Tailwind 並びは Prettier に任せる。
- 環境変数の追加:
  - `.env.example` と README を必ず更新。クライアント露出の可否を吟味。

## 注意点（Gotchas）

- フレーム用 URL 一貫性: `NEXT_PUBLIC_URL` を変更したら `layout.tsx`/`.well-known` も整合を確認。
- エッジ/Node ランタイム: Node 依存（`Buffer` 等）はクライアントで使わない。API は Node ランタイム前提で実装。
- 通知レート制限: `rate_limit` 状態の扱いに注意。リトライ/UX を設計。
- 依存の警告抑制: `next.config.mjs` で `pino-pretty` 等を externals に設定済み。不要に戻さない。

## 受け入れチェックリスト

- フォーマット: `pnpm format`
- Lint: `pnpm lint`
- 型: （必要に応じ）`pnpm exec tsc --noEmit`
- ビルド: `pnpm build`
- 影響範囲の動作確認:
  - ページ/コンポーネント表示（ライト/ダークテーマ）
  - 追加した API ルートのハッピーパス/エラーパス
  - 通知/Webhook（Redis 設定時）
- ドキュメント反映: README と `.env.example` の更新

## コミット/PR 運用（推奨）

- 小さく焦点を絞った PR。目的・背景・動作確認手順を記載。
- 変更が環境/コマンドに及ぶ場合は README を更新。
- スクリーンショットやログが有用なら添付。

## トラブルシュート

- 依存/ビルドで失敗: Node バージョン、pnpm キャッシュ、`pnpm install` を再確認。
- 通知が届かない: Redis 設定、Webhook 検証（Key Registry）、`NEXT_PUBLIC_URL` の正当性、`notify` のレスポンス状態を確認。
- スタイル崩れ: Tailwind クラスの順序は Prettier が整える。テーマ変数の綴り/適用先を再確認。

以上に従って、変更は最小・安全・可読・一貫性重視で進めてください。
