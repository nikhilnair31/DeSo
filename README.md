## DeSo
## To-Do
* General
        - [ ] Fix the sorting order of the posts (Kinda fixed by using reverse column but check why the sort code doesn't work)
    - [ ] Can't seem to generate duplicate users with the same username so just ensure that that's the case
    - [ ] Instead of encrypting only the post text maybe encrypt the whole post?
    - [ ] Include basic CRUD operations (maybe no updating since Twitter doesn;t either lmao) 
        - [x] Fixed Create and put data into better format
        - [x] Reading data correctly
        - [x] Can Delete posts
            - [ ] While the post data gets removed from GUN peers there may still remain images on Pinata
        - [ ] No update yet
    - [ ] Allow upload of new pfp
        - [x] Use IPFS for PFP/Image uploads?
        - [x] Fix the broken initials problem
        - [x] Kinda shifted from chat to Twitter feed-ish
    - [x] Include user's pub key in the post along with alias
    - [x] Fix the posts so that they scroll within the div
* Login Component
    - [ ] Streamline
    - [ ] Include MetaMask wallet login to allow for NFT stuff
* NFT
	- [ ] Figure out how to write smart contract in Solidity 
	- [ ] Deploy on Polygon network
	- [ ] Figure out how to sell the minted NFT on OpenSea 