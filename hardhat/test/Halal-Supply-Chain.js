const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HalalSupplyChain", function () {
  let Halal, halal;
  let owner, farmer, slaughterer, distributor, retailer, unregistered;

  beforeEach(async function () {
    [owner, farmer, slaughterer, distributor, retailer, unregistered] = await ethers.getSigners();

    Halal = await ethers.getContractFactory("HalalSupplyChain");
    halal = await Halal.deploy();
    await halal.waitForDeployment();

    // Register users
    await halal.connect(farmer).registerUser(1); // Farmer
    await halal.connect(slaughterer).registerUser(2); // Slaughterer
    await halal.connect(distributor).registerUser(3); // Distributor
    await halal.connect(retailer).registerUser(4); // Retailer
  });

  it("should register users correctly", async function () {
    const farmerInfo = await halal.users(farmer.address);
    expect(farmerInfo.isRegistered).to.be.true;
    expect(farmerInfo.role).to.equal(1); // Farmer role
  });

  it("should allow farmer to create a batch", async function () {
    await halal.connect(farmer).initialiseBatch("Farm A", "Chicken");
    const batchStatus = await halal.getBatchStatus(0);
    expect(batchStatus.status).to.equal(0); // Created
    expect(batchStatus.currentOwner).to.equal(farmer.address);
  });

  it("should allow slaughterer to add slaughter flow", async function () {
    await halal.connect(farmer).initialiseBatch("Farm A", "Chicken");

    await halal.connect(slaughterer).addSlaughterFlow(
      0,
      "Slaughterhouse A",
      "Processed Chicken",
      "Supervisor X",
      "Halal Cert Body",
      "HALAL123",
      Math.floor(Date.now() / 1000)
    );

    const batchStatus = await halal.getBatchStatus(0);
    expect(batchStatus.status).to.equal(1); // Slaughtered
    expect(batchStatus.isHalalCertified).to.be.true;
  });

  it("should prevent non-registered users from interacting", async function () {
  await expect(
    halal.connect(unregistered).initialiseBatch("Farm A", "Chicken")
  ).to.be.revertedWith("Only farmer allowed");
  });

  it("should follow the full supply chain flow", async function () {
    await halal.connect(farmer).initialiseBatch("Farm A", "Chicken");

    await halal.connect(slaughterer).addSlaughterFlow(
      0,
      "Slaughterhouse A",
      "Processed Chicken",
      "Supervisor X",
      "Halal Cert Body",
      "HALAL123",
      Math.floor(Date.now() / 1000)
    );

    await halal.connect(distributor).addDistributorFlow(0, "Distributor A", "Shipped to Market");
    await halal.connect(retailer).addRetailerFlow(0, "Retailer A", "Ready for Sale");

    const status = await halal.getBatchStatus(0);
    expect(status.status).to.equal(3); // RetailReady
    expect(status.currentOwner).to.equal(retailer.address);
  });
});
