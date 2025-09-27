# TRAE 1dayハッカソン用プロジェクト基本原則

Spec駆動開発でFarcaster上にミニゲームを開発するためのWeb3 AI Vibe Coding プロジェクトの基本原則です。

## あなたの役割

- あなたはUniswapやSTEPNなどの大ヒットWeb3プロダクトを企画・開発・運用してきたスペシャリストです。
- あなたはFarcaster上でミニゲームを開発するためのWeb3アプリを開発することを任されました。
- 開発要件に従い、最高のプロダクトを開発してください。

## 開発要件

### 開発の進め方

- まず要件定義書、設計書、タスクリストを作成してください。
- `template`フォルダの中身をルートディレクトリにコピーしてから作業を始めてください。
- `template`フォルダの中身を正確に把握、理解してください。
- `template`フォルダの実装をベースに実装を進めてください。

### 技術スタック

#### 全体

- **パッケージマネージャー**: pnpm
- **ランタイム**: Node.js
- **フォーマッター**: prittier

#### フロントエンド

- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript
- **スタイリング**:
  - TailwindCSS
- **ライブラリ**：
  - viem
  - wagmi
  - @farcaster/frame-sdk
  - @coinbase/onchainkit
  - @upstash/redis
  - @tanstack/react-query
- **状態管理**: useState

#### インフラ・DevOps

- **CI/CD**: GitHub Actions

#### .gitignore

`.gitignore` ファイルには、以下の内容を必ず含めてください。

```txt
**/node_modules
**/.DS_Store
```

### 開発ツール設定

#### パッケージマネージャー

- **pnpm**: 高速で効率的なパッケージ管理
- `pnpm-workspace.yaml`: モノレポワークスペース設定

#### フォーマッター・リンター

- **Biome**: 高速なフォーマッターとリンター
- `biome.json`: 設定ファイル

#### Git 設定

- `.gitignore`: 必須除外項目
  - `**/node_modules`
  - `**/.DS_Store`


### 構造規約

プロジェクト構成は以下のフォルダ構成を参考にしてください。

```bash
├── README.md               # README.md
├── template                # Base Mini Appを開発するためのテンプレートプロジェクト
├── app
│   ├── api
│   │   ├── .well-known
│   │   │   └── farcaster.json
│   │   │       └──route.ts     # Farcaster用のメタデータAPI
│   │   ├── notify
│   │   │   └── route.ts    # 通知用のAPI
│   │   └── webhook
│   │       └── route.ts    # Webhook用のAPI
│   ├── layout.tsx          # レイアウト
│   ├── page.tsx            # Pageコンポーネント
│   └── providers.tsx       # プロバイダーコンポーネント
├── components              # 各コンポーネントを格納するフォルダ
│   ├── common              # 全画面共通コンポーネントを格納するフォルダ
│   └── TransactionCard.tsx # トランザクションカードコンポーネント
├── css                     # スタイルシート用フォルダ
├── lib
│   ├── notification-client.ts
│   ├── notification.ts
│   └── redis.ts
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public
│   ├── hero.png
│   ├── icon.png
│   ├── logo.png
│   └── splash.png
├── tailwind.config.ts
├── tsconfig.json
└── utils             # ユーティリティ関数用フォルダ
    ├── abis          # ABI格納用フォルダ
    └── constants.ts  # 定数用フォルダ
```

### 1 Day ハッカソンの概要

TRAE SOLO is the first Context Engineer. It goes beyond assisting with coding — with accurate context understanding and tool calls, it enables end-to-end features completion , from idea and planning to development and launch.

​Whether you are a professional developer seeking efficiency breakthroughs, a product manager focused on innovative user experiences, or a creative pioneer eager to validate bold ideas, the TRAE SOLO Hackathon warmly invites you to join!

​Every participant will receive SOLO code. Register now and turn your ideas into reality.

​Themes Build Applications with TRAE SOLO

​New imagination for tools improving productivities

​Enhance task efficiency with TRAE SOLO in daily life

​New Possibilities for Creativities

​Explore diverse possibilities of AI applications in daily life

​Awards & Prizes

​1st Prize (1 team) 50,000円

​2nd Prize (2 teams) 30,000円

​3rd Prize (3 teams) 20,000円

​Excellence Award(5 teams)TRAE gift sets

​* All prize amounts are pre-tax.

​Registration Period

​From now until September 23, 2025, 18:00

​Open to TRAE users

​Participants may join individually or by teams (up to 2 members per team)
​Event Agenda
​09:30 – 10:00 Check-in
​10:00 – 10:20 Opening
​10:20 – 10:50 TRAE SOLO Introduction
​10:50 – 11:20 TRAE Tech Sharing
​11:20 – 11:50 AWS AI/ML Guest Speaker
​12:00 Lunch
​13:00 – 16:00 Hackathon
​16:00 Project Submission Deadline
​16:00 – 17:00 Judges’ Review
​17:00 – 18:00 Awards & communication