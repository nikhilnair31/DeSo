require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();
const { RINKEBY_API_URL, ROPSTEN_API_URL, MATIC_API_URL, PRIVATE_KEY } = process.env;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.8.4",
    defaultNetwork: "matic",
    etherscan: {
        apiKey: "48HRR1Y6NC2DHYG3SCPHQNK6ANKJDXZBQG"
    },
    networks: {
        hardhat: {},
        rinkeby: {
            url: RINKEBY_API_URL,
            accounts: [`0x${PRIVATE_KEY}`]
        },
        ropsten: {
            url: ROPSTEN_API_URL,
            accounts: [`0x${PRIVATE_KEY}`]
        },
        matic: {
            url: MATIC_API_URL,
            accounts: [`0x${PRIVATE_KEY}`]
        }
    },
    paths: {
        artifacts: './src/artifacts',
    },
};
