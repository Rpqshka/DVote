require("@nomicfoundation/hardhat-toolbox");
require("solidity-coverage");
require('dotenv').config()

module.exports = {
  solidity: "0.8.17",

  networks:{
    goerli:{
      url: `https://goerli.infura.io/v3/${process.env.GOERLI_URL}`,
      accounts: [process.env.PRIVATE_KEY]
    },
    sepolia:{
      url: `https://sepolia.infura.io/v3/${process.env.SEPOLIA_URL}`,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
};
