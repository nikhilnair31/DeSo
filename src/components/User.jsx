import React, {useEffect, useState, useReducer, useRef} from 'react';
import { Link } from "react-router-dom";
import { ethers } from 'ethers';
import './User.scss';

const User = (props) => {
    const [balance, setBalance] = useState();

    const getBalance = async () => {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(balance));
    };

    useEffect(() => { 
    }, []);

    return (
        <div className="home">
            <p>User</p>
            <Link to="/">Home</Link>
        </div>
    );
}

export default User;