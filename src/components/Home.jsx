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
function reducer(state, post) {
    // console.log('reducer posts: ', [post, ...state.posts].sort((a, b) => b.posttime - a.posttime));
    return {
        posts: [post, ...state.posts].sort((a, b) => b.posttime - a.posttime)
    }
}

const Home = () => {
    const [newPostText, setnewPostText] = useState('');
    const [currusername, setcurrusername] = useState('')
    const [file, setfile] = useState();
    const [filename, setfilename] = useState();
    const [state, dispatch] = useReducer(reducer, initialState);

    function captureFile(event, filename) {
        console.log('captureFile');

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

                const secretnewPostText = await GUN.SEA.encrypt(newPostText, '#foo');
                console.log('newPostText: ', newPostText, '- secretnewPostText: ', secretnewPostText, ' - user.is.pub: ', user.is.pub); 

                const indexkey = new Date().toISOString();
                const posts = db.get('posts');
                const thispost = db.get('singlepost'+indexkey);
                thispost.put({ 
                    posterpub: user.is.pub, 
                    posteralias: currusername, 
                    posttext: secretnewPostText, 
                    posttime: indexkey, 
                    imagecid: respcid, 
                    nftflag: isnftminted, 
                    likecount: 0, 
                    likeduserpubs: '', 
                    commentcount: 0, 
                    // comments: {} 
                });
                posts.set(thispost);

                setnewPostText('');
            });
        }
        else{
            console.log('!file');

            const secretnewPostText = await GUN.SEA.encrypt(newPostText, '#foo');
            console.log('newPostText: ', newPostText, '- secretnewPostText: ', secretnewPostText, ' - user.is.pub: ', user.is.pub);

            const indexkey = new Date().toISOString();
            let data = { 
                posterpub: user.is.pub, 
                posteralias: currusername, 
                posttext: secretnewPostText, 
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
            console.log('data: ', data);
            
            setnewPostText('');
        }

        if(isnftminted) {
            toast.success('Post Minted!');
        }
        else {
            toast.success('Posted!');
        }
    }

    useEffect(() => { 
        user.get('alias').on(currunam => setcurrusername(currunam));
        const posts = db.get('posts');
        posts.map(match).once(async (data, id) => {
            if (data) {
                // console.log('data: ', data, 'id: ', id);
                const key = '#foo';
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
                    comments: data.comments,
                    reportcount: data.reportcount
                };
                // console.log('post: ', post);
                dispatch(post);
            }
        });
    }, []);

    return (
        <div className="home">
            <Header setcurrusername={setcurrusername} currusername={currusername} />
            <div className="container">
                <div className="all_posts_container">
                    {
                        state.posts.map((post, index) => (
                            <Post key={index} post={post} curruseralias={currusername} />
                        ))
                    }
                </div>
            </div>
            <Popup trigger={<i className="fas fa-plus post_button"></i>} modal nested >
                { close => <PostModal close={close} currusername={currusername} newPostText={newPostText} setnewPostText={setnewPostText} file={file} setfile={setfile} filename={filename} captureFile={captureFile} sendOutPost={sendOutPost} /> }
            </Popup>
            <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss/>
            <div id="popup-root" />
        </div>
    );
}

export default Home;