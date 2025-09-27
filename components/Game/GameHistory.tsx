'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { POKER_GAME_ABI } from '../../utils/abis/PokerGame';
import { POKER_GAME_ADDRESS, POKER_HAND_NAMES } from '../../utils/constants';
import { getCardDisplayName, Card } from '../../utils/poker';

interface GameRecord {
  gameId: number;
  player: string;
  betAmount: bigint;
  handType: number;
  payout: bigint;
  timestamp: number;
  cards: Card[];
}

interface GameHistoryProps {
  className?: string;
}

export default function GameHistory({ className = '' }: GameHistoryProps) {
  const { address, isConnected } = useAccount();
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalGames, setTotalGames] = useState(0);
  const [totalWinnings, setTotalWinnings] = useState<bigint>(0n);
  const [totalLosses, setTotalLosses] = useState<bigint>(0n);
  
  const GAMES_PER_PAGE = 10;

  // プレイヤーの履歴を取得
  const { data: playerHistoryData, refetch } = useReadContract({
    address: POKER_GAME_ADDRESS,
    abi: POKER_GAME_ABI,
    functionName: 'getPlayerHistory',
    args: [address, BigInt(currentPage - 1), BigInt(GAMES_PER_PAGE)],
    query: {
      enabled: !!address && isConnected,
    },
  });

  /**
   * 履歴データを処理する
   */
  useEffect(() => {
    if (playerHistoryData) {
      // スマートコントラクトから返されたデータを処理
      // 実際の実装では、コントラクトの戻り値の構造に合わせて調整が必要
      const mockHistory: GameRecord[] = [
        {
          gameId: 1,
          player: address || '',
          betAmount: BigInt('10000000000000000'), // 0.01 ETH
          handType: 1, // ワンペア
          payout: BigInt('10000000000000000'), // 0.01 ETH
          timestamp: Date.now() - 3600000, // 1時間前
          cards: [
            { suit: 0, rank: 1 }, // A♥
            { suit: 1, rank: 1 }, // A♦
            { suit: 2, rank: 5 }, // 5♣
            { suit: 3, rank: 8 }, // 8♠
            { suit: 0, rank: 10 }, // 10♥
          ],
        },
        {
          gameId: 2,
          player: address || '',
          betAmount: BigInt('20000000000000000'), // 0.02 ETH
          handType: 5, // フラッシュ
          payout: BigInt('120000000000000000'), // 0.12 ETH
          timestamp: Date.now() - 7200000, // 2時間前
          cards: [
            { suit: 0, rank: 2 }, // 2♥
            { suit: 0, rank: 5 }, // 5♥
            { suit: 0, rank: 8 }, // 8♥
            { suit: 0, rank: 10 }, // 10♥
            { suit: 0, rank: 13 }, // K♥
          ],
        },
        {
          gameId: 3,
          player: address || '',
          betAmount: BigInt('5000000000000000'), // 0.005 ETH
          handType: 0, // ハイカード
          payout: 0n, // 0 ETH
          timestamp: Date.now() - 10800000, // 3時間前
          cards: [
            { suit: 0, rank: 2 }, // 2♥
            { suit: 1, rank: 5 }, // 5♦
            { suit: 2, rank: 8 }, // 8♣
            { suit: 3, rank: 10 }, // 10♠
            { suit: 0, rank: 13 }, // K♥
          ],
        },
      ];
      
      setGameHistory(mockHistory);
      setTotalGames(mockHistory.length);
      
      // 勝敗統計を計算
      let winnings = 0n;
      let losses = 0n;
      
      mockHistory.forEach(game => {
        const profit = game.payout - game.betAmount;
        if (profit > 0n) {
          winnings += profit;
        } else {
          losses += game.betAmount;
        }
      });
      
      setTotalWinnings(winnings);
      setTotalLosses(losses);
    }
  }, [playerHistoryData, address]);

  /**
   * 日時をフォーマットする
   */
  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * ページを変更する
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };

  // ウォレット未接続の場合
  if (!isConnected) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 ${className}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ゲーム履歴</h2>
          <p className="text-gray-600 mb-6">履歴を表示するにはウォレットを接続してください</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              右上の「Connect Wallet」ボタンからウォレットを接続してください
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto p-4 sm:p-6 ${className}`}>
      {/* ヘッダー */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">ゲーム履歴</h1>
        <p className="text-sm sm:text-base text-gray-600">あなたの過去のポーカーゲーム結果</p>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-2">総ゲーム数</h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">{totalGames}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-2">総勝利金額</h3>
          <p className="text-xl sm:text-3xl font-bold text-green-600">+{formatEther(totalWinnings)} ETH</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-2">総損失金額</h3>
          <p className="text-xl sm:text-3xl font-bold text-red-600">-{formatEther(totalLosses)} ETH</p>
        </div>
      </div>

      {/* ゲーム履歴テーブル */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">ゲーム履歴</h3>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">読み込み中...</span>
          </div>
        ) : gameHistory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">まだゲーム履歴がありません</p>
            <p className="text-sm text-gray-500 mt-2">ポーカーゲームをプレイして履歴を作成しましょう！</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日時
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    ベット額
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    手札
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    役
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    配当
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    損益
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {gameHistory.map((game) => {
                  const profit = game.payout - game.betAmount;
                  const isWin = profit > 0n;
                  
                  return (
                    <tr key={game.gameId} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        <div className="sm:hidden">
                          {new Date(game.timestamp).toLocaleDateString('ja-JP')}
                        </div>
                        <div className="hidden sm:block">
                          {formatTimestamp(game.timestamp)}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                        {formatEther(game.betAmount)} ETH
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {game.cards.map((card, index) => (
                            <span
                              key={index}
                              className={`text-xs font-mono px-1 py-0.5 rounded ${
                                card.suit === 0 || card.suit === 1
                                  ? 'text-red-600 bg-red-50'
                                  : 'text-gray-800 bg-gray-100'
                              }`}
                            >
                              {getCardDisplayName(card)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        <div className="sm:hidden text-xs">
                          {POKER_HAND_NAMES[game.handType as keyof typeof POKER_HAND_NAMES]}
                          <div className="text-gray-500 mt-1">
                            {formatEther(game.betAmount)} ETH
                          </div>
                        </div>
                        <div className="hidden sm:block">
                          {POKER_HAND_NAMES[game.handType as keyof typeof POKER_HAND_NAMES]}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                        {formatEther(game.payout)} ETH
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                        <span className={isWin ? 'text-green-600' : 'text-red-600'}>
                          {isWin ? '+' : ''}{formatEther(profit)} ETH
                        </span>
                        <div className="sm:hidden text-gray-500 text-xs mt-1">
                          配当: {formatEther(game.payout)} ETH
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ページネーション */}
      {totalGames > GAMES_PER_PAGE && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              前へ
            </button>
            
            {Array.from({ length: Math.ceil(totalGames / GAMES_PER_PAGE) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === page
                    ? 'text-white bg-blue-600 border border-blue-600'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(totalGames / GAMES_PER_PAGE)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              次へ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}