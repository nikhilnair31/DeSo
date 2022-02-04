import React, {useEffect, useState, useReducer, useRef} from 'react';
import { ethers } from 'ethers';
import Popup from 'reactjs-popup';
import MintModal from './MintModal';
import './PostModal.scss';

const PostModal = (props) => {
    const [balance, setBalance] = useState();

    const pushPostbuttonClicked = () => {
        props.sendOutPost();
        props.close();
    };

    useEffect(() => { 
    }, []);

    return (
        <div className="post_modal">
            <button className="close" onClick={props.close}>&times;</button>
            <div className="header"> What do you wish to post? </div>
            <div className="content">
                Type it out or upload it!
            </div>
            <input className="post_input" type="text" placeholder="Type a post..." value={props.newPostText} onChange={e => props.setnewPostText(e.target.value)} maxLength={100} />
            
            <input type="file" className="post_attach_button" onChange ={props.captureFile} />

            {/* <div className="box">
                <input type="file" className="inputfile inputfile-1" onChange ={props.captureFile} />
                <label htmlFor="file-1"> <span>Choose a file..</span> </label>
            </div> */}
            
            <button className="post_post_button" type="submit" disabled={((!props.newPostText || !props.file) ? true: false)} onClick ={pushPostbuttonClicked}>Post</button>
            
            <Popup trigger={<button className="mint_button" disabled={((!props.newPostText || !props.file) ? true: false)} > Mint and Post </button>} modal nested>
            { close => (<MintModal close={close} file={props.file} />) }
            </Popup>
        </div>
    );
}

export default PostModal;