<img src="./public/images/DeSo Banner.png"  />

## What is DeSo?
It's a decentralized social platform where users can post their thoughts and images and mint them into NFTs. Built using Gun JS for the decentralized database/authetication and Solidity for the NFT minting smart contracts. The smart contract was then deployed temporarily on the Ropsten, Rinkeby and Polygon testnet.

## How To Run with References

<details>
<summary>What to Run?</summary>

## What to Run?
- Run command to compile the smart contracts into ABIs
    `npx hardhat compile`
- Run command when???
    `npx hardhat test`
- https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html
    Follow the necessary steps from the link above.
    Run command after deploying the smart contract onto a network (`rinkeby` in this case, `0x5a951603fDaaBab6e9bC9149c2eCc15b1917E96c` is contract address)
    `npx hardhat verify --network rinkeby 0x5a951603fDaaBab6e9bC9149c2eCc15b1917E96c ""`
- Run command to deploy the smart contract to the network (`rinkeby` in this case). The network name, URL and account can be changed in the `hardhat.config` file.
    `npx hardhat run scripts/sample-script.js --network rinkeby`
</details>

<details>
<summary>Links</summary>

## Links
- Use link below to validate the NFT with the contract adress `0x5a951603fDaaBab6e9bC9149c2eCc15b1917E96c` and tokenID `5`
    https://testnets-api.opensea.io/asset/0x5a951603fdaabab6e9bc9149c2ecc15b1917e96c/5/validate/
    https://testnets.opensea.io/niknair31898
- Use link below to see transactions related to your contract `0x5a951603fDaaBab6e9bC9149c2eCc15b1917E96c`
    https://rinkeby.etherscan.io/token/0x5a951603fdaabab6e9bc9149c2ecc15b1917e96c
    https://mumbai.polygonscan.com/address/0x5a951603fdaabab6e9bc9149c2ecc15b1917e96c
- Use link below to test stuff
    https://admin.moralis.io/web3Api
- Fleek for deployment
    https://app.fleek.co/#/sites/dry-resonance-3793/deploys?accountId=cc4c5575-5a65-43f7-961f-d386a9dbcf14
- Alchemy for smart contract deployment to network
    https://dashboard.alchemyapi.io/
- Pinata for file distribution
    https://app.pinata.cloud/pinmanager
</details>

## To-Dos
<details>
<summary>To-Dos</summary>

## To-Dos
* General
    - [ ] Ensure each client is able to connect to relay on Heroku
    - [ ] Add a link to view the NFT on OpenSea
    - [ ] Add a way to link existing NFTs into a post
* Posts
    - [ ] Commenting
        - [ ] Need to include nested comments
    - [ ] Deleting
        - [ ] Include a group consensus mechanism to delete posts if flagged by enough users
            - [ ] While adding to reportcount consider the user's trust status to influence reportcount weight
            - [ ] Remove the post automatically if the report count is X% of the total interactions on the post (including likecount, commentcount etc.)
            - [ ] Calculate trust score for each user on each interaction and give priority to those in the top 80%th
* Login Component
    - [ ] Can't seem to generate duplicate users with the same username so just ensure that that's the case
* NFT
	- [ ] Update the smart contract to make the paytomint cost flexible (ALSO MAKE IT SO YOU GET PAYED ON PAYTOMINT COMPLETING)
	- [ ] See if to include additional data in metadata and if you can write other data into blockchain
* Completed
    - [x] Change NFT post styling to make interactions more visible
    - [x] Check why text-only NFT is including an image
    - [x] Instead of encrypting only the post text maybe encrypt the whole post?
    - [x] Fix the sorting order of the posts (Doesn't work sometimes?)
    - [x] Allow for comment deletion
    - [x] Search for all of a User's posts and then filter depending on user's public key
    - [x] Fix how to pull the IPFS hash / API avatar from the data
    - [x] Check out below link to see potential APIs that can be used to convert text-only posts into images
        https://github.com/petersolopov/carbonara
        https://github.com/cyberboysumanjay/Carbon-API
    - [x] Check out below link to see how to deploy the site on IPFS
        https://medium.com/ethereum-developers/the-ultimate-end-to-end-tutorial-to-create-and-deploy-a-fully-descentralized-dapp-in-ethereum-18f0cf6d7e0e
    - [x] Create a page that makes individual user's content accessible
    - [x] Maybe use the common User page for the curr User too just including an 'Edit' button
    - [x] Figure out better way to route the screens
    - [x] Streamline how the flow works on sign out and sending to '/' path
    - [x] Allow removal of pfp
    - [x] Allow upload of new pfp
    - [x] While the post data gets removed from GUN peers there may still remain images on Pinata
        -  [x] Kinda fixed it by getting an unpin function built on API. Check why it isn't working.
    - [x] Show react toast to confirm the edits were completed
    - [x] Also fix how the thing loads at the bottom of the feed instead of top
    - [x] Find a way to upload text-only posts as NFT (Maybe by using an API to format the text into a picture?)
    - [x] Include additional data like user's name, email-id and bio. (Make it editable)
    - [x] Check why SCSS mixins aren't working in Popups
    - [x] Liking
        - [x] Also allow unliking
        - [x] Need to also include the the public key of the user that liked the post and use that to prevent multi liking
        - [x] Like count increment works
    - [x] Put delete and share buttons into a popup menu
	- [x] Check why NFT's images aren't loading on MetaMask/OpenSea
	- [x] Setup meta data sctructure according to OpenSea guidelines
    - [x] Include MetaMask wallet login to allow for NFT stuff
    - [x] Close PostModal when post is pushed
    - [x] Include basic CRUD operations (maybe no updating since Twitter doesn;t either lmao) 
    - [x] Fixed Create and put data into better format
    - [x] Reading data correctly
    - [x] Can Delete posts
    - [x] Ignoring update for now
    - [x] Use IPFS for PFP/Image uploads?
    - [x] Fix the broken initials problem
    - [x] Kinda shifted from chat to Twitter feed-ish
    - [x] Include user's pub key in the post along with alias
    - [x] Fix the posts so that they scroll within the div
</details>