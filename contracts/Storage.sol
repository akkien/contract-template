// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Storage {
  uint public number;

  function setNum(uint num) public {
    number = num;
  }

  function getNum() public view returns (uint) {
    return number;
  }
}
