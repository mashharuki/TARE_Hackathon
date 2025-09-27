'use client';

import React, { useState } from 'react';
import { PokerGame, GameHistory, GameRules } from '@/components/Game';

/**
 * Home コンポーネント
 * メインのナビゲーションとページ切り替えを管理
 */
export function Home() {
  const [activeTab, setActiveTab] = useState<'game' | 'history' | 'rules'>('game');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ヘッダーナビゲーション */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center h-auto sm:h-16 py-3 sm:py-0">
            {/* ロゴ */}
            <div className="flex items-center justify-center sm:justify-start mb-3 sm:mb-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">🃏 Web3 Poker</h1>
            </div>
            
            {/* ナビゲーションタブ */}
            <nav className="flex justify-center sm:justify-end space-x-2 sm:space-x-4 lg:space-x-8">
              <button
                onClick={() => setActiveTab('game')}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors touch-manipulation min-h-10 ${
                  activeTab === 'game'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                🎮 ゲーム
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors touch-manipulation min-h-10 ${
                  activeTab === 'history'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                📊 履歴
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors touch-manipulation min-h-10 ${
                  activeTab === 'rules'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                📖 ルール
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="animate-fade-in px-2 sm:px-0">
        {activeTab === 'game' && (
          <div className="py-3 sm:py-6 lg:py-8">
            <PokerGame />
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="py-3 sm:py-6 lg:py-8">
            <GameHistory />
          </div>
        )}
        
        {activeTab === 'rules' && (
          <div className="py-3 sm:py-6 lg:py-8">
            <GameRules />
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 mt-6 sm:mt-12 lg:mt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="text-center">
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              🚀 TRAE Hackathon 2025 | Web3 Poker Mini Game
            </p>
            <p className="text-gray-500 text-xs mt-1 sm:mt-2 leading-relaxed">
              Base Sepolia Testnet | Farcaster Frame Compatible
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
