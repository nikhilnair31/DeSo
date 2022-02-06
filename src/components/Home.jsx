import React, { useEffect, useState, useReducer } from 'react';
import Post from './Post'
import GUN from 'gun';
import Popup from 'reactjs-popup';
import PostModal from './PostModal';
import { pinFileToIPFS } from '../helpers/pinata'
import { db, user } from '../helpers/user'
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

const Home = (props) => {
    const [newPostText, setnewPostText] = useState('');
    const [file, setfile] = useState();
    const [filename, setfilename] = useState();
    const [state, dispatch] = useReducer(reducer, initialState);

    function captureFile(event, filename) {
        event.preventDefault();
        console.log('captureFile');
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
                    posteralias: props.currusername, 
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
            const posts = db.get('posts');
            const thispost = db.get('singlepost'+indexkey);
            thispost.put({ 
                posterpub: user.is.pub, 
                posteralias: props.currusername, 
                posttext: secretnewPostText, 
                posttime: indexkey, 
                imagecid: '', 
                nftflag: isnftminted, 
                likecount: 0, 
                likeduserpubs: '', 
                commentcount: 0, 
                // comments: {},
            });
            posts.set(thispost);
            
            setnewPostText('');
        }
    }

    useEffect(() => { 
        var match = {
            // lexical queries are kind of like a limited RegEx or Glob.
            '.': {
            // property selector
            '>': new Date(+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(), // find any indexed property larger ~3 hours ago
            },
            '-': 1, // filter in reverse
        };
        const posts = db.get('posts');
        posts.map(match).once(async (data, id) => {
            if (data) {
                console.log('data: ', data, 'id: ', id);
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
                    comments: data.comments
                };
                console.log('post: ', post);
                dispatch(post);
            }
        });
    }, []);

    return (
        <div className="home">
            <div className="container">
                <div className="all_posts_container">
                    {
                        state.posts.map((post, index) => (
                            <Post key={index} post={post} curruseralias={props.currusername} />
                        ))
                    }
                </div>
            </div>
            <Popup trigger={<i className="fas fa-plus post_button"></i>} modal nested >
                { close => <PostModal close={close} currusername={props.currusername} newPostText={newPostText} setnewPostText={setnewPostText} file={file} setfile={setfile} filename={filename} captureFile={captureFile} sendOutPost={sendOutPost} /> }
            </Popup>
            <div id="popup-root" />
        </div>
    );
}

export default Home;