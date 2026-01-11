const hre = require("hardhat");

async function main() {
  const Halal = await hre.ethers.getContractFactory("HalalSupplyChain");
  
  // In Hardhat v3, deploy() already waits for deployment
  const halal = await Halal.deploy();

  console.log("HalalSupplyChain deployed to:", halal.target); // use .target instead of .address
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
