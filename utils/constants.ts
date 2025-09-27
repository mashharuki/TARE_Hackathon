// Base Sepolia テストネット用のコントラクトアドレス
// 実際のデプロイ後にこれらのアドレスを更新してください

// PokerGameコントラクトアドレス（デプロイ後に更新）
export const POKER_GAME_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

// GameTokenコントラクトアドレス（デプロイ後に更新）
export const GAME_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

// Base Sepolia チェーンID
export const BASE_SEPOLIA_CHAIN_ID = 84532;

// ゲーム設定
export const GAME_CONFIG = {
  // 最小ベット額（wei単位）
  MIN_BET_AMOUNT: BigInt('1000000000000000'), // 0.001 ETH
  // 最大ベット額（wei単位）
  MAX_BET_AMOUNT: BigInt('100000000000000000'), // 0.1 ETH
  // デフォルトベット額（wei単位）
  DEFAULT_BET_AMOUNT: BigInt('10000000000000000'), // 0.01 ETH
} as const;

// ポーカーハンドの種類
export const POKER_HANDS = {
  HIGH_CARD: 0,
  ONE_PAIR: 1,
  TWO_PAIR: 2,
  THREE_OF_A_KIND: 3,
  STRAIGHT: 4,
  FLUSH: 5,
  FULL_HOUSE: 6,
  FOUR_OF_A_KIND: 7,
  STRAIGHT_FLUSH: 8,
  ROYAL_FLUSH: 9,
} as const;

// ポーカーハンドの名前（日本語）
export const POKER_HAND_NAMES = {
  [POKER_HANDS.HIGH_CARD]: 'ハイカード',
  [POKER_HANDS.ONE_PAIR]: 'ワンペア',
  [POKER_HANDS.TWO_PAIR]: 'ツーペア',
  [POKER_HANDS.THREE_OF_A_KIND]: 'スリーカード',
  [POKER_HANDS.STRAIGHT]: 'ストレート',
  [POKER_HANDS.FLUSH]: 'フラッシュ',
  [POKER_HANDS.FULL_HOUSE]: 'フルハウス',
  [POKER_HANDS.FOUR_OF_A_KIND]: 'フォーカード',
  [POKER_HANDS.STRAIGHT_FLUSH]: 'ストレートフラッシュ',
  [POKER_HANDS.ROYAL_FLUSH]: 'ロイヤルフラッシュ',
} as const;

// ポーカーハンドの配当倍率
export const POKER_HAND_PAYOUTS = {
  [POKER_HANDS.HIGH_CARD]: 0,
  [POKER_HANDS.ONE_PAIR]: 1,
  [POKER_HANDS.TWO_PAIR]: 2,
  [POKER_HANDS.THREE_OF_A_KIND]: 3,
  [POKER_HANDS.STRAIGHT]: 4,
  [POKER_HANDS.FLUSH]: 6,
  [POKER_HANDS.FULL_HOUSE]: 9,
  [POKER_HANDS.FOUR_OF_A_KIND]: 25,
  [POKER_HANDS.STRAIGHT_FLUSH]: 50,
  [POKER_HANDS.ROYAL_FLUSH]: 250,
} as const;

// カードのスート
export const CARD_SUITS = {
  HEARTS: 0,
  DIAMONDS: 1,
  CLUBS: 2,
  SPADES: 3,
} as const;

// カードのスート名（日本語）
export const CARD_SUIT_NAMES = {
  [CARD_SUITS.HEARTS]: 'ハート',
  [CARD_SUITS.DIAMONDS]: 'ダイヤ',
  [CARD_SUITS.CLUBS]: 'クラブ',
  [CARD_SUITS.SPADES]: 'スペード',
} as const;

// カードのスート記号
export const CARD_SUIT_SYMBOLS = {
  [CARD_SUITS.HEARTS]: '♥',
  [CARD_SUITS.DIAMONDS]: '♦',
  [CARD_SUITS.CLUBS]: '♣',
  [CARD_SUITS.SPADES]: '♠',
} as const;

// カードのランク名
export const CARD_RANK_NAMES = {
  1: 'A',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K',
} as const;