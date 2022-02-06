import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { pinFileToIPFS, pinJSONToIPFS } from '../helpers/pinata'
import PostMint from 'src/artifacts/contracts/PostMint.sol/PostMint.json';
import './MintModal.scss';

const contractAddress = '0x5a951603fDaaBab6e9bC9149c2eCc15b1917E96c';
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, PostMint.abi, signer);

const MintModal = (props) => {
    const [connectedtometamask, setconnectedtometamask] = useState(false);
    const [balance, setBalance] = useState();

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
            // console.log('respcid: ', respcid);
            
            let metadatajson = {
                'pinataMetadata': {
                    'name': `metadata-${props.filename}.json`
                },
                /* The contents of the "pinataContent" object will be added to IPFS */
                /* The hash provided back will only represent the JSON contained in this object */
                /* The JSON the returned hash links to will NOT contain the "pinataMetadata" object above */
                /* The image URI include only the IPFS hash returned for the uploaded image */
                'pinataContent': {
                    "image": `ipfs://${respcid}`,
                    "name": `${props.newPostText}`,
                    "description": `This is the NFT of the post made by ${props.currusername} on DeSo.`
                }
            }

            pinJSONToIPFS(metadatajson).then( async (resp) => {
                console.log('resp: ', resp);
                let respcid = resp.IpfsHash ? resp.IpfsHash : '';
                // console.log('respcid: ', respcid);

                const signeraddr = await signer.getAddress();
                console.log("signeraddr:", signeraddr);

                const result = await contract.payToMint(signeraddr, respcid, {
                    value: ethers.utils.parseEther('0.01'),
                });
            
                await result.wait();
                getMintedStatus(respcid);

                console.log('pinJSONToIPFS - ', true);
                props.pushPostbuttonClicked(true);
                // getCount();
            });
        });
    };
    const getMintedStatus = async (respmetadataURI) => {
        const result = await contract.isContentOwned(respmetadataURI);
        console.log(result)
        props.close();
        // setIsMinted(result);
    };

    useEffect(() => { 
        if(connectedtometamask) getBalance();
        else connectToMetamask();
    }, [connectedtometamask]);

    return (
        <div className="mint_modal">
            <button className="close" onClick={props.close}>&times;</button>
            <div className="header"> Minting And Posting </div>
            <div className="content"> The following is NFT related stuff. </div>
            <br />
            <button className={"connect_button "+(connectedtometamask ? 'connected' : '')} type="submit" disabled={!connectToMetamask} onClick={connectToMetamask} >{(connectedtometamask ? 'Wallet Connected! Balance: '+balance : 'Connect to MetaMask')}</button>
            <button className="balance_button" onClick={mintToken}>Mint</button>
        </div>
    );
}

export default MintModal;