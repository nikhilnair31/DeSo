import React, {useEffect, useState, useReducer, useRef} from 'react';
import Post from './Post'
import GUN from 'gun';
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
    const inputEl = useRef();
    const [newPostText, setnewPostText] = useState('');
    const [file, setfile] = useState();
    const [state, dispatch] = useReducer(reducer, initialState)

    function captureFile(event) {
        event.preventDefault();
        console.log('captureFile');
        const pickedfile = event.target.files[0];
        setfile(pickedfile);
    }
    async function sendOutPost() {
        if(file){
            pinFileToIPFS(file).then( async (resp) => {
                console.log('resp: ', resp);
                let respcid = resp.IpfsHash ? resp.IpfsHash : '';
                console.log('respcid: ', respcid);

                const secretnewPostText = await GUN.SEA.encrypt(newPostText, '#foo');
                console.log('newPostText: ', newPostText, '- secretnewPostText: ', secretnewPostText);

                console.log('user.is.pub: ', user.is.pub);
                const indexkey = new Date().toISOString();
                const posts = db.get('posts');
                const thispost = db.get('singlepost'+indexkey);
                thispost.put({ posterpub: user.is.pub, posteralias: props.currusername, posttext: secretnewPostText, posttime: indexkey, imagecid: respcid, });
                posts.set(thispost);

                setnewPostText('');
            });
        }
        else{
            const secretnewPostText = await GUN.SEA.encrypt(newPostText, '#foo');
            console.log('newPostText: ', newPostText, '- secretnewPostText: ', secretnewPostText);

            console.log('user.is.pub: ', user.is.pub);
            const indexkey = new Date().toISOString();
            const posts = db.get('posts');
            const thispost = db.get('singlepost'+indexkey);
            thispost.put({ posterpub: user.is.pub, posteralias: props.currusername, posttext: secretnewPostText, posttime: indexkey, imagecid: '', });
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
                    postimagecid: data.imagecid,
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
            <div className="make_post_container">
                <input className="post_input" type="text" placeholder="Type a post..." value={newPostText} onChange={e => setnewPostText(e.target.value)} ref={inputEl} maxLength={100} />
                {/* <input className="post_attach_button" type="file" onChange={captureFile}/> */}
                <button className="post_attach_button" type="file" onChange ={captureFile}>Attach</button>
                <button className="post_post_input" type="submit" disabled={(!newPostText || !file)} onClick ={sendOutPost}>Post</button>
                {/* <button type="submit" disabled={!newPostText} onClick ={mintAsNFT}>Mint</button> */}
            </div>
        </div>
    );
}

export default Home;