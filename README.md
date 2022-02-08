## DeSo
!<img src="./public/images/Logo.png" width="200" height="200">
<!-- <img src="./images/Objy-InfiniteGraph-doc.png" alt="InfiniteGraph Logo" width="320" /> -->
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
## Link
- Use link below to validate the NFT with the contract adress `0x5a951603fDaaBab6e9bC9149c2eCc15b1917E96c` and tokenID `5`
    https://testnets-api.opensea.io/asset/0x5a951603fdaabab6e9bc9149c2ecc15b1917e96c/5/validate/
- Use link below to see transactions related to your contract `0x5a951603fDaaBab6e9bC9149c2eCc15b1917E96c`
    https://rinkeby.etherscan.io/token/0x5a951603fdaabab6e9bc9149c2ecc15b1917e96c
- Use link below to test stuff
    https://admin.moralis.io/web3Api
## Next Steps
-   [ ] Check out below link to see potential APIs that can be used to convert text-only posts into images
        https://github.com/petersolopov/carbonara
        https://github.com/cyberboysumanjay/Carbon-API
-   [ ] Check out below link to see how to deploy the site on IPFS
        https://medium.com/ethereum-developers/the-ultimate-end-to-end-tutorial-to-create-and-deploy-a-fully-descentralized-dapp-in-ethereum-18f0cf6d7e0e
## To-Do
* Home
    - [ ] Fix the sorting order of the posts (Kinda fixed by using reverse column but check why the sort code doesn't work)
    - [ ] Instead of encrypting only the post text maybe encrypt the whole post?
    - [ ] Get liking, commenting and deleting working
        - [x] Commenting
            - [ ] Include the the public key of the user for comments to?
        - [ ] Deleting
            - [ ] Include a group consensus mechanism to delete posts if flagged by enough users
* Post
    - [ ] Fix how to pull the IPFS hash / API avatar from the data
* User
    - [ ] Search for all of a User's posts and then filter depending on user's public key
* Login Component
    - [ ] Can't seem to generate duplicate users with the same username so just ensure that that's the case
* NFT
	- [ ] See if to include additional data in metadata and if you can write other data into blockchain
* Completed
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