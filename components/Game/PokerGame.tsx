'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { POKER_GAME_ABI } from '../../utils/abis/PokerGame';
import { GAME_TOKEN_ABI } from '../../utils/abis/GameToken';
import { POKER_GAME_ADDRESS, GAME_TOKEN_ADDRESS, GAME_CONFIG } from '../../utils/constants';
import {
  Card,
  createDeck,
  shuffleDeck,
  drawCards,
  evaluatePokerHand,
  calculateGameResult,
  getCardDisplayName,
} from '../../utils/poker';

// ゲームの状態
enum GameState {
  IDLE = 'idle',
  BETTING = 'betting',
  DEALING = 'dealing',
  DRAWING = 'drawing',
  EVALUATING = 'evaluating',
  FINISHED = 'finished',
}

interface PokerGameProps {
  className?: string;
}

export default function PokerGame({ className = '' }: PokerGameProps) {
  const { address, isConnected } = useAccount();
  
  // ゲーム状態
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<boolean[]>([false, false, false, false, false]);
  const [betAmount, setBetAmount] = useState<string>('0.01');
  const [gameResult, setGameResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // スマートコントラクト操作
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });
  
  // プレイヤーのトークン残高を取得
  const { data: tokenBalance } = useReadContract({
    address: GAME_TOKEN_ADDRESS,
    abi: GAME_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  /**
   * 新しいゲームを開始する
   */
  const startNewGame = useCallback(() => {
    setError('');
    setGameResult(null);
    setSelectedCards([false, false, false, false, false]);
    
    // 新しいデッキを作成してシャッフル
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
    
    // 最初の5枚を配る
    const initialCards = drawCards([...newDeck], 5);
    setPlayerCards(initialCards);
    
    setGameState(GameState.DEALING);
    
    // アニメーション後にドロー状態に移行
    setTimeout(() => {
      setGameState(GameState.DRAWING);
    }, 1000);
  }, []);

  /**
   * カードを交換する
   */
  const drawNewCards = useCallback(() => {
    if (gameState !== GameState.DRAWING) return;
    
    setGameState(GameState.EVALUATING);
    
    // 選択されたカードを新しいカードと交換
    const newCards = [...playerCards];
    const remainingDeck = [...deck];
    
    selectedCards.forEach((isSelected, index) => {
      if (isSelected) {
        const newCard = drawCards(remainingDeck, 1)[0];
        if (newCard) {
          newCards[index] = newCard;
        }
      }
    });
    
    setPlayerCards(newCards);
    setDeck(remainingDeck);
    
    // ハンドを評価
    setTimeout(() => {
      const result = calculateGameResult(parseEther(betAmount), newCards);
      setGameResult(result);
      setGameState(GameState.FINISHED);
      
      // スマートコントラクトにゲーム結果を送信
      if (result.isWin && isConnected) {
        handleGameComplete(result);
      }
    }, 1000);
  }, [gameState, playerCards, deck, selectedCards, betAmount, isConnected]);

  /**
   * ゲーム完了をスマートコントラクトに送信
   */
  const handleGameComplete = async (result: any) => {
    try {
      setIsLoading(true);
      
      await writeContract({
        address: POKER_GAME_ADDRESS,
        abi: POKER_GAME_ABI,
        functionName: 'startGame',
        args: [parseEther(betAmount)],
        value: parseEther(betAmount),
      });
    } catch (err) {
      console.error('ゲーム完了の送信に失敗しました:', err);
      setError('ゲーム完了の送信に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * カードの選択状態を切り替える
   */
  const toggleCardSelection = (index: number) => {
    if (gameState !== GameState.DRAWING) return;
    
    const newSelection = [...selectedCards];
    newSelection[index] = !newSelection[index];
    setSelectedCards(newSelection);
  };

  /**
   * ベット額を設定する
   */
  const handleBetAmountChange = (amount: string) => {
    setBetAmount(amount);
  };

  // ウォレット未接続の場合
  if (!isConnected) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[300px] p-4 sm:p-8 ${className} cyber-bg`}>
        <div className="text-center cyber-panel">
          <h2 className="text-xl sm:text-2xl font-bold cyber-text-primary mb-3 sm:mb-4 cyber-glow">サイバー ポーカー</h2>
          <p className="text-sm sm:text-base cyber-text-secondary mb-4 sm:mb-6">ゲームを開始するにはウォレットを接続してください</p>
          <div className="cyber-panel-secondary p-3 sm:p-4">
            <p className="cyber-text-accent text-xs sm:text-sm leading-relaxed">
              右上の「Connect Wallet」ボタンからウォレットを接続してください
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-2 sm:p-4 lg:p-6 ${className} cyber-bg`}>
        {/* ヘッダー */}
        <div className="text-center mb-3 sm:mb-6 lg:mb-8 cyber-scanlines">
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold cyber-text-primary mb-1 sm:mb-2 cyber-glow cyber-glitch">5カードドロー ポーカー</h1>
          <p className="text-xs sm:text-sm lg:text-base cyber-text-secondary cyber-pulse">カードを選んで交換し、最高の役を作ろう！</p>
        </div>

      {/* プレイヤー情報 */}
        <div className="cyber-panel p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 cyber-border-glow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold cyber-text-primary cyber-glow">プレイヤー情報</h3>
              <p className="text-xs sm:text-sm cyber-text-secondary">残高: <span className="cyber-text-accent">{tokenBalance ? formatEther(tokenBalance as bigint) : '0'} GTK</span></p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm cyber-text-secondary">ベット額</p>
              <p className="text-sm sm:text-lg lg:text-xl font-bold cyber-text-accent cyber-glow cyber-pulse">{betAmount} ETH</p>
            </div>
          </div>
        </div>

      {/* ベット設定 */}
        {gameState === GameState.IDLE && (
          <div className="cyber-panel p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 cyber-border-glow">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold cyber-text-primary mb-3 cyber-glow">ベット額を設定</h3>
            <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4">
              {['0.001', '0.01', '0.05', '0.1'].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleBetAmountChange(amount)}
                  className={`px-3 sm:px-4 py-3 text-sm font-medium cyber-border transition-all min-h-[44px] sm:min-h-[48px] touch-manipulation cyber-button ${
                    betAmount === amount
                      ? 'cyber-button-active cyber-glow'
                      : 'cyber-button-secondary hover:cyber-glow-hover'
                  }`}
                >
                  {amount} ETH
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:gap-3">
              <input
                type="number"
                step="0.001"
                min="0.001"
                max="0.1"
                value={betAmount}
                onChange={(e) => handleBetAmountChange(e.target.value)}
                className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base cyber-input min-h-[44px] sm:min-h-[48px]"
                placeholder="カスタム額"
              />
              <button
                onClick={startNewGame}
                disabled={isLoading || isPending}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium cyber-button-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[48px] sm:min-h-[52px] touch-manipulation cyber-glow-hover"
              >
                {isLoading || isPending ? 'ゲーム開始中...' : 'ゲーム開始'}
              </button>
            </div>
          </div>
        )}

      {/* カード表示エリア */}
      {gameState !== GameState.IDLE && (
        <div className="cyber-panel p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 cyber-border-glow">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold cyber-text-primary mb-3 cyber-glow">あなたの手札</h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
            {playerCards.map((card, index) => (
              <div key={index} className="relative">
                <div
                  className={`w-16 h-24 sm:w-20 sm:h-28 lg:w-24 lg:h-32 cyber-card cursor-pointer transition-all touch-manipulation ${
                    selectedCards[index]
                      ? 'cyber-card-selected transform -translate-y-2 sm:-translate-y-3 cyber-glow'
                      : 'cyber-card-normal hover:cyber-glow-hover'
                  }`}
                  onClick={() => toggleCardSelection(index)}
                >
                  <div className={`text-base sm:text-xl lg:text-2xl font-bold cyber-font ${
                    card.suit === 0 || card.suit === 1 ? 'cyber-text-danger' : 'cyber-text-primary'
                  }`}>
                    {getCardDisplayName(card)}
                  </div>
                </div>
                {selectedCards[index] && (
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 cyber-badge-selected flex items-center justify-center text-sm sm:text-base font-bold cyber-glow">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* アクションボタン */}
          <div className="flex flex-col gap-2 sm:gap-3 justify-center">
            {gameState === GameState.DEALING && (
              <p className="cyber-text-accent font-semibold text-xs sm:text-sm lg:text-base text-center cyber-pulse">カードを配っています...</p>
            )}
            {gameState === GameState.DRAWING && (
              <div>
                <p className="cyber-text-success font-semibold mb-3 sm:mb-4 text-xs sm:text-sm lg:text-base text-center cyber-glow">
                  交換したいカードをクリックして選択してください
                </p>
                <button
                  onClick={drawNewCards}
                  disabled={isLoading || isPending}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium cyber-button-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[48px] sm:min-h-[52px] touch-manipulation cyber-glow-hover"
                >
                  {isLoading || isPending ? 'カード交換中...' : 'カードを交換'}
                </button>
              </div>
            )}
            {gameState === GameState.EVALUATING && (
              <p className="cyber-text-warning font-semibold text-xs sm:text-sm lg:text-base text-center cyber-pulse">ハンドを評価中...</p>
            )}
            <button
              onClick={() => setGameState(GameState.IDLE)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium cyber-button-secondary transition-all min-h-[48px] sm:min-h-[52px] touch-manipulation hover:cyber-glow-hover"
            >
              リセット
            </button>
          </div>
        </div>
      )}

      {/* 結果表示 */}
      {gameResult && (
        <div className="cyber-panel p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 cyber-border-glow">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold cyber-text-primary mb-3 cyber-glow">ゲーム結果</h3>
          <div className="text-center">
            <div className={`text-lg sm:text-xl lg:text-2xl font-bold mb-3 cyber-glow cyber-pulse ${
              gameResult.isWin ? 'cyber-text-success' : 'cyber-text-danger'
            }`}>
              {gameResult.isWin ? '🎉 勝利！' : '😔 敗北'}
            </div>
            <p className="text-sm sm:text-base cyber-text-secondary mb-2">役: <span className="cyber-text-accent">{gameResult.handName}</span></p>
            <p className="text-sm sm:text-base cyber-text-secondary mb-4">
              {gameResult.isWin ? `獲得: ` : `損失: `}<span className={gameResult.isWin ? 'cyber-text-success' : 'cyber-text-danger'}>{gameResult.isWin ? gameResult.payout : betAmount} ETH</span>
            </p>
            <button
              onClick={() => setGameState(GameState.IDLE)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium cyber-button-accent transition-all min-h-[48px] sm:min-h-[52px] touch-manipulation cyber-glow-hover"
            >
              新しいゲーム
            </button>
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="cyber-panel-danger p-3 sm:p-4 mb-3 sm:mb-4 lg:mb-6 cyber-border-danger">
          <p className="cyber-text-danger text-xs sm:text-sm leading-relaxed cyber-glow">{error}</p>
        </div>
      )}

      {/* ローディング表示 */}
      {(isLoading || isPending || isConfirming) && (
        <div className="fixed inset-0 cyber-overlay flex items-center justify-center z-50">
          <div className="cyber-panel p-6 text-center cyber-border-glow">
            <div className="cyber-spinner mx-auto mb-4"></div>
            <p className="cyber-text-primary cyber-glow">
              {isPending && 'トランザクションを送信中...'}
              {isConfirming && 'トランザクションを確認中...'}
              {isLoading && '処理中...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}