import {
  POKER_HANDS,
  POKER_HAND_PAYOUTS,
  CARD_SUITS,
  CARD_RANK_NAMES,
  CARD_SUIT_SYMBOLS,
} from './constants';

// カードの型定義
export interface Card {
  suit: number; // 0-3 (ハート、ダイヤ、クラブ、スペード)
  rank: number; // 1-13 (A, 2-10, J, Q, K)
}

// ポーカーハンドの結果
export interface PokerHandResult {
  handType: number;
  handName: string;
  payout: number;
  cards: Card[];
}

/**
 * 新しいデッキを作成する
 * 
 * @returns 52枚のカードからなるデッキ
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  
  for (let suit = 0; suit < 4; suit++) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({ suit, rank });
    }
  }
  
  return deck;
}

/**
 * デッキをシャッフルする
 * 
 * @param deck シャッフルするデッキ
 * @returns シャッフルされたデッキ
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * デッキから指定枚数のカードを引く
 * 
 * @param deck カードを引くデッキ
 * @param count 引くカードの枚数
 * @returns 引いたカードの配列
 */
export function drawCards(deck: Card[], count: number): Card[] {
  return deck.splice(0, count);
}

/**
 * カードの表示名を取得する
 * 
 * @param card カード
 * @returns カードの表示名（例: "A♠", "K♥"）
 */
export function getCardDisplayName(card: Card): string {
  const rankName = CARD_RANK_NAMES[card.rank as keyof typeof CARD_RANK_NAMES];
  const suitSymbol = CARD_SUIT_SYMBOLS[card.suit as keyof typeof CARD_SUIT_SYMBOLS];
  return `${rankName}${suitSymbol}`;
}

/**
 * ポーカーハンドを判定する
 * 
 * @param cards 5枚のカード
 * @returns ポーカーハンドの結果
 */
export function evaluatePokerHand(cards: Card[]): PokerHandResult {
  if (cards.length !== 5) {
    throw new Error('ポーカーハンドの判定には5枚のカードが必要です');
  }

  // カードをランクでソート（Aは1として扱う）
  const sortedCards = [...cards].sort((a, b) => a.rank - b.rank);
  
  // ランクと枚数をカウント
  const rankCounts: { [key: number]: number } = {};
  const suitCounts: { [key: number]: number } = {};
  
  sortedCards.forEach(card => {
    rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
    suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
  });
  
  const ranks = Object.keys(rankCounts).map(Number).sort((a, b) => a - b);
  const counts = Object.values(rankCounts).sort((a, b) => b - a);
  
  // フラッシュ判定
  const isFlush = Object.keys(suitCounts).length === 1;
  
  // ストレート判定
  let isStraight = false;
  if (ranks.length === 5) {
    // 通常のストレート
    if (ranks[4] - ranks[0] === 4) {
      isStraight = true;
    }
    // A-2-3-4-5のストレート（ローストレート）
    else if (ranks[0] === 1 && ranks[1] === 2 && ranks[2] === 3 && ranks[3] === 4 && ranks[4] === 5) {
      isStraight = true;
    }
    // 10-J-Q-K-Aのストレート（ハイストレート）
    else if (ranks[0] === 1 && ranks[1] === 10 && ranks[2] === 11 && ranks[3] === 12 && ranks[4] === 13) {
      isStraight = true;
    }
  }
  
  // ロイヤルフラッシュ判定
  if (isFlush && isStraight && ranks[0] === 1 && ranks[4] === 13) {
    return {
      handType: POKER_HANDS.ROYAL_FLUSH,
      handName: 'ロイヤルフラッシュ',
      payout: POKER_HAND_PAYOUTS[POKER_HANDS.ROYAL_FLUSH],
      cards: sortedCards,
    };
  }
  
  // ストレートフラッシュ判定
  if (isFlush && isStraight) {
    return {
      handType: POKER_HANDS.STRAIGHT_FLUSH,
      handName: 'ストレートフラッシュ',
      payout: POKER_HAND_PAYOUTS[POKER_HANDS.STRAIGHT_FLUSH],
      cards: sortedCards,
    };
  }
  
  // フォーカード判定
  if (counts[0] === 4) {
    return {
      handType: POKER_HANDS.FOUR_OF_A_KIND,
      handName: 'フォーカード',
      payout: POKER_HAND_PAYOUTS[POKER_HANDS.FOUR_OF_A_KIND],
      cards: sortedCards,
    };
  }
  
  // フルハウス判定
  if (counts[0] === 3 && counts[1] === 2) {
    return {
      handType: POKER_HANDS.FULL_HOUSE,
      handName: 'フルハウス',
      payout: POKER_HAND_PAYOUTS[POKER_HANDS.FULL_HOUSE],
      cards: sortedCards,
    };
  }
  
  // フラッシュ判定
  if (isFlush) {
    return {
      handType: POKER_HANDS.FLUSH,
      handName: 'フラッシュ',
      payout: POKER_HAND_PAYOUTS[POKER_HANDS.FLUSH],
      cards: sortedCards,
    };
  }
  
  // ストレート判定
  if (isStraight) {
    return {
      handType: POKER_HANDS.STRAIGHT,
      handName: 'ストレート',
      payout: POKER_HAND_PAYOUTS[POKER_HANDS.STRAIGHT],
      cards: sortedCards,
    };
  }
  
  // スリーカード判定
  if (counts[0] === 3) {
    return {
      handType: POKER_HANDS.THREE_OF_A_KIND,
      handName: 'スリーカード',
      payout: POKER_HAND_PAYOUTS[POKER_HANDS.THREE_OF_A_KIND],
      cards: sortedCards,
    };
  }
  
  // ツーペア判定
  if (counts[0] === 2 && counts[1] === 2) {
    return {
      handType: POKER_HANDS.TWO_PAIR,
      handName: 'ツーペア',
      payout: POKER_HAND_PAYOUTS[POKER_HANDS.TWO_PAIR],
      cards: sortedCards,
    };
  }
  
  // ワンペア判定
  if (counts[0] === 2) {
    return {
      handType: POKER_HANDS.ONE_PAIR,
      handName: 'ワンペア',
      payout: POKER_HAND_PAYOUTS[POKER_HANDS.ONE_PAIR],
      cards: sortedCards,
    };
  }
  
  // ハイカード
  return {
    handType: POKER_HANDS.HIGH_CARD,
    handName: 'ハイカード',
    payout: POKER_HAND_PAYOUTS[POKER_HANDS.HIGH_CARD],
    cards: sortedCards,
  };
}

/**
 * 配当金額を計算する
 * 
 * @param betAmount ベット額
 * @param handResult ポーカーハンドの結果
 * @returns 配当金額
 */
export function calculatePayout(betAmount: bigint, handResult: PokerHandResult): bigint {
  return betAmount * BigInt(handResult.payout);
}

/**
 * ゲーム結果を計算する
 * 
 * @param betAmount ベット額
 * @param cards 5枚のカード
 * @returns ゲーム結果
 */
export function calculateGameResult(betAmount: bigint, cards: Card[]) {
  const handResult = evaluatePokerHand(cards);
  const payout = calculatePayout(betAmount, handResult);
  const profit = payout - betAmount;
  
  return {
    handResult,
    payout,
    profit,
    isWin: payout > 0n,
  };
}