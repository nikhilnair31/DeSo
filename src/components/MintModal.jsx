import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { pinFileToIPFS, pinJSONToIPFS } from '../helpers/pinata'
import PostMint from '../artifacts/contracts/PostMint.sol/PostMint.json';
import './MintModal.scss';

const contractAddress = '0x5a951603fDaaBab6e9bC9149c2eCc15b1917E96c';
// const metadataURI = `QmaCD3cXyHDchNtVdrNmH1RKkB5E9zQyXUngJzBT5qudCt.json`;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, PostMint.abi, signer);

const MintModal = (props) => {
    const [connectedtometamask, setconnectedtometamask] = useState(false);
    const [balance, setBalance] = useState();
    const [metadataURI, setmetadataURI] = useState('');

    const connectToMetamask = async () => {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if(account){
            setconnectedtometamask(true);
        }
    };
    const getBalance = async () => {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(balance));
    };
    const mintToken = async () => {
        pinFileToIPFS(props.file).then( async (resp) => {
            console.log('resp: ', resp);
            let respcid = resp.IpfsHash ? resp.IpfsHash : '';
            console.log('respcid: ', respcid);
            
            let metadatajson = {
                "image": `ipfs://${respcid}/${props.file}`,
                "tokenId": 6,
                "name": "PostMint - Test 6",
                "description": "For OpenSea"
            }

            pinJSONToIPFS(metadatajson).then( async (resp) => {
                console.log('resp: ', resp);
                let respcid = resp.IpfsHash ? resp.IpfsHash+'.json' : '';
                console.log('respcid: ', respcid);
                
                setmetadataURI(respcid);

                const signeraddr = await signer.getAddress();
                console.log("signeraddr:", signeraddr);

                const result = await contract.payToMint(signeraddr, respcid, {
                    value: ethers.utils.parseEther('0.01'),
                });
            
                await result.wait();
                getMintedStatus();
            });
        });

        // const signeraddr = await signer.getAddress();
        // console.log("signeraddr:", signeraddr);

        // const result = await contract.payToMint(signeraddr, metadataURI, {
        //     value: ethers.utils.parseEther('0.01'),
        // });
    
        // await result.wait();
        // getMintedStatus();
        // getCount();
    };
    const getMintedStatus = async () => {
        const result = await contract.isContentOwned(metadataURI);
        console.log(result)
        props.close();
        // setIsMinted(result);
    };

    useEffect(() => { 
        connectToMetamask();
    }, []);

    return (
        <div className="mint_modal">
            <button className="close" onClick={props.close}>&times;</button>
            <div className="header"> Minting And Posting </div>
            <div className="content">
                The following is NFT related stuff.
            </div>
            <br />
            {/* <button className="post_post_button" type="submit" disabled={((!props.newPostText || props.file) ? true: false)} onClick ={props.sendOutPost}>Post</button> */}
            <button className="connect_button" type="submit" disabled={connectToMetamask} onClick={connectToMetamask}>{(connectedtometamask ? 'Wallet Connected!' : 'Connect to MetaMask')}</button>
            <button className="balance_button" onClick={getBalance}>{(!balance ? 'Show My Balance':'Your Balance: '+balance)}</button>
            <button className="balance_button" onClick={mintToken}>Mint</button>
        </div>
    );
}

export default MintModal;