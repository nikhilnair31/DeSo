import React, { useRef } from 'react';
import Popup from 'reactjs-popup';
import MintModal from './MintModal';
import './PostModal.scss';

const PostModal = (props) => {
    const inputElement = useRef();

    const pushPostbuttonClicked = (isnftminted) => {
        console.log('pushPostbuttonClicked - ', isnftminted);
        props.sendOutPost(isnftminted);
        props.setnewPostText('');
        props.close();
    };
    function handleSubmit(event) {
        event.preventDefault();
        console.log(`Selected file - ${inputElement.current.files[0].name}`);
        props.captureFile(event, inputElement.current.files[0].name);
    }
    function closePostModal() {
        console.log('closePostModal');
        props.setfile();
        props.setnewPostText('');
        props.close();
    }

    return (
        <div className="post_modal">
            {/* <button className="close" onClick={closePostModal}>&times;</button> */}
            <div className="header"> What do you wish to post? </div>
            <div className="content">
                Type it out or upload it!
            </div>
            <input className="post_input" type="text" placeholder="Type a post..." value={props.newPostText} onChange={e => props.setnewPostText(e.target.value)} maxLength={100} />
            
            <input type="file" className="post_attach_button" ref={inputElement} onChange ={handleSubmit} />

            {/* <div className="box">
                <input type="file" className="inputfile inputfile-1" onChange ={props.captureFile} />
                <label htmlFor="file-1"> <span>Choose a file..</span> </label>
            </div> */}
            
            <button className="button post_post_button" type="submit" disabled={((!props.newPostText) ? true: false)} onClick ={()=>pushPostbuttonClicked(false)}>Post</button>
            <Popup trigger={<button className="button mint_button" disabled={((!props.file) ? true: false)} > Mint and Post </button>} modal nested>
                { close => (<MintModal close={close} currusername={props.currusername} file={props.file} filename={props.filename} setisnftflag={props.setisnftflag} newPostText={props.newPostText} pushPostbuttonClicked={pushPostbuttonClicked} />) }
            </Popup>
            <button className="button cancel_button" onClick ={closePostModal}>Cancel</button>
        </div>
    );
}

export default PostModal;