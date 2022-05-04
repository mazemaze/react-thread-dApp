// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract ThreaderCoin is ERC20 {
  constructor(uint256 initialSupply) ERC20("Threader", "THD") {
    _mint(msg.sender, initialSupply);
  }
}