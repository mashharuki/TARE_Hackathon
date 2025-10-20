'use client';

import React, { useState } from 'react';
import { POKER_HAND_NAMES, POKER_HAND_PAYOUTS, CARD_SUIT_SYMBOLS } from '../../utils/constants';

interface GameRulesProps {
  className?: string;
}

export default function GameRules({ className = '' }: GameRulesProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'hands' | 'betting'>('basic');

  /**
   * ポーカーハンドの例を表示するコンポーネント
   */
  const HandExample = ({ cards, description }: { cards: string[]; description: string }) => (
    <div className="flex flex-col space-y-3 p-3 cyber-panel cyber-border rounded-lg">
      <div className="flex space-x-1 justify-center overflow-x-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`w-10 h-12 sm:w-12 sm:h-16 rounded cyber-border-glow flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 cyber-bg ${
              card.includes('♥') || card.includes('♦')
                ? 'cyber-text-danger cyber-glow'
                : 'cyber-text-primary'
            }`}
          >
            {card}
          </div>
        ))}
      </div>
      <p className="text-xs sm:text-sm cyber-text-secondary text-center leading-relaxed">{description}</p>
    </div>
  );

  return (
    <div className={`max-w-4xl mx-auto p-2 sm:p-6 cyber-bg cyber-scanlines ${className}`}>
      {/* ヘッダー */}
      <div className="text-center mb-3 sm:mb-8 cyber-panel cyber-border-glow p-4 rounded-lg">
        <h1 className="text-lg sm:text-3xl font-bold cyber-text-primary cyber-glow mb-2 px-2 cyber-glitch">ポーカーゲームの遊び方</h1>
        <p className="text-sm sm:text-base cyber-text-secondary px-2">5カードドローポーカーのルールと遊び方を説明します</p>
      </div>

      {/* タブナビゲーション */}
      <div className="cyber-panel cyber-border-glow rounded-lg mb-3 sm:mb-6 mx-1 sm:mx-0">
        <div className="flex cyber-border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('basic')}
            className={`flex-shrink-0 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors min-h-[48px] touch-manipulation ${
              activeTab === 'basic'
                ? 'cyber-button-active cyber-text-primary cyber-glow cyber-border-b-accent'
                : 'cyber-text-secondary hover:cyber-text-primary hover:cyber-glow-hover'
            }`}
          >
            基本ルール
          </button>
          <button
            onClick={() => setActiveTab('hands')}
            className={`flex-shrink-0 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors min-h-[48px] touch-manipulation ${
              activeTab === 'hands'
                ? 'cyber-button-active cyber-text-primary cyber-glow cyber-border-b-accent'
                : 'cyber-text-secondary hover:cyber-text-primary hover:cyber-glow-hover'
            }`}
          >
            ポーカーハンド
          </button>
          <button
            onClick={() => setActiveTab('betting')}
            className={`flex-shrink-0 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors min-h-[48px] touch-manipulation ${
              activeTab === 'betting'
                ? 'cyber-button-active cyber-text-primary cyber-glow cyber-border-b-accent'
                : 'cyber-text-secondary hover:cyber-text-primary hover:cyber-glow-hover'
            }`}
          >
            ベットシステム
          </button>
        </div>
      </div>

      {/* タブコンテンツ */}
      <div className="p-2 sm:p-6 mx-1 sm:mx-0">
        {activeTab === 'basic' && (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">ゲームの流れ</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 leading-relaxed pl-2">
                <li>ベット額を設定してゲームを開始</li>
                <li>5枚のカードが配られます</li>
                <li>交換したいカードを選択（0〜5枚）</li>
                <li>選択したカードが新しいカードと交換されます</li>
                <li>最終的な手札で役が判定され、配当が決まります</li>
              </ol>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">基本ルール</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 leading-relaxed pl-2">
                <li>使用するカード：標準的な52枚のトランプ（ジョーカーなし）</li>
                <li>プレイヤーは最初に5枚のカードを受け取ります</li>
                <li>1回だけカードの交換が可能です</li>
                <li>交換後の手札で最終的な役が決まります</li>
                <li>役に応じて配当が支払われます</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'hands' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">ポーカーハンド一覧</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed px-1">強い順に並んでいます。上位の役ほど配当が高くなります。</p>
            </div>
            
            <div className="space-y-3">
              {/* ロイヤルフラッシュ */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-800">ロイヤルフラッシュ</h3>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      {POKER_HAND_PAYOUTS[9]}倍
                    </span>
                  </div>
                </div>
                <HandExample
                  cards={['A♠', 'K♠', 'Q♠', 'J♠', '10♠']}
                  description="同じスートのA, K, Q, J, 10の組み合わせ。最強の役です。"
                />
              </div>

              {/* ストレートフラッシュ */}
               <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                 <div className="flex flex-col space-y-2 mb-3">
                   <div className="flex justify-between items-center">
                     <h3 className="text-sm sm:text-lg font-semibold text-gray-800">ストレートフラッシュ</h3>
                     <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                       {POKER_HAND_PAYOUTS[8]}倍
                     </span>
                   </div>
                 </div>
                <HandExample
                  cards={['9♥', '8♥', '7♥', '6♥', '5♥']}
                  description="同じスートで連続する5枚のカード。"
                />
              </div>

              {/* フォーカード */}
               <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                 <div className="flex flex-col space-y-2 mb-3">
                   <div className="flex justify-between items-center">
                     <h3 className="text-sm sm:text-lg font-semibold text-gray-800">フォーカード</h3>
                     <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                       {POKER_HAND_PAYOUTS[7]}倍
                     </span>
                   </div>
                 </div>
                <HandExample
                  cards={['K♠', 'K♥', 'K♦', 'K♣', '3♠']}
                  description="同じ数字のカード4枚。"
                />
              </div>

              {/* フルハウス */}
               <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                 <div className="flex flex-col space-y-2 mb-3">
                   <div className="flex justify-between items-center">
                     <h3 className="text-sm sm:text-lg font-semibold text-gray-800">フルハウス</h3>
                     <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                       {POKER_HAND_PAYOUTS[6]}倍
                     </span>
                   </div>
                 </div>
                <HandExample
                  cards={['A♠', 'A♥', 'A♦', '8♣', '8♠']}
                  description="スリーカード + ワンペアの組み合わせ。"
                />
              </div>

              {/* フラッシュ */}
               <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                 <div className="flex flex-col space-y-2 mb-3">
                   <div className="flex justify-between items-center">
                     <h3 className="text-sm sm:text-lg font-semibold text-gray-800">フラッシュ</h3>
                     <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                       {POKER_HAND_PAYOUTS[5]}倍
                     </span>
                   </div>
                 </div>
                <HandExample
                  cards={['K♦', 'J♦', '9♦', '6♦', '3♦']}
                  description="同じスートのカード5枚（連続でなくてもOK）。"
                />
              </div>

              {/* ストレート */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-800">ストレート</h3>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {POKER_HAND_PAYOUTS[4]}倍
                    </span>
                  </div>
                </div>
                <HandExample
                  cards={['10♠', '9♥', '8♦', '7♣', '6♠']}
                  description="連続する5枚のカード（スートは問わない）。"
                />
              </div>

              {/* スリーカード */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-800">スリーカード</h3>
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                      {POKER_HAND_PAYOUTS[3]}倍
                    </span>
                  </div>
                </div>
                <HandExample
                  cards={['7♠', '7♥', '7♦', 'K♣', '2♠']}
                  description="同じ数字のカード3枚。"
                />
              </div>

              {/* ツーペア */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-800">ツーペア</h3>
                    <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium">
                      {POKER_HAND_PAYOUTS[2]}倍
                    </span>
                  </div>
                </div>
                <HandExample
                  cards={['A♠', 'A♥', '8♦', '8♣', '5♠']}
                  description="2つの異なるペア。"
                />
              </div>

              {/* ワンペア */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-800">ワンペア</h3>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                      {POKER_HAND_PAYOUTS[1]}倍
                    </span>
                  </div>
                </div>
                <HandExample
                  cards={['Q♠', 'Q♥', '9♦', '6♣', '3♠']}
                  description="同じ数字のカード2枚。"
                />
              </div>

              {/* ハイカード */}
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-800">ハイカード</h3>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                      {POKER_HAND_PAYOUTS[0]}倍
                    </span>
                  </div>
                </div>
                <HandExample
                  cards={['A♠', 'J♥', '9♦', '6♣', '3♠']}
                  description="上記のいずれの役も成立しない場合。配当なし。"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'betting' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-3">ベットシステム</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-sm sm:text-lg font-semibold text-blue-800 mb-2 sm:mb-3">ベット額設定</h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-blue-700">
                  <li>• 最小ベット額: 0.001 ETH</li>
                  <li>• 最大ベット額: 1.0 ETH</li>
                  <li>• ベット額は0.001 ETH単位で設定可能</li>
                  <li>• ウォレット残高を確認してベット</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-sm sm:text-lg font-semibold text-green-800 mb-2 sm:mb-3">配当システム</h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-green-700">
                  <li>• 配当 = ベット額 × 配当倍率</li>
                  <li>• 勝利時は即座にウォレットに送金</li>
                  <li>• ガス代は別途必要</li>
                  <li>• トランザクション履歴で確認可能</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-3">Web3機能</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-sm sm:text-lg font-semibold text-purple-800 mb-2 sm:mb-3">Base Sepolia対応</h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-purple-700">
                  <li>• テストネット環境</li>
                  <li>• 無料でテスト可能</li>
                  <li>• 高速トランザクション</li>
                  <li>• 低ガス手数料</li>
                </ul>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-sm sm:text-lg font-semibold text-indigo-800 mb-2 sm:mb-3">ウォレット接続</h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-indigo-700">
                  <li>• MetaMask対応</li>
                  <li>• WalletConnect対応</li>
                  <li>• 安全な接続</li>
                  <li>• 簡単な操作</li>
                </ul>
              </div>

              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-sm sm:text-lg font-semibold text-cyan-800 mb-2 sm:mb-3">Farcaster Frame連携</h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-cyan-700">
                  <li>• ソーシャル機能</li>
                  <li>• 結果シェア</li>
                  <li>• コミュニティ参加</li>
                  <li>• 友達と対戦</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-3">注意事項</h3>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-sm sm:text-lg font-semibold text-yellow-800 mb-3 sm:mb-4">重要な注意点</h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-yellow-700">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2 flex-shrink-0">⚠️</span>
                  <span>これはテストネット環境でのデモゲームです。実際の価値を持つETHは使用されません。</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2 flex-shrink-0">⚠️</span>
                  <span>ゲームの結果は完全にランダムであり、運営側が操作することはできません。</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2 flex-shrink-0">⚠️</span>
                  <span>ウォレットの接続とトランザクションの承認は慎重に行ってください。</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2 flex-shrink-0">⚠️</span>
                  <span>ガス代（手数料）は実際に発生する場合があります。</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2 flex-shrink-0">⚠️</span>
                  <span>ゲームは18歳以上の方のみご利用いただけます。</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}