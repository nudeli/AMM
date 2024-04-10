// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const lockTime = 60;
  const AMM = await hre.ethers.getContractFactory("AMM"); //fetching bytecode and ABI
  const amm = await AMM.deploy("0x831eF7132909De4679d4F0372FeB86458d3635FD","0x7Ad21D39c348807102f1d778520d1115F7Cf4dA1"); //Creating an instance of our smart contract

  await amm.deployed();

  console.log("Deployed contract address:",`${amm.address}`);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
