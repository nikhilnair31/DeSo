import React, { useEffect, useState } from 'react';
import { db, user } from '../helpers/user'
import './Post.scss';

const Post = (props) => {
    const [canDeletePost, setcanDeletePost] = useState(false);
    const [avatar, setavatar] = useState('');
    const [ts, setts] = useState(new Date());
    
    function deletePost() {
        console.log('deletePost');
        user.get('all').set(null);
        db.get('posts').get(props.post.posttime).put(null);
    }

    useEffect(() => {
        console.log('props.post: ', props.post, '\n props.curruseralias: ', props.curruseralias); 
        setcanDeletePost( props.post.posteralias === props.curruseralias );
        setavatar(`https://avatars.dicebear.com/api/initials/${props.post.posteralias}.svg`);
        setts(new Date(props.post.posttime));
    }, [props.post]);

    return (
        <div className={`post`}>
            <img src={avatar} alt="avatar" width={50}/>
            <div className="post_texts">
                <p className="post_text">{props.post.posteralias}</p>
                <p className="post_text">{props.post.posttext}</p>
                <p className="post_text">{ts.toLocaleTimeString()}</p>
            </div>
            { 
                ( props.post.postimagecid!=='' ) && 
                <img src={`https://ipfs.io/ipfs/`+props.post.postimagecid} width={100}/>
            }
            {
                canDeletePost && 
                <button onClick={deletePost} >Delete</button>
            }
        </div>
    );
}

export default Post;