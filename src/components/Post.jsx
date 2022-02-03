import React, { useEffect, useState } from 'react';
import './Post.scss';

const Post = (props) => {
    // TODO: Use this to find if post id deleteable by curr user or not
    // const [messageClass, setmessageClass] = useState('');
    const [avatar, setavatar] = useState('');
    const [ts, setts] = useState(new Date());

    useEffect(() => {
        console.log('props.post: ', props.post, '\n props.curruseralias: ', props.curruseralias); 
        // setmessageClass( props.post.who === props.curruseralias ? 'sent' : 'received');
        setavatar(`https://avatars.dicebear.com/api/initials/${props.post.who}.svg`);
        setts(new Date(props.post.when));
    }, []);

    return (
        <div className={`post`}>
            <img src={avatar} alt="avatar" width={50}/>
            <div className="post_texts">
                <p className="post_text">{props.post.who}</p>
                <p className="post_text">{props.post.what}</p>
                <p className="post_text">{ts.toLocaleTimeString()}</p>
            </div>
        </div>
    );
}

export default Post;