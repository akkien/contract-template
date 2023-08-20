// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.20;

import {Test} from "forge-std/Test.sol";
import {WETH9} from "../contracts/WETH9.sol";

contract WETH9Test is Test {
  WETH9 public weth;

  address user1 = address(0xaa);
  address user2 = address(0xbb);
  address user3 = address(0xcc);
  address[] public actors;

  uint depositValue = 10;
  uint initBalance = 1000;

  function setUp() public {
    weth = new WETH9();
    vm.deal(user1, initBalance);
    vm.deal(user2, initBalance);
    vm.deal(user3, initBalance);

    actors.push(user1);
    actors.push(user2);
    actors.push(user3);
  }

  function test_deploy() public {
    assertEq(weth.totalSupply(), 0);
  }

  function testUnit_deposit() public {
    vm.prank(user1);
    weth.deposit{value: depositValue}();

    assertEq(weth.totalSupply(), depositValue);
    assertEq(weth.balanceOf(user1), depositValue);

    vm.prank(user2);
    (bool sent, ) = address(weth).call{value: depositValue}("");
    assertEq(sent, true);
    assertEq(weth.totalSupply(), depositValue * 2);
    assertEq(weth.balanceOf(user2), depositValue);
  }

  // Fuzz test for the same function
  function testFuzz_deposit(uint addressIdx, uint value) public {
    address user = actors[addressIdx % actors.length];
    vm.assume(value < 1000);

    vm.prank(user);
    weth.deposit{value: value}();

    assertEq(weth.balanceOf(user), value);
    assertEq(weth.totalSupply(), value);
  }

  function testUnit_transfer() public {
    vm.prank(user1);
    weth.deposit{value: depositValue}();

    vm.prank(user1);
    weth.transfer(user2, 5);

    assertEq(weth.balanceOf(user1), depositValue - 5);
    assertEq(weth.balanceOf(user2), 5);

    // transfer fail
    vm.prank(user2);
    vm.expectRevert();
    weth.transfer(user3, 100);
  }

  function testUnit_approve() public {
    vm.prank(user1);
    weth.deposit{value: depositValue}();

    vm.prank(user1);
    weth.approve(user2, 5);

    vm.prank(user2);
    weth.transferFrom(user1, user3, 5);

    assertEq(weth.balanceOf(user1), depositValue - 5);
    assertEq(weth.balanceOf(user3), 5);
  }

  function testUnit_withdraw() public {
    vm.prank(user1);
    weth.deposit{value: depositValue}();

    vm.prank(user1);
    weth.withdraw(5);

    assertEq(weth.balanceOf(user1), depositValue - 5);
    assertEq(weth.totalSupply(), depositValue - 5);
  }
}
