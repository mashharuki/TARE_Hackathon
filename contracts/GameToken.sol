// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameToken is ERC20, Ownable {
    constructor(address _initialOwner) ERC20("Poker Game Token", "PGT") Ownable(_initialOwner) {
        _mint(_initialOwner, 1000000 * 10**decimals()); // 初期供給量: 1M tokens
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function faucet() external {
        require(balanceOf(msg.sender) < 100 * 10**decimals(), "Already have enough tokens");
        _mint(msg.sender, 50 * 10**decimals()); // 50 tokens
    }
}