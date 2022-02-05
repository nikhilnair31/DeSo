import React, {useEffect, useState, useReducer, useRef} from 'react';
import { Link, useNavigate , useLocation } from "react-router-dom";
import {user} from '../helpers/user'
import { ethers } from 'ethers';
import './User.scss';

const User = (props) => {
    const { state } = useLocation();
    const [connectedtometamask, setconnectedtometamask] = useState(false);
    const [balance, setBalance] = useState();
    
    const navigate = useNavigate();

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
    function signout() {
        user.leave();
        // state.setcurrusername('');
        navigate('/LogIn');
    }
    function backtohome() {
        navigate('/');
    }

    // useEffect(() => { 
    //     console.log('state: ', state);
    //     if(state.currusername===null)
    //         navigate('/');
    // }, []);

    return (
        <div className="userpage">
            <header className="header">
                <i className="fa fa-chevron-left backbutton" onClick={backtohome}></i>
                {/* <span className='title' >{state.currusername}</span> */}
            </header>
            <header className="userdata">
                <img src={`https://avatars.dicebear.com/api/initials/${state.currusername}.svg`} alt="avatar" width={150} className='userpfp' /> 
                <p className='username' >{state.currusername}</p>
                <button className="signout_button" onClick={signout} >Sign Out</button>
                <button className="connect_button" type="submit" disabled={connectToMetamask} onClick={connectToMetamask}>{(!connectedtometamask ? 'Wallet Connected!' : 'Connect to MetaMask')}</button>
                <button className="balance_button" onClick={getBalance}>{(!balance ? 'Show My Balance':'Your Balance:\n'+balance)}</button>
                {/* <Link to="/" >Home</Link> */}
            </header>
        </div>
    )
}

export default User;