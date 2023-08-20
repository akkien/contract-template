/* eslint-disable node/no-missing-import */
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { WETH9 } from "../typechain-types";

describe("WETH Testing", function () {
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  let weth: WETH9;

  const depositValue = 10;

  beforeEach(async () => {
    [user1, user2, user3] = await ethers.getSigners();

    const WethFactory = await ethers.getContractFactory("WETH9");
    weth = await WethFactory.deploy();
    await weth.deployed();
  });

  it("Should deploy successfully", async () => {
    const supply = await weth.totalSupply();
    expect(supply).to.equal(0);
  });

  it("Should deposit successfully", async () => {
    const tx = await weth.deposit({ value: depositValue });
    await tx.wait();

    const supply = await weth.totalSupply();
    expect(supply).to.equal(depositValue);

    const balance = await weth.balanceOf(user1.address);
    expect(balance).to.equal(depositValue);

    // Deposit by sending
    const transferTx = await user2.sendTransaction({
      to: weth.address,
      value: depositValue,
    });
    await transferTx.wait();

    const supply2 = await weth.totalSupply();
    expect(supply2).to.equal(2 * depositValue);

    const balance2 = await weth.balanceOf(user1.address);
    expect(balance2).to.equal(depositValue);
  });

  describe("Deposit and After", function () {
    beforeEach(async () => {
      const tx = await weth.deposit({ value: depositValue });
      await tx.wait();
    });

    it("Should transfer successfully", async () => {
      await expect(weth.transfer(user2.address, 5)).to.changeTokenBalances(
        weth,
        [user1, user2],
        [-5, 5]
      );

      await expect(
        weth.connect(user2).transfer(user3.address, 100)
      ).to.be.revertedWith("balance not enough");
    });

    it("Should approve successfully", async () => {
      const approveTx = await weth.approve(user2.address, 5);
      await approveTx.wait();

      await expect(
        weth.connect(user2).transferFrom(user1.address, user3.address, 5)
      ).to.changeTokenBalances(weth, [user1, user3], [-5, 5]);
    });

    it("Should withdraw successfully", async () => {
      await expect(weth.withdraw(5)).to.changeTokenBalances(
        weth,
        [user1],
        [-5]
      );
    });
  });
});
