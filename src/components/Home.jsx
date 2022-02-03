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
    console.log('reducer posts: ', [post, ...state.posts].sort((a, b) => a.posttime - b.posttime));
    return {
        posts: [post, ...state.posts].sort((a, b) => a.posttime - b.posttime)
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
                const post = user.get('all').set({ posttext: secretnewPostText, imagecid: respcid });
                const index = new Date().toISOString();
                db.get('posts').get(index).put(post);
                setnewPostText('');
            });
        }
        else{
            const secretnewPostText = await GUN.SEA.encrypt(newPostText, '#foo');
            console.log('newPostText: ', newPostText, '- secretnewPostText: ', secretnewPostText);
            const post = user.get('all').set({ posttext: secretnewPostText, imagecid: '404' });
            const index = new Date().toISOString();
            db.get('posts').get(index).put(post);
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
        // Get Messages
        db.get('posts')
        .map(match)
        .once(async (data, id) => {
            if (data) {
                const key = '#foo';

                let whoalias = '';
                db.user(data).once(async (userdat) => {
                    console.log('userdat: ', userdat, '- alias: ', userdat.alias);
                    whoalias = userdat.alias;

                    let decryptedposttext = '';
                    decryptedposttext = await GUN.SEA.decrypt(data.posttext, key) + '';

                    var post = {
                        posteralias: whoalias, // a user might lie who they are! So let the user system detect whose data it is.
                        posttext: decryptedposttext, // force decrypt as text.
                        posttime: GUN.state.is(data, 'posttext'), // get the internal timestamp for the 'posttext' property.
                        postimagecid: data.imagecid,
                    };
                    console.log('posts data: ', data);
                    console.log('posts post: ', post);
                    if (post.posttext) {
                        dispatch(post);
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
                <input type="file" onChange={captureFile}/>
                <button type="submit" disabled={!newPostText} onClick ={sendOutPost}>Post</button>
                {/* <button type="submit" disabled={!newPostText} onClick ={mintAsNFT}>Mint</button> */}
            </div>
        </div>
    );
}

export default Home;