import React, {useEffect, useState, useReducer, useRef} from 'react';
import { ethers } from 'ethers';
import './MintModal.scss';

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
            <button className="connect_button" onClick={connectToMetamask}>{(connectedtometamask ? 'Wallet Connected!' : 'Connect to MetaMask')}</button>
            <button className="balance_button" onClick={getBalance}>{(!balance ? 'Show My Balance':'Your Balance: '+balance)}</button>
        </div>
    );
}

export default MintModal;