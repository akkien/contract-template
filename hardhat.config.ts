import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import "hardhat-finder";
import "@dlsl/hardhat-gobind";
import "@nomicfoundation/hardhat-foundry";

import "./tasks/accounts";

dotenv.config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: { enabled: true, runs: 200 },
          outputSelection: {
            "*": {
              "*": [
                "storageLayout",
                "metadata",
                "devdoc",
                "userdoc",
                "evm.methodIdentifiers",
                "evm.gasEstimates",
              ],
            },
          },
        },
      },
    ],
  },
  defaultNetwork: "devnet",
  networks: {
    hardhat: {
      gas: 20000000,
      gasPrice: 100000000000, // 50 Gwei
    },
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts: [
        process.env.PRIVATE_KEY_DEV ? process.env.PRIVATE_KEY_DEV : "",
      ],
      timeout: 8000000,
      gasPrice: 20000000000, // 50 Gwei
    },
    prodnet: {
      url: process.env.RPC_URL_PROD || "",
      accounts: [
        process.env.PRIVATE_KEY_PROD ? process.env.PRIVATE_KEY_PROD : "",
      ],
      timeout: 8000000,
      gasPrice: 2000000000000, // 20 Gwei
    },
    devnet: {
      url: process.env.RPC_URL_DEV || "",
      accounts: [
        process.env.PRIVATE_KEY_DEV ? process.env.PRIVATE_KEY_DEV : "",
      ],
      timeout: 8000000,
      gasPrice: 2000000000000, // 20 Gwei
    },
  },
  gasReporter: {
    enabled: !!process.env.REPORT_GAS,
    currency: "USD",
  },
  abiExporter: {
    path: "./build/abi",
    clear: true,
    flat: true,
    spacing: 2,
  },
  gobind: {
    outdir: "./go-types/contract",
    deployable: false,
    runOnCompile: false,
    verbose: false,
    onlyFiles: ["contracts/<contract.sol>"],
  },
  mocha: {
    timeout: 30000,
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY || "",
      devnet: "abc",
      prodnet: "abc",
    },
    customChains: [
      {
        network: "devnet",
        chainId: 11115,
        urls: {
          apiURL: process.env.EXPLORER_API_DEV || "",
          browserURL: process.env.EXPLORER_URL_DEV || "",
        },
      },
      {
        network: "prodnet",
        chainId: 11110,
        urls: {
          apiURL: process.env.EXPLORER_API_PROD || "",
          browserURL: process.env.EXPLORER_URL_PROD || "",
        },
      },
    ],
  },
};

export default config;
