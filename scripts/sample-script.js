const hre = require("hardhat");

async function main() {
    const PostMint = await ethers.getContractFactory("PostMint");
    const postMint = await PostMint.deploy();

    await postMint.deployed();

    console.log("My NFT deployed to:", postMint.address);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});