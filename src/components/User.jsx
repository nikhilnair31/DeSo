import React, { useEffect, useState, useRef, useReducer } from 'react';
import { useNavigate , useLocation } from "react-router-dom";
import { db } from '../helpers/user'
import { user } from '../helpers/user'
import { ethers } from 'ethers';
import { pinFileToIPFS } from '../helpers/pinata'
import { ToastContainer, toast } from 'react-toastify';
import { key, imagebasedomains, match } from '../helpers/functions';
import Post from './Post'
import GUN from 'gun';
import Popup from 'reactjs-popup';
import 'react-toastify/dist/ReactToastify.css';
import './User.scss';

const initialState = {
    posts: []
}
function reducer(state, post) {
    // console.log('reducer posts: ', [post, ...state.posts].sort((a, b) => b.posttime - a.posttime));
    return {
        posts: [post, ...state.posts].sort((a, b) => b.posttime - a.posttime)
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
    const [fullname, setfullname] = useState('');
    const [email, setemail] = useState('');
    const [bio, setbio] = useState('');
    const [balance, setBalance] = useState('0');
    const [arrstate, dispatch] = useReducer(reducer, initialState);

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
        navigate('/');
    }
    function uploadNewPFP(event) {
        event.preventDefault();
        // console.log(`Selected file - ${inputElement.current.files[0].name}`);

        pinFileToIPFS(inputElement.current.files[0]).then( async (resp) => {
            // console.log('resp: ', resp);
            let respcid = resp.IpfsHash ? resp.IpfsHash : '';
            // console.log('respcid: ', respcid);

            const users = db.get('users');
            const curruser = db.get('curruser'+state.userpub);
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
            userpub: state.userpub, 
            useralias: state.username, 
            userfullname: fullname, 
            useremail: email, 
            userbio: bio, 
        }
        const users = db.get('users');
        const curruser = db.get('curruser'+state.userpub);
        curruser.put(data);
        users.set(curruser);
        setfulluserdata(data);
        setineditingmode(!ineditingmode);
        toast.success('Edits saved!');
    }
    function removePFP() {
        console.log('removepfp');

        const users = db.get('users');
        const curruser = db.get('curruser'+state.userpub);
        curruser.put({pfpcid: null});
        users.set(curruser);
        let fulluserdatanew = fulluserdata;
        fulluserdatanew['pfpcid'] = null;
        setfulluserdata(fulluserdatanew);
        setineditingmode(!ineditingmode);
        toast.error('removepfp!');
    }
    function backToHome() {
        navigate(-1);
    }

    useEffect(() => { 
        if(state.userpub === user.is.pub) {
            if(connectedtometamask) getBalance();
            else connectToMetamask();
        }
        else {
            setavatarurl(`https://avatars.dicebear.com/api/big-ears-neutral/${state.username}.svg`);
        }
    }, [connectedtometamask]);

    useEffect(() => { 
        console.log('user useEffect state: ', state , ' - user.is.pub: ', user.is.pub );

        const posts = db.get('posts');
        posts.map(match).once(async (data, id) => {
            if (data) {
                // console.log('data: ', data, 'id: ', id);
                var post = {
                    postid: id, 
                    posterpub: data.posterpub, 
                    posteralias: data.posteralias,
                    posttext: await GUN.SEA.decrypt(data.posttext, key) + '',
                    posttime: data.posttime,
                    imagecid: data.imagecid,
                    nftflag: data.nftflag,
                    likecount: data.likecount,
                    likeduserpubs: data.likeduserpubs, 
                    commentcount: data.commentcount,
                    comments: data.comments
                };
                console.log('post.posttext: ', post.posttext, ' - data.posterpub: ', data.posterpub, ' - state.userpub: ', state.userpub);
                if(data.posterpub === state.userpub) {
                    // console.log('dispatch');
                    dispatch(post);
                }
            }
        });

        if(state.userpub === user.is.pub) {
            user.get('pub').once(curruserpub => {
                // console.log('curruserpub: ', curruserpub);
                const users = db.get('users');
                users.map(match).once(async (data, id) => {
                    if(data.userpub === curruserpub){
                        // console.log('id: ', id, ' - data: ', data);
                        setfulluserdata(data);
                        if(data.pfpcid!==undefined && data.pfpcid!==null) {
                            // console.log('user pub data: ', data, ' - state: ', state , ' - curruserpub: ', curruserpub );
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
    }, []);

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
                        <img src={avatarurl} alt="avatar" width={200} className='userpfp' />
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

                <p className='posts_title' >Posts</p>
                <div className="user_home">
                    <div className="user_container">
                        <div className="user_posts_container">
                            {
                                arrstate.posts.map((post, index) => (
                                    <Post key={index} post={post} curruseralias={state.useralias} />
                                ))
                            }
                        </div>
                    </div>
                    <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss/>
                </div>
                {/* <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss/> */}
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
                        <img src={avatarurl} alt="avatar" width={200} className='userpfp' />
                        { isHovered &&
                        <div className="middle">
                            <label htmlFor="fileInput"> 
                                <i type="file" className="pfpupdate far fa-edit" ></i>
                            </label>
                            <input id="fileInput" type="file" ref={inputElement} onChange ={uploadNewPFP} />
                        </div> }
                    </div>

                    <p className='username' >{'@'+fulluserdata.useralias}</p>
                    { fulluserdata && <p className='fullname' >{fulluserdata.userfullname}</p> }
                    { fulluserdata && <p className='email' >{fulluserdata.useremail}</p> }
                    { fulluserdata && <p className='bio' >{fulluserdata.userbio}</p> }
                </div>
                
                { arrstate &&
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
                    {/* <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss/> */}
                </div> }
            </div>
        )
    }
}

export default User;