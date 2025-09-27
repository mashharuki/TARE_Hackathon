export const POKER_GAME_ABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_gameToken",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_initialOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "startGame",
    "inputs": [
      {
        "name": "betAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "gameId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "initialCards",
        "type": "uint8[5]",
        "internalType": "uint8[5]"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "drawCards",
    "inputs": [
      {
        "name": "gameId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "keepCards",
        "type": "bool[5]",
        "internalType": "bool[5]"
      }
    ],
    "outputs": [
      {
        "name": "finalCards",
        "type": "uint8[5]",
        "internalType": "uint8[5]"
      },
      {
        "name": "handRank",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "payout",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getPlayerHistory",
    "inputs": [
      {
        "name": "player",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct PokerGame.GameResult[]",
        "components": [
          {
            "name": "gameId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "betAmount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "finalCards",
            "type": "uint8[5]",
            "internalType": "uint8[5]"
          },
          {
            "name": "handRank",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "payout",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "timestamp",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getGame",
    "inputs": [
      {
        "name": "gameId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct PokerGame.Game",
        "components": [
          {
            "name": "player",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "betAmount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "initialCards",
            "type": "uint8[5]",
            "internalType": "uint8[5]"
          },
          {
            "name": "finalCards",
            "type": "uint8[5]",
            "internalType": "uint8[5]"
          },
          {
            "name": "handRank",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "payout",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "isCompleted",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "timestamp",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "GameStarted",
    "inputs": [
      {
        "name": "gameId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "player",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "betAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "GameCompleted",
    "inputs": [
      {
        "name": "gameId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "player",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "handRank",
        "type": "uint8",
        "indexed": false,
        "internalType": "uint8"
      },
      {
        "name": "payout",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
] as const;