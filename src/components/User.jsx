import React, { useEffect, useState } from 'react';
import { useNavigate , useLocation } from "react-router-dom";
import { db } from '../helpers/user'
import { user } from '../helpers/user'
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import './User.scss';

const User = () => {
    const { state } = useLocation();
    const [connectedtometamask, setconnectedtometamask] = useState(false);
    const [ineditingmode, setineditingmode] = useState(false);
    const [fulluserdata, setfulluserdata] = useState({});
    const [fullname, setfullname] = useState('');
    const [email, setemail] = useState('');
    const [bio, setbio] = useState('');
    const [balance, setBalance] = useState();
    
    const navigate = useNavigate();

    const connectToMetamask = async () => {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('connectToMetamask account: ', account);
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
        navigate('/');
    }
    function editonoff() {
        console.log('editonoff');
        setineditingmode(!ineditingmode);
        if(fulluserdata) {
            setfullname(fulluserdata.userfullname);
            setemail(fulluserdata.useremail);
            setbio(fulluserdata.userbio);
        }
    }
    function saveedits() {
        console.log('saveedits');
        const users = db.get('users');
        const curruser = db.get('curruser'+state.userpub);
        curruser.put({ 
            userpub: state.userpub, 
            useralias: state.currusername, 
            userfullname: fullname, 
            useremail: email, 
            userbio: bio, 
        });
        users.set(curruser);
        setineditingmode(!ineditingmode);
        toast.success('🦄 Wow so easy!', {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
    function getfulluserdata() {
        console.log('getfulluserdata');
        var match = {
            // lexical queries are kind of like a limited RegEx or Glob.
            '.': {
            // property selector
            '>': new Date(+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(), // find any indexed property larger ~3 hours ago
            },
            '-': 1, // filter in reverse
        };
        const users = db.get('users');
        users.map(match).once(async (data, id) => {
            if(data.userpub === state.userpub){
                console.log('getfulluserdata id: ', id, ' - data: ', data);
                setfulluserdata(data);
            }
        });
    }
    function backtohome() {
        navigate('/');
    }

    useEffect(() => { 
        console.log('state: ', state);

        getfulluserdata();

        if(connectedtometamask) getBalance();
        else connectToMetamask();
    }, [connectedtometamask]);

    return (
        <div className="userpage">
            <header className="header">
                <i className="fa fa-chevron-left backbutton" onClick={backtohome}></i>
            </header>
            <div className="userdata">
                <img src={`https://avatars.dicebear.com/api/big-ears-neutral/${state.currusername}.svg`} alt="avatar" width={150} className='userpfp' /> 
                <p className='username' >{state.currusername}</p>
                {/* { fulluserdata && <p className='username' >{fulluserdata.userpub}</p> } */}
                { fulluserdata && <p className='username' >{fulluserdata.userfullname}</p> }
                { fulluserdata && <p className='username' >{fulluserdata.useremail}</p> }
                { fulluserdata && <p className='username' >{fulluserdata.userbio}</p> }
                <button className="button edit_button" onClick={editonoff} >Edit</button>
                {
                    ineditingmode &&
                    <input className="edit_input" type="text" placeholder="Full Name..." value={fullname} onChange={e => setfullname(e.target.value)} />
                }
                {
                    ineditingmode &&
                    <input className="edit_input" type="text" placeholder="Email..." value={email} onChange={e => setemail(e.target.value)} />
                }
                {
                    ineditingmode &&
                    <input className="edit_input" type="text" placeholder="Bio..." value={bio} onChange={e => setbio(e.target.value)} />
                }
                { ineditingmode && <button className="button savedits_button" onClick={saveedits} >Save</button> }
                { !ineditingmode && <button className="button signout_button" onClick={signout} >Sign Out</button> }
                { !ineditingmode && <button className={'button connect_button '+(connectedtometamask ? 'connected' : '')} type="submit" disabled={connectedtometamask} onClick={connectToMetamask}>{(connectedtometamask ? 'Wallet Connected!' : 'Connect to MetaMask')}</button> }
                {/* <button className="button balance_button" onClick={getBalance}>{(!balance ? 'Show My Balance' : 'Wallet Balance: '+balance.slice(0, 13))}</button> */}
            </div>
            <ToastContainer position="bottom-left" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
        </div>
    )
}

export default User;