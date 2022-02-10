import React, { useEffect, useState, useReducer } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { key, match } from '../helpers/functions'
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
        console.log('getCurrUsernameAlias');
        user.get('alias').on(currunam => setcurrusername(currunam));
    }
    function getAllPostsData() {
        console.log('getAllPostsData');
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
                    reportcount: data.reportcount
                };
                // console.log('post: ', post);
                dispatch({ type: 'append', payload: post })
            }
        });
    }
    function removePostFromArr(removepostid) {
        const newcommentarr = state.posts.filter((post) => post.postid !== removepostid);
        // console.log('Home state.posts: ', state.posts, ' - removePostFromArr: ', removepostid, ' - newcommentarr: ', newcommentarr);
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
        console.log('sendOutPost - ', isnftminted);

        if(file){
            console.log('file');

            pinFileToIPFS(file).then( async (resp) => {
                console.log('resp: ', resp);
                let respcid = resp.IpfsHash ? resp.IpfsHash : '';
                console.log('respcid: ', respcid);

                const indexkey = new Date().toISOString();
                let data = { 
                    posterpub: user.is.pub, 
                    posteralias: currusername, 
                    posttext: await GUN.SEA.encrypt(newPostText, '#foo'), 
                    posttime: indexkey, 
                    imagecid: respcid, 
                    nftflag: isnftminted, 
                    likecount: 0, 
                    likeduserpubs: '', 
                    commentcount: 0, 
                    // comments: {} 
                }
                const posts = db.get('posts');
                const thispost = db.get('singlepost'+indexkey);
                thispost.put(data);
                posts.set(thispost);
            });
        }
        else{
            console.log('!file');

            const indexkey = new Date().toISOString();
            let data = { 
                posterpub: user.is.pub, 
                posteralias: currusername, 
                posttext: await GUN.SEA.encrypt(newPostText, '#foo'), 
                posttime: indexkey, 
                imagecid: '', 
                nftflag: isnftminted, 
                likecount: 0, 
                likeduserpubs: '', 
                commentcount: 0, 
                // comments: {},
            }
            const posts = db.get('posts');
            const thispost = db.get('singlepost'+indexkey);
            thispost.put(data);
            posts.set(thispost);
        }
        setnewPostText('');

        toast.clearWaitingQueue();
        if(isnftminted) toast.success('Post Minted!');
        else toast.success('Posted!');
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