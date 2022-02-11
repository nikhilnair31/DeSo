import React, { useEffect, useState, useReducer } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { encryption_key, match } from '../helpers/functions';
import { pinFileToIPFS } from '../helpers/pinata'
import { db, user } from '../helpers/user'
import Post from './Post'
import GUN from 'gun';
import Popup from 'reactjs-popup';
import PostModal from './PostModal';
import Header from './Header';
import 'react-toastify/dist/ReactToastify.css';
import './Home.scss';

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

const Home = () => {
    const [newPostText, setnewPostText] = useState('');
    const [currusername, setcurrusername] = useState('')
    const [file, setfile] = useState();
    const [filename, setfilename] = useState();
    const [state, dispatch] = useReducer(reducer, initialState);

    function getCurrUsernameAlias() {
        // console.log('getCurrUsernameAlias');
        user.get('alias').on(currunam => {
            // console.log('currunam: ', currunam);
            setcurrusername(currunam)
        });
    }
    function getAllPostsData() {
        // console.log('getAllPostsData');
        
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
                // console.log('post: ', post);
                dispatch({ type: 'append', payload: post })
            }
        });
    }
    function removePostFromArr(removepostid) {
        const newcommentarr = state.posts.filter((post) => post.postid !== removepostid);
        dispatch({ type: "reset" });
        newcommentarr.forEach(indivpostelement => {
            dispatch({ type: 'append', payload: indivpostelement })
        });
    }
    function attachedFile(event, filename) {
        console.log('attachedFile');

        event.preventDefault();
        const pickedfile = event.target.files[0];
        setfile(pickedfile);
        setfilename(filename);
    }
    async function sendOutPost(isnftminted) {
        // console.log('sendOutPost - ', isnftminted);

        if(file){
            // console.log('file');

            pinFileToIPFS(file).then( async (resp) => {
                // console.log('resp: ', resp);

                if(isnftminted) toast.success('Post Minted!');
                else toast.success('Posted!');
                
                let respcid = resp.IpfsHash ? resp.IpfsHash : '';
                // console.log('respcid: ', respcid);

                const indexkey = new Date().toISOString();
                let data = { 
                    posterpub: await GUN.SEA.encrypt(user.is.pub, encryption_key), 
                    posteralias: await GUN.SEA.encrypt(currusername, encryption_key), 
                    posttext: await GUN.SEA.encrypt(newPostText, encryption_key), 
                    posttime: await GUN.SEA.encrypt(indexkey, encryption_key), 
                    nftflag: await GUN.SEA.encrypt(isnftminted, encryption_key), 
                    imagecid: await GUN.SEA.encrypt(respcid, encryption_key), 
                    likeduserpubs: await GUN.SEA.encrypt('', encryption_key), 
                    likecount: await GUN.SEA.encrypt(0, encryption_key), 
                    commentcount: await GUN.SEA.encrypt(0, encryption_key), 
                    reportcount: await GUN.SEA.encrypt(0, encryption_key), 
                }
                const thispost = db.get('singlepost'+indexkey);
                thispost.put(data);
                db.get('posts').set(thispost);
            });
        }
        else{
            // console.log('!file');
            
            if(isnftminted) toast.success('Post Minted!');
            else toast.success('Posted!');

            const indexkey = new Date().toISOString();
            let data = { 
                posterpub: await GUN.SEA.encrypt(user.is.pub, encryption_key), 
                posteralias: await GUN.SEA.encrypt(currusername, encryption_key), 
                posttext: await GUN.SEA.encrypt(newPostText, encryption_key), 
                posttime: await GUN.SEA.encrypt(indexkey, encryption_key), 
                nftflag: await GUN.SEA.encrypt(isnftminted, encryption_key), 
                imagecid: await GUN.SEA.encrypt('', encryption_key), 
                likeduserpubs: await GUN.SEA.encrypt('', encryption_key), 
                likecount: await GUN.SEA.encrypt(0, encryption_key), 
                commentcount: await GUN.SEA.encrypt(0, encryption_key), 
                reportcount: await GUN.SEA.encrypt(0, encryption_key), 
            }
            const thispost = db.get('singlepost'+indexkey);
            thispost.put(data);
            db.get('posts').set(thispost);
        }
        setnewPostText('');
    }

    useEffect(() => { 
        getCurrUsernameAlias();
        getAllPostsData();
    }, []);

    return (
        // <div id="body_child">
            <div className="home">
                <Header setcurrusername={setcurrusername} currusername={currusername} />

                <div className="container">
                    <div className="all_posts_container">
                        {
                            state.posts.map((post, index) => (
                                <Post key={index} post={post} curruseralias={currusername} removePostFromArr={removePostFromArr} />
                            ))
                        }
                    </div>
                </div>

                <Popup trigger={<i className="fas fa-plus post_button"></i>} modal nested >
                    { close => <PostModal close={close} currusername={currusername} newPostText={newPostText} setnewPostText={setnewPostText} file={file} setfile={setfile} filename={filename} attachedFile={attachedFile} sendOutPost={sendOutPost} /> }
                </Popup>

                <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} limit={1}/>
                <div id="popup-root" />
            </div>
        // </div>
    );
}

export default Home;