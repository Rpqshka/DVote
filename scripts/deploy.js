const { ethers } = require("hardhat");

async function main() {
    const [owner] = await ethers.getSigners();

    const Vote = await ethers.getContractFactory("Vote", owner);
    const vote = await Vote.deploy();

    await vote.deployed();

    
    const DVoteFactory = await ethers.getContractFactory("DVoteFactory", owner);
    const dVoteFactory = await DVoteFactory.deploy(vote.address);

    await dVoteFactory.deployed();

    console.log("Vote address: " + vote.address);
    console.log("DVoteFactory address: " + dVoteFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });