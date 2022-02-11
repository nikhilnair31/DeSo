import React, { useEffect, useState, useRef, useReducer } from 'react';
import { useNavigate , useLocation } from "react-router-dom";
import { ethers } from 'ethers';
import { db, user } from '../helpers/user'
import { pinFileToIPFS } from '../helpers/pinata'
import { ToastContainer, toast } from 'react-toastify';
import { encryption_key, imagebasedomains, match } from '../helpers/functions';
import Post from './Post'
import GUN from 'gun';
import 'react-toastify/dist/ReactToastify.css';
import './User.scss';

const initialState = {
    posts: []
}
function reducer(state, action) {
    switch (action.type) {
        case 'append':
            return { posts: [action.payload, ...state.posts] }
        case 'reset':
            return { posts: [] };
    }
}

const User = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const inputElement = useRef();
    const [isHovered, setHover] = useState(false);
    const [connectedtometamask, setconnectedtometamask] = useState(false);
    const [ineditingmode, setineditingmode] = useState(false);
    const [avatarurl, setavatarurl] = useState(`https://avatars.dicebear.com/api/big-ears-neutral/${state.username}.svg`);
    const [fulluserdata, setfulluserdata] = useState({});
    const [alias, setalias] = useState(state.username);
    const [fullname, setfullname] = useState('');
    const [email, setemail] = useState('');
    const [bio, setbio] = useState('');
    const [userpub, setuserpub] = useState(user.is.pub);
    const [pfpcid, setpfpcid] = useState('');
    const [balance, setBalance] = useState('0');
    const [arrstate, dispatch] = useReducer(reducer, initialState);

    async function connectToMetamask() {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // console.log('connectToMetamask account: ', account);
        if(account){
            setconnectedtometamask(true);
        }
    }
    async function getBalance() {
        console.log('getBalance');

        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(balance));
    }
    async function saveEdits() {
        console.log('saveedits');
        toast.success('Edits saved!');

        let data = {
            userpub: await GUN.SEA.encrypt(userpub, encryption_key), 
            useralias: await GUN.SEA.encrypt(alias, encryption_key), 
            userfullname: await GUN.SEA.encrypt(fullname, encryption_key), 
            useremail:  await GUN.SEA.encrypt(email, encryption_key), 
            userbio:  await GUN.SEA.encrypt(bio, encryption_key), 
            pfpcid:  await GUN.SEA.encrypt(pfpcid, encryption_key), 
        }
        console.log('data: ', data);
        const curruser = db.get('curruser'+userpub);
        curruser.put(data);
        const users = db.get('users');
        users.set(curruser);

        // setfulluserdata(data);
        setineditingmode(!ineditingmode);
    }
    function getUsersPosts() {
        console.log('getUsersPosts');
        
        const posts = db.get('posts');
        posts.map(match).once(async (data, id) => {
            if (data) {
                var post = {
                    postid: id, 
                    posterpub: await GUN.SEA.decrypt(data.posterpub, encryption_key), 
                    posteralias: await GUN.SEA.decrypt(data.posteralias, encryption_key),
                    posttext: await GUN.SEA.decrypt(data.posttext, encryption_key) + '',
                    posttime: await GUN.SEA.decrypt(data.posttime, encryption_key),
                    imagecid: await GUN.SEA.decrypt(data.imagecid, encryption_key),
                    nftflag: await GUN.SEA.decrypt(data.nftflag, encryption_key),
                    likecount: await GUN.SEA.decrypt(data.likecount, encryption_key),
                    likeduserpubs: await GUN.SEA.decrypt(data.likeduserpubs, encryption_key), 
                    commentcount: await GUN.SEA.decrypt(data.commentcount, encryption_key),
                    reportcount: await GUN.SEA.decrypt(data.reportcount , encryption_key)
                };
                if(post.posterpub === state.userpub) {
                    dispatch({ type: 'append', payload: post })
                }
            }
        });
    }
    function uploadNewPFP(event) {
        event.preventDefault();

        pinFileToIPFS(inputElement.current.files[0]).then( async (resp) => {
            toast.success('Updated Profile Picture!');

            const decrypted_pfpcid = await GUN.SEA.encrypt(resp.IpfsHash ? resp.IpfsHash : '', encryption_key);
            let data = {
                pfpcid:  decrypted_pfpcid, 
            }
            const curruser = db.get('curruser'+state.userpub);
            curruser.put(data);
            const users = db.get('users');
            users.set(curruser);
            
            setpfpcid(decrypted_pfpcid);
        });
    }
    function editOnOff() {
        console.log('editonoff');
        setineditingmode(!ineditingmode);
    }
    function removePFP() {
        console.log('removepfp');
        toast.error('Removed Profile Picture!');

        const curruser = db.get('curruser'+state.userpub);
        curruser.put({pfpcid: null});
        db.get('users').set(curruser);

        setpfpcid(null);
        setavatarurl(`https://avatars.dicebear.com/api/big-ears-neutral/${alias}.svg`);
        setineditingmode(!ineditingmode);
    }
    function removePostFromArr(removepostid) {
        const newcommentarr = arrstate.posts.filter((post) => post.postid !== removepostid);
        console.log('User arrstate.posts: ', arrstate.posts, ' - removePostFromArr: ', removepostid, ' - newcommentarr: ', newcommentarr);
        dispatch({ type: "reset" });
        newcommentarr.forEach(indivpostelement => {
            dispatch({ type: 'append', payload: indivpostelement })
        });
    }
    function backToHome() {
        navigate(-1);
    }
    function signOut() {
        user.leave();
        navigate('/');
    }
    function getfulluserdata() {
        console.log('getfulluserdata');
        
        if(state.userpub === user.is.pub) {
            const curruser = db.get('curruser'+user.is.pub);
            curruser.once( async (data, id) => {
                // console.log('id: ', id, ' - data: ', data);
                const decrypted_useralias = await GUN.SEA.decrypt(data.useralias, encryption_key);
                const decrypted_bio = await GUN.SEA.decrypt(data.userbio, encryption_key);
                const decrypted_email = await GUN.SEA.decrypt(data.useremail, encryption_key);
                const decrypted_userfullname = await GUN.SEA.decrypt(data.userfullname, encryption_key);
                const decrypted_userpub = await GUN.SEA.decrypt(data.userpub, encryption_key);
                const decrypted_pfpcid = await GUN.SEA.decrypt(data.pfpcid, encryption_key);
                // console.log('decrypted_userpub: ', decrypted_userpub,'decrypted_useralias: ', decrypted_useralias, 'decrypted_pfpcid: ', decrypted_pfpcid, 'decrypted_userfullname: ', decrypted_userfullname);
                if(decrypted_userpub === user.is.pub) {
                    // setfulluserdata(data);
                    setalias(decrypted_useralias);
                    setfullname(decrypted_userfullname);
                    setemail(decrypted_email);
                    setbio(decrypted_bio);
                    setuserpub(decrypted_userpub);
                    setpfpcid(decrypted_pfpcid);
                    setavatarurl((decrypted_pfpcid!==undefined && decrypted_pfpcid!==null && decrypted_pfpcid!=='') ? imagebasedomains[0]+decrypted_pfpcid : `https://avatars.dicebear.com/api/big-ears-neutral/${decrypted_useralias}.svg`);
                }
            });
        }
        else {
            const otheruser = db.get('curruser'+state.userpub);
            otheruser.once(async (data, id) => {
                console.log('id: ', id, ' - data: ', data);
                const decrypted_useralias = await GUN.SEA.decrypt(data.useralias, encryption_key);
                const decrypted_bio = await GUN.SEA.decrypt(data.userbio, encryption_key);
                const decrypted_email = await GUN.SEA.decrypt(data.useremail, encryption_key);
                const decrypted_userfullname = await GUN.SEA.decrypt(data.userfullname, encryption_key);
                const decrypted_userpub = await GUN.SEA.decrypt(data.userpub, encryption_key);
                const decrypted_pfpcid = await GUN.SEA.decrypt(data.pfpcid, encryption_key);
                console.log('decrypted_userpub: ', decrypted_userpub,'decrypted_useralias: ', decrypted_useralias, 'decrypted_pfpcid: ', decrypted_pfpcid, 'decrypted_userfullname: ', decrypted_userfullname);
                if(decrypted_userpub === state.userpub){
                    // setfulluserdata(data);
                    setalias(decrypted_useralias);
                    setfullname(decrypted_userfullname);
                    setemail(decrypted_email);
                    setbio(decrypted_bio);
                    setuserpub(decrypted_userpub);
                    setpfpcid(decrypted_pfpcid);
                    setavatarurl((decrypted_pfpcid!==undefined && decrypted_pfpcid!==null && decrypted_pfpcid!=='') ? imagebasedomains[0]+decrypted_pfpcid : `https://avatars.dicebear.com/api/big-ears-neutral/${decrypted_useralias}.svg`);
                }
            });
        }
    }

    useEffect(() => { 
        getUsersPosts();
        getfulluserdata();
    }, []);
    useEffect(() => { 
        // console.log('User state: ', state);
        if(state.userpub === user.is.pub) {
            if(connectedtometamask) getBalance();
            else connectToMetamask();
        }
    }, [connectedtometamask]);

    if(state.userpub === user.is.pub) {
        return (
            // <div id="body_child">
                <div className="userpage">
                    <header className="header">
                        <i className="fa fa-chevron-left backbutton" onClick={backToHome} ></i>
                        <p className='title' >Profile</p>
                    </header>

                    <div className="userdata"> 
                        <div className="container" onMouseOver={()=>setHover(true)} onMouseLeave={()=>setHover(false)} >
                        {/* src={imagebasedomains[0]+props.post.imagecid}  */}
                            <img src={avatarurl} alt="avatar" width={200} className='userpfp' />
                            {
                                isHovered && 
                                <div className="middle">
                                    <label htmlFor="fileInput"> 
                                        <i type="file" className="pfpupdate fas fa-image" ></i>
                                    </label>
                                    <input id="fileInput" type="file" ref={inputElement} onChange ={uploadNewPFP} />
                                </div>
                            }
                        </div>

                        <p className='username' >{'@'+alias}</p>
                        { fullname && <p className='fullname' >{fullname}</p> }
                        { email && <p className='email' >{email}</p> }
                        { bio && <p className='bio' >{bio}</p> }
                        <button className="button edit_button" onClick={editOnOff} >Edit</button>

                        { ineditingmode && <button className="button remove_pfp_button" onClick={removePFP} >Remove Profile Picture</button> }
                        { ineditingmode && <input className="edit_input" type="text" placeholder="Full Name..." value={fullname} onChange={e => setfullname(e.target.value)} /> }
                        { ineditingmode && <input className="edit_input" type="text" placeholder="Email..." value={email} onChange={e => setemail(e.target.value)} /> }
                        { ineditingmode && <input className="edit_input" type="text" placeholder="Bio..." value={bio} onChange={e => setbio(e.target.value)} /> }
                        { ineditingmode && <button className="button savedits_button" onClick={saveEdits} >Save</button> }

                        { !ineditingmode && <button className="button signout_button" onClick={signOut} >Sign Out</button> }
                        { !ineditingmode && <button className={'button connect_button '+(connectedtometamask ? 'connected' : '')} type="submit" disabled={connectedtometamask} onClick={connectToMetamask}>{(connectedtometamask ? 'Wallet Connected!' : 'Connect to MetaMask')}</button> }
                    </div>

                    {
                        arrstate.posts.length > 0 &&
                        <div className="user_home">
                            <p className='posts_title' >Posts</p>
                            <div className="user_container">
                                <div className="user_posts_container">
                                    {
                                        arrstate.posts.map((post, index) => (
                                            <Post key={index} post={post} curruseralias={state.useralias} removePostFromArr={removePostFromArr} />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    }

                    <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss/>
                </div>
            // </div>
        )
    }
    else {
        return (
            <div id="body_child">
                <div className="userpage">
                    <header className="header">
                        <i className="fa fa-chevron-left backbutton" onClick={backToHome} ></i>
                        <p className='title' >Profile</p>
                    </header>

                    <div className="userdata"> 
                        <div className="container" onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} >
                        {/* src={imagebasedomains[0]+props.post.imagecid}  */}
                            <img src={avatarurl} alt="avatar" width={200} className='userpfp' />
                            { isHovered &&
                            <div className="middle">
                                <label htmlFor="fileInput"> 
                                    <i type="file" className="pfpupdate far fa-edit" ></i>
                                </label>
                                <input id="fileInput" type="file" ref={inputElement} onChange ={uploadNewPFP} />
                            </div> }
                        </div>

                        <p className='username' >{'@'+alias}</p>
                        { fullname && <p className='fullname' >{fullname}</p> }
                        { email && <p className='email' >{email}</p> }
                        { bio && <p className='bio' >{bio}</p> }
                    </div>
                    
                    { 
                        arrstate.posts.length > 0 &&
                        <div className="user_home">
                            <p className='posts_title' >Posts</p>
                            <div className="user_container">
                                <div className="user_posts_container">
                                    {
                                        arrstate.posts.map((post, index) => (
                                            <Post key={index} post={post} curruseralias={state.useralias} />
                                        ))
                                    }
                                </div>
                            </div>
                        </div> 
                    }

                    <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss/>
                </div>
            </div>
        )
    }
}

export default User;