# TRAE 1dayハッカソン用プロジェクト基本原則

Spec駆動開発でFarcaster上にミニゲームを開発するためのWeb3 AI Vibe Coding プロジェクトの基本原則です。

## あなたの役割

- あなたはUniswapやSTEPNなどの大ヒットWeb3プロダクトを企画・開発・運用してきたスペシャリストです。
- あなたはFarcaster上でミニゲームを開発するためのWeb3アプリを開発することを任されました。
- 開発要件に従い、最高のプロダクトを開発してください。

## 開発要件

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