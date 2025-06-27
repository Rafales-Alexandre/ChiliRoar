import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition";
import "@nomicfoundation/hardhat-verify";
import "solidity-coverage";
import { vars } from "hardhat/config";

const PRIVATE_KEY = vars.get("PRIVATE_KEY");
const CHILIZ_TESTNET_RPC = vars.get("CHILIZ_TESTNET_RPC");
const CHILIZ_MAINNET_RPC = vars.get("CHILIZ_MAINNET_RPC");
const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");
const COINMARKETCAP_API_KEY = vars.get("COINMARKETCAP_API_KEY");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true,
    },
    chiliz_testnet: {
      url: CHILIZ_TESTNET_RPC || "https://testnet-rpc.chiliz.com",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 88882,
      gasPrice: 20000000000, // 20 gwei
    },
    chiliz_mainnet: {
      url: CHILIZ_MAINNET_RPC || "https://rpc.chiliz.com",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 88888,
      gasPrice: 20000000000, // 20 gwei
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: {
      chiliz_testnet: ETHERSCAN_API_KEY || "",
      chiliz_mainnet: ETHERSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "chiliz_testnet",
        chainId: 88882,
        urls: {
          apiURL: "https://testnet.chiliscan.com/api",
          browserURL: "https://testnet.chiliscan.com",
        },
      },
      {
        network: "chiliz_mainnet",
        chainId: 88888,
        urls: {
          apiURL: "https://chiliscan.com/api",
          browserURL: "https://chiliscan.com",
        },
      },
    ],
  },
  gasReporter: {
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "CHZ",
    gasPriceApi: "https://api.chiliz.com/gas-price",
    showMethodSig: true,
  },
  mocha: {
    timeout: 40000,
  },
  coverage: {
    reporter: [
      "text",
      "lcov",
      "html",
      "json",
    ],
    exclude: [
      "test/",
      "scripts/",
      "ignition/",
      "coverage/",
      "node_modules/",
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    ignition: "./ignition",
  },
};

export default config; 