// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PokerGame is ReentrancyGuard, Ownable {
    IERC20 public gameToken;
    
    struct Game {
        address player;
        uint256 betAmount;
        uint8[5] initialCards;
        uint8[5] finalCards;
        bool[5] keptCards;
        uint8 handRank;
        uint256 payout;
        uint256 timestamp;
        bool isCompleted;
    }
    
    struct PlayerStats {
        uint256 totalGames;
        uint256 totalWinnings;
        uint256 totalLosses;
        uint256 bestHand;
    }
    
    mapping(uint256 => Game) public games;
    mapping(address => PlayerStats) public playerStats;
    mapping(address => uint256[]) public playerGameIds;
    
    uint256 public nextGameId = 1;
    uint256 public constant MIN_BET = 1e18; // 1 token
    uint256 public constant MAX_BET = 100e18; // 100 tokens
    
    // ハンド配当倍率 (basis points: 10000 = 1x)
    uint256[10] public payoutMultipliers = [
        0,      // No pair (0x)
        10000,  // One pair (1x)
        20000,  // Two pair (2x)
        30000,  // Three of a kind (3x)
        40000,  // Straight (4x)
        60000,  // Flush (6x)
        80000,  // Full house (8x)
        100000, // Four of a kind (10x)
        200000, // Straight flush (20x)
        500000  // Royal flush (50x)
    ];
    
    event GameStarted(uint256 indexed gameId, address indexed player, uint256 betAmount);
    event CardsDrawn(uint256 indexed gameId, uint8[5] finalCards, uint8 handRank);
    event GameCompleted(uint256 indexed gameId, uint256 payout, bool isWinner);
    
    constructor(address _gameToken, address _initialOwner) Ownable(_initialOwner) {
        gameToken = IERC20(_gameToken);
    }
    
    function startGame(uint256 betAmount) external nonReentrant returns (uint256 gameId, uint8[5] memory initialCards) {
        require(betAmount >= MIN_BET && betAmount <= MAX_BET, "Invalid bet amount");
        require(gameToken.transferFrom(msg.sender, address(this), betAmount), "Transfer failed");
        
        gameId = nextGameId++;
        initialCards = _generateRandomCards(gameId);
        
        games[gameId] = Game({
            player: msg.sender,
            betAmount: betAmount,
            initialCards: initialCards,
            finalCards: [0, 0, 0, 0, 0],
            keptCards: [false, false, false, false, false],
            handRank: 0,
            payout: 0,
            timestamp: block.timestamp,
            isCompleted: false
        });
        
        playerGameIds[msg.sender].push(gameId);
        emit GameStarted(gameId, msg.sender, betAmount);
    }
    
    function drawCards(uint256 gameId, bool[5] memory keepCards) external nonReentrant {
        Game storage game = games[gameId];
        require(game.player == msg.sender, "Not your game");
        require(!game.isCompleted, "Game already completed");
        
        // カード交換ロジック
        uint8[5] memory finalCards = game.initialCards;
        for (uint i = 0; i < 5; i++) {
            if (!keepCards[i]) {
                finalCards[i] = _generateRandomCard(gameId, i + 5);
            }
        }
        
        uint8 handRank = _evaluateHand(finalCards);
        uint256 payout = (game.betAmount * payoutMultipliers[handRank]) / 10000;
        
        game.finalCards = finalCards;
        game.keptCards = keepCards;
        game.handRank = handRank;
        game.payout = payout;
        game.isCompleted = true;
        
        // 統計更新
        PlayerStats storage stats = playerStats[msg.sender];
        stats.totalGames++;
        if (payout > game.betAmount) {
            stats.totalWinnings += (payout - game.betAmount);
        } else {
            stats.totalLosses += (game.betAmount - payout);
        }
        if (handRank > stats.bestHand) {
            stats.bestHand = handRank;
        }
        
        // 配当支払い
        if (payout > 0) {
            require(gameToken.transfer(msg.sender, payout), "Payout failed");
        }
        
        emit CardsDrawn(gameId, finalCards, handRank);
        emit GameCompleted(gameId, payout, payout > game.betAmount);
    }
    
    function _generateRandomCards(uint256 seed) private view returns (uint8[5] memory) {
        uint8[5] memory cards;
        bool[52] memory used;
        
        for (uint i = 0; i < 5; i++) {
            uint8 card;
            do {
                card = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, seed, i))) % 52);
            } while (used[card]);
            used[card] = true;
            cards[i] = card;
        }
        return cards;
    }
    
    function _generateRandomCard(uint256 seed, uint256 index) private view returns (uint8) {
        return uint8(uint256(keccak256(abi.encodePacked(block.timestamp, seed, index))) % 52);
    }
    
    function _evaluateHand(uint8[5] memory cards) private pure returns (uint8) {
        // ポーカーハンド評価ロジック
        // 実装省略（ロイヤルフラッシュ、ストレートフラッシュ、フォーカード等の判定）
        return 0; // プレースホルダー
    }
    
    function getPlayerHistory(address player) external view returns (uint256[] memory) {
        return playerGameIds[player];
    }
    
    function getGame(uint256 gameId) external view returns (Game memory) {
        return games[gameId];
    }
}