import React, { useEffect, useState, useReducer } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { match } from '../helpers/functions'
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
                    posterpub: await GUN.SEA.decrypt(data.posterpub, process.env.REACT_APP_ENCRYPTION_KEY), 
                    posteralias: await GUN.SEA.decrypt(data.posteralias, process.env.REACT_APP_ENCRYPTION_KEY),
                    posttext: await GUN.SEA.decrypt(data.posttext, process.env.REACT_APP_ENCRYPTION_KEY) + '',
                    posttime: await GUN.SEA.decrypt(data.posttime, process.env.REACT_APP_ENCRYPTION_KEY),
                    imagecid: await GUN.SEA.decrypt(data.imagecid, process.env.REACT_APP_ENCRYPTION_KEY),
                    nftflag: await GUN.SEA.decrypt(data.nftflag, process.env.REACT_APP_ENCRYPTION_KEY),
                    likecount: await GUN.SEA.decrypt(data.likecount, process.env.REACT_APP_ENCRYPTION_KEY),
                    likeduserpubs: await GUN.SEA.decrypt(data.likeduserpubs, process.env.REACT_APP_ENCRYPTION_KEY), 
                    commentcount: await GUN.SEA.decrypt(data.commentcount, process.env.REACT_APP_ENCRYPTION_KEY),
                    reportcount: await GUN.SEA.decrypt(data.reportcount , process.env.REACT_APP_ENCRYPTION_KEY)
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
                    posterpub: await GUN.SEA.encrypt(user.is.pub, process.env.REACT_APP_ENCRYPTION_KEY), 
                    posteralias: await GUN.SEA.encrypt(currusername, process.env.REACT_APP_ENCRYPTION_KEY), 
                    posttext: await GUN.SEA.encrypt(newPostText, process.env.REACT_APP_ENCRYPTION_KEY), 
                    posttime: await GUN.SEA.encrypt(indexkey, process.env.REACT_APP_ENCRYPTION_KEY), 
                    nftflag: await GUN.SEA.encrypt(isnftminted, process.env.REACT_APP_ENCRYPTION_KEY), 
                    imagecid: await GUN.SEA.encrypt(respcid, process.env.REACT_APP_ENCRYPTION_KEY), 
                    likeduserpubs: await GUN.SEA.encrypt('', process.env.REACT_APP_ENCRYPTION_KEY), 
                    likecount: await GUN.SEA.encrypt(0, process.env.REACT_APP_ENCRYPTION_KEY), 
                    commentcount: await GUN.SEA.encrypt(0, process.env.REACT_APP_ENCRYPTION_KEY), 
                    reportcount: await GUN.SEA.encrypt(0, process.env.REACT_APP_ENCRYPTION_KEY), 
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
                posterpub: await GUN.SEA.encrypt(user.is.pub, process.env.REACT_APP_ENCRYPTION_KEY), 
                posteralias: await GUN.SEA.encrypt(currusername, process.env.REACT_APP_ENCRYPTION_KEY), 
                posttext: await GUN.SEA.encrypt(newPostText, process.env.REACT_APP_ENCRYPTION_KEY), 
                posttime: await GUN.SEA.encrypt(indexkey, process.env.REACT_APP_ENCRYPTION_KEY), 
                nftflag: await GUN.SEA.encrypt(isnftminted, process.env.REACT_APP_ENCRYPTION_KEY), 
                imagecid: await GUN.SEA.encrypt('', process.env.REACT_APP_ENCRYPTION_KEY), 
                likeduserpubs: await GUN.SEA.encrypt('', process.env.REACT_APP_ENCRYPTION_KEY), 
                likecount: await GUN.SEA.encrypt(0, process.env.REACT_APP_ENCRYPTION_KEY), 
                commentcount: await GUN.SEA.encrypt(0, process.env.REACT_APP_ENCRYPTION_KEY), 
                reportcount: await GUN.SEA.encrypt(0, process.env.REACT_APP_ENCRYPTION_KEY), 
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
    );
}

export default Home;