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
      <div className={`flex flex-col items-center justify-center min-h-[300px] p-4 sm:p-8 ${className}`}>
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">ポーカーゲーム</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">ゲームを開始するにはウォレットを接続してください</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <p className="text-blue-800 text-xs sm:text-sm leading-relaxed">
              右上の「Connect Wallet」ボタンからウォレットを接続してください
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-2 sm:p-4 lg:p-6 ${className}`}>
        {/* ヘッダー */}
        <div className="text-center mb-3 sm:mb-6 lg:mb-8">
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">5カードドロー ポーカー</h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">カードを選んで交換し、最高の役を作ろう！</p>
        </div>

      {/* プレイヤー情報 */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">プレイヤー情報</h3>
              <p className="text-xs sm:text-sm text-gray-600">残高: {tokenBalance ? formatEther(tokenBalance as bigint) : '0'} GTK</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-gray-600">ベット額</p>
              <p className="text-sm sm:text-lg lg:text-xl font-bold text-blue-600">{betAmount} ETH</p>
            </div>
          </div>
        </div>

      {/* ベット設定 */}
        {gameState === GameState.IDLE && (
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-3">ベット額を設定</h3>
            <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4">
              {['0.001', '0.01', '0.05', '0.1'].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleBetAmountChange(amount)}
                  className={`px-3 sm:px-4 py-3 text-sm font-medium rounded-lg border transition-colors min-h-[44px] sm:min-h-[48px] touch-manipulation ${
                    betAmount === amount
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 active:bg-gray-100'
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
                className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] sm:min-h-[48px]"
                placeholder="カスタム額"
              />
              <button
                onClick={startNewGame}
                disabled={isLoading || isPending}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[48px] sm:min-h-[52px] touch-manipulation"
              >
                {isLoading || isPending ? 'ゲーム開始中...' : 'ゲーム開始'}
              </button>
            </div>
          </div>
        )}

      {/* カード表示エリア */}
      {gameState !== GameState.IDLE && (
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-3">あなたの手札</h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
            {playerCards.map((card, index) => (
              <div key={index} className="relative">
                <div
                  className={`w-16 h-24 sm:w-20 sm:h-28 lg:w-24 lg:h-32 bg-white border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all touch-manipulation shadow-md ${
                    selectedCards[index]
                      ? 'border-red-500 bg-red-50 transform -translate-y-2 sm:-translate-y-3 shadow-xl'
                      : 'border-gray-300 hover:border-gray-400 active:bg-gray-50 hover:shadow-lg'
                  }`}
                  onClick={() => toggleCardSelection(index)}
                >
                  <div className={`text-base sm:text-xl lg:text-2xl font-bold ${
                    card.suit === 0 || card.suit === 1 ? 'text-red-500' : 'text-black'
                  }`}>
                    {getCardDisplayName(card)}
                  </div>
                </div>
                {selectedCards[index] && (
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm sm:text-base font-bold shadow-lg">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* アクションボタン */}
          <div className="flex flex-col gap-2 sm:gap-3 justify-center">
            {gameState === GameState.DEALING && (
              <p className="text-blue-600 font-semibold text-xs sm:text-sm lg:text-base text-center">カードを配っています...</p>
            )}
            {gameState === GameState.DRAWING && (
              <div>
                <p className="text-green-600 font-semibold mb-3 sm:mb-4 text-xs sm:text-sm lg:text-base text-center">
                  交換したいカードをクリックして選択してください
                </p>
                <button
                  onClick={drawNewCards}
                  disabled={isLoading || isPending}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[48px] sm:min-h-[52px] touch-manipulation"
                >
                  {isLoading || isPending ? 'カード交換中...' : 'カードを交換'}
                </button>
              </div>
            )}
            {gameState === GameState.EVALUATING && (
              <p className="text-purple-600 font-semibold text-xs sm:text-sm lg:text-base text-center">ハンドを評価中...</p>
            )}
            <button
              onClick={() => setGameState(GameState.IDLE)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors min-h-[48px] sm:min-h-[52px] touch-manipulation"
            >
              リセット
            </button>
          </div>
        </div>
      )}

      {/* 結果表示 */}
      {gameResult && (
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-3">ゲーム結果</h3>
          <div className="text-center">
            <div className={`text-lg sm:text-xl lg:text-2xl font-bold mb-3 ${
              gameResult.isWin ? 'text-green-600' : 'text-red-600'
            }`}>
              {gameResult.isWin ? '🎉 勝利！' : '😔 敗北'}
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-2">役: {gameResult.handName}</p>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              {gameResult.isWin ? `獲得: ${gameResult.payout} ETH` : `損失: ${betAmount} ETH`}
            </p>
            <button
              onClick={() => setGameState(GameState.IDLE)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors min-h-[48px] sm:min-h-[52px] touch-manipulation"
            >
              新しいゲーム
            </button>
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 lg:mb-6">
          <p className="text-red-800 text-xs sm:text-sm leading-relaxed">{error}</p>
        </div>
      )}

      {/* ローディング表示 */}
      {(isLoading || isPending || isConfirming) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-700">
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