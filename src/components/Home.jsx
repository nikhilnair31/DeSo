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
    console.log('reducer posts: ', [post, ...state.posts].sort((a, b) => a.when - b.when));
    return {
        posts: [post, ...state.posts].sort((a, b) => a.when - b.when)
    }
}

const Home = (props) => {
    const inputEl = useRef();
    const [newPostText, setnewPostText] = useState('');
    const [file, setfile] = useState();
    const [state, dispatch] = useReducer(reducer, initialState)

    function onSubmit(event) {
        event.preventDefault();
        console.log('onSubmit');
        const resp = pinFileToIPFS(file);
        console.log('resp: ', resp);
    }
    function captureFile(event) {
        event.preventDefault();
        console.log('captureFile');
        const pickedfile = event.target.files[0];
        setfile(pickedfile);
    }
    async function sendOutPost() {
        const secret = await GUN.SEA.encrypt(newPostText, '#foo');
        console.log('newPostText: ', newPostText, '- secret: ', secret);
        const post = user.get('all').set({ what: secret });
        const index = new Date().toISOString();
        db.get('chat').get(index).put(post);
        setnewPostText('');
    }
    // async function mintAsNFT() {
    // }

    useEffect(() => { 
        var match = {
            // lexical queries are kind of like a limited RegEx or Glob.
            '.': {
            // property selector
            '>': new Date(+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(), // find any indexed property larger ~3 hours ago
            },
            '-': 1, // filter in reverse
        };
        // Get Messages
        db.get('chat')
        .map(match)
        .once(async (data, id) => {
            if (data) {
                const key = '#foo';

                let whoalias = '';
                db.user(data).once(async (userdat) => {
                    console.log('userdat: ', userdat, '- alias: ', userdat.alias);
                    whoalias = userdat.alias;

                    let decryptedwhat = '';
                    decryptedwhat = await GUN.SEA.decrypt(data.what, key) + '';

                    var message = {
                        who: whoalias, // a user might lie who they are! So let the user system detect whose data it is.
                        what: decryptedwhat, // force decrypt as text.
                        when: GUN.state.is(data, 'what'), // get the internal timestamp for the what property.
                    };
                    // console.log('chat data: ', data);
                    console.log('chat message: ', message);
                    if (message.what) {
                        dispatch(message);
                    }
                });
            }
        });
    }, []);

    return (
        <div className="home">
            <div className="all_posts_container">
                {
                    state.posts.map((post, index) => (
                        <Post key={index} post={post} curruseralias={props.currusername} />
                    ))
                }
            </div>
            <div className="make_post_container">
                <input type="text" placeholder="Type a post..." value={newPostText} onChange={e => setnewPostText(e.target.value)} ref={inputEl} maxLength={100} />
                {/* <form onSubmit={onSubmit}>
                    <input type="file" onChange={captureFile}/>
                    <input type="submit" />
                </form> */}
                <input type="file" onChange={captureFile}/>
                <input type="submit" onClick={onSubmit}/>
                <button type="submit" disabled={!newPostText} onClick ={sendOutPost}>Post</button>
                {/* <button type="submit" disabled={!newPostText} onClick ={mintAsNFT}>Mint</button> */}
            </div>
        </div>
    );
}

export default Home;