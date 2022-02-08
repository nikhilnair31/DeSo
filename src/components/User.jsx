import React, { useEffect, useState, useRef } from 'react';
import { useNavigate , useLocation } from "react-router-dom";
import { db } from '../helpers/user'
import { user } from '../helpers/user'
import { ethers } from 'ethers';
import { pinFileToIPFS } from '../helpers/pinata'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './User.scss';

var match = {
    // lexical queries are kind of like a limited RegEx or Glob.
    '.': {
    // property selector
    '>': new Date(+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(), // find any indexed property larger ~3 hours ago
    },
    '-': 1, // filter in reverse
};
let imagebasedomains = ['https://ipfs.io/ipfs/', 'https://gateway.pinata.cloud/ipfs']

const User = (props) => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const inputElement = useRef();
    const [isHovered, setHover] = useState(false);
    const [connectedtometamask, setconnectedtometamask] = useState(false);
    const [ineditingmode, setineditingmode] = useState(false);
    const [avatarurl, setavatarurl] = useState(`https://avatars.dicebear.com/api/big-ears-neutral/${state.currusername}.svg`);
    const [fulluserdata, setfulluserdata] = useState({});
    const [fullname, setfullname] = useState('');
    const [email, setemail] = useState('');
    const [bio, setbio] = useState('');
    const [balance, setBalance] = useState('0');

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
    function signOut() {
        user.leave();
        navigate('/LogIn');
    }
    function uploadNewPFP(event) {
        event.preventDefault();
        console.log(`Selected file - ${inputElement.current.files[0].name}`);

        pinFileToIPFS(inputElement.current.files[0]).then( async (resp) => {
            console.log('resp: ', resp);
            let respcid = resp.IpfsHash ? resp.IpfsHash : '';
            console.log('respcid: ', respcid);

            const users = db.get('users');
            const curruser = db.get('curruser'+props.userpub);
            curruser.put({
                pfpcid: respcid
            });
            users.set(curruser);
            toast.success('Profile picture updated!');
        });
    }
    function editOnOff() {
        console.log('editonoff');

        setineditingmode(!ineditingmode);
        if(fulluserdata) {
            setfullname(fulluserdata.userfullname);
            setemail(fulluserdata.useremail);
            setbio(fulluserdata.userbio);
        }
    }
    function saveEdits() {
        console.log('saveedits');

        let data = {
            userpub: props.userpub, 
            useralias: props.currusername, 
            userfullname: fullname, 
            useremail: email, 
            userbio: bio, 
        }
        const users = db.get('users');
        const curruser = db.get('curruser'+props.userpub);
        curruser.put(data);
        users.set(curruser);
        setfulluserdata(data);
        setineditingmode(!ineditingmode);
        toast.success('Edits saved!');
    }
    function removePFP() {
        console.log('removepfp');

        const users = db.get('users');
        const curruser = db.get('curruser'+props.userpub);
        curruser.put({pfpcid: null});
        users.set(curruser);
        let fulluserdatanew = fulluserdata;
        fulluserdatanew['pfpcid'] = null;
        setfulluserdata(fulluserdatanew);
        setineditingmode(!ineditingmode);
        toast.success('removepfp!');
    }
    function backToHome() {
        navigate('/Home');
    }

    useEffect(() => { 
        // console.log('user useEffect props: ', props, ' - state: ', state , ' - user.is.pub: ', user.is.pub );
        if(state.userpub === user.is.pub) {
            if(connectedtometamask) getBalance();
            else connectToMetamask();

            user.get('pub').once(curruserpub => {
                // console.log('curruserpub: ', curruserpub);
                const users = db.get('users');
                users.map(match).once(async (data, id) => {
                    if(data.userpub === curruserpub){
                        // console.log('id: ', id, ' - data: ', data);
                        setfulluserdata(data);
                        if(data.pfpcid!==undefined && data.pfpcid!==null) {
                            // console.log('data.pfpcid!==undefined');
                            setavatarurl(imagebasedomains[0]+data.pfpcid);
                        }
                    }
                });
            });
        }
        else {
            const users = db.get('users').get('curruser'+state.userpub);
            users.once(async (data, id) => {
                // console.log('id: ', id, ' - data: ', data);
                if(data.userpub === state.userpub){
                    setfulluserdata(data);
                    if(data.pfpcid!==undefined && data.pfpcid!==null) {
                        // console.log('data.pfpcid!==undefined');
                        setavatarurl(imagebasedomains[0]+data.pfpcid);
                    }
                }
            });
        }
    }, [connectedtometamask]);

    if(state.userpub === user.is.pub) {
        return (
            <div className="userpage">
                <header className="header">
                    <i className="fa fa-chevron-left backbutton" onClick={backToHome} ></i>
                    <p className='title' >Profile</p>
                </header>
                <div className="userdata"> 
                    <div className="container" onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} >
                    {/* src={imagebasedomains[0]+props.post.imagecid}  */}
                        <img src={avatarurl} alt="avatar" width={100} className='userpfp' />
                        {isHovered &&
                        <div className="middle">
                            <label htmlFor="fileInput"> 
                                <i type="file" className="pfpupdate far fa-edit" ></i>
                            </label>
                            <input id="fileInput" type="file" ref={inputElement} onChange ={uploadNewPFP} />
                        </div>}
                    </div>

                    <p className='username' >{'@'+fulluserdata.useralias}</p>
                    { fulluserdata && <p className='fullname' >{fulluserdata.userfullname}</p> }
                    { fulluserdata && <p className='email' >{fulluserdata.useremail}</p> }
                    { fulluserdata && <p className='bio' >{fulluserdata.userbio}</p> }
                    <button className="button edit_button" onClick={editOnOff} >Edit</button>

                    { ineditingmode && <button className="button remove_pfp_button" onClick={removePFP} >Remove Profile Picture</button> }
                    { ineditingmode && <input className="edit_input" type="text" placeholder="Full Name..." value={fullname} onChange={e => setfullname(e.target.value)} /> }
                    { ineditingmode && <input className="edit_input" type="text" placeholder="Email..." value={email} onChange={e => setemail(e.target.value)} /> }
                    { ineditingmode && <input className="edit_input" type="text" placeholder="Bio..." value={bio} onChange={e => setbio(e.target.value)} /> }
                    { ineditingmode && <button className="button savedits_button" onClick={saveEdits} >Save</button> }

                    { !ineditingmode && <button className="button signout_button" onClick={signOut} >Sign Out</button> }
                    { !ineditingmode && <button className={'button connect_button '+(connectedtometamask ? 'connected' : '')} type="submit" disabled={connectedtometamask} onClick={connectToMetamask}>{(connectedtometamask ? 'Wallet Connected!\nBalance: '+balance.slice(0, 10) : 'Connect to MetaMask')}</button> }
                </div>
                <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss/>
            </div>
        )
    }
    else {
        return (
            <div className="userpage">
                <header className="header">
                    <i className="fa fa-chevron-left backbutton" onClick={backToHome} ></i>
                    <p className='title' >Profile</p>
                </header>
                <div className="userdata"> 
                    <div className="container" onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} >
                    {/* src={imagebasedomains[0]+props.post.imagecid}  */}
                        <img src={avatarurl} alt="avatar" width={100} className='userpfp' />
                        {isHovered &&
                        <div className="middle">
                            <label htmlFor="fileInput"> 
                                <i type="file" className="pfpupdate far fa-edit" ></i>
                            </label>
                            <input id="fileInput" type="file" ref={inputElement} onChange ={uploadNewPFP} />
                        </div>}
                    </div>

                    <p className='username' >{'@'+fulluserdata.useralias}</p>
                    { fulluserdata && <p className='fullname' >{fulluserdata.userfullname}</p> }
                    { fulluserdata && <p className='email' >{fulluserdata.useremail}</p> }
                    { fulluserdata && <p className='bio' >{fulluserdata.userbio}</p> }
                </div>
                <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss/>
            </div>
        )
    }
}

export default User;