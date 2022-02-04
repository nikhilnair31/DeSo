const { expect } = require("chai");
const { ethers } = require("hardhat");

// describe("Greeter", function () {
//     it("Should return the new greeting once it's changed", async function () {
//         const Greeter = await ethers.getContractFactory("Greeter");
//         const greeter = await Greeter.deploy("Hello, world!");
//         await greeter.deployed();

//         expect(await greeter.greet()).to.equal("Hello, world!");

//         const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//         // wait until the transaction is mined
//         await setGreetingTx.wait();

//         expect(await greeter.greet()).to.equal("Hola, mundo!");
//     });
// });

describe("PostMint", function () {
    it("Should mint and transfer an NFT to someone", async function () {
        const PostMint = await ethers.getContractFactory("PostMint");
        const postMint = await PostMint.deploy();
        await postMint.deployed();

        const recipient = '0xdd2fd4581271e230360230f9337d5c0430bf44c0';
        const metadataURI = 'cid/test.png';

        let balance = await postMint.balanceOf(recipient);
        expect(balance).to.equal(0);

        const newlyMintedToken = await postMint.payToMint(recipient, metadataURI, { value: ethers.utils.parseEther('0.1') });

        // wait until the transaction is mined
        await newlyMintedToken.wait();

        balance = await postMint.balanceOf(recipient)
        expect(balance).to.equal(1);

        expect(await postMint.isContentOwned(metadataURI)).to.equal(true);
        const newlyMintedToken2 = await postMint.payToMint(recipient, 'foo', { value: ethers.utils.parseEther('0.1') });
    });
});
