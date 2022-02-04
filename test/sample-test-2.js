const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", function () {
    it("Should mint and transfer an NFT to someone", async function () {
        const PostMint = await ethers.getContractFactory("PostMint");
        const postMint = await PostMint.deploy();
        await postMint.deployed();

        const recipient = '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199';
        const metadataURI = 'cid/test.png';

        let balance = await postMint.balanceOf(recipient);
        expect(balance).to.equal(0);

        const newlyMintedToken = await postMint.payToMint(recipient, metadataURI, { value: ethers.utils.parseEther('0.05') });

        // wait until the transaction is mined
        await newlyMintedToken.wait();

        balance = await postMint.balanceOf(recipient)
        expect(balance).to.equal(1);

        expect(await postMint.isContentOwned(metadataURI)).to.equal(true);
        const newlyMintedToken2 = await postMint.payToMint(recipient, 'foo', { value: ethers.utils.parseEther('0.05') });
    });
});