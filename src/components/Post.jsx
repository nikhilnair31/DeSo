import React, { useEffect, useState } from 'react';
import { db, user } from '../helpers/user'
import { unpinFile } from '../helpers/pinata'
import './Post.scss';

let imagebasedomains = ['https://ipfs.io/ipfs/', 'https://gateway.pinata.cloud/ipfs']

const Post = (props) => {
    const [canDeletePost, setcanDeletePost] = useState(false);
    const [avatar, setavatar] = useState('');
    const [ts, setts] = useState(new Date());
    
    function deletePost() {
        console.log('deletePost');
        const posts = db.get('posts');
        posts.get(props.post.postid).put(null);

        if(props.postimagecid){
            unpinFile(props.postimagecid).then( async (resp) => {
                console.log('deletePost resp: ', resp);
            });
        }
    }

    useEffect(() => {
        console.log('props.post: ', props.post, '\n props.curruseralias: ', props.curruseralias); 
        console.log('props.post.posterpub === user.is.pub: ', (props.post.posterpub === user.is.pub), '!props.post.postnftflag: ', (!props.post.postnftflag), ' = ', (props.post.posterpub === user.is.pub && !props.postnftflag)); 
        setcanDeletePost( props.post.posterpub === user.is.pub && !props.post.postnftflag );
        setavatar(`https://avatars.dicebear.com/api/initials/${props.post.posteralias}.svg`);
        setts(new Date(props.post.posttime));
    }, [props.post]);

    return (
        <div className={'post '+( props.post.postnftflag ? 'isnft' : '' )}>
            <img className="post_avatar" src={avatar} alt="avatar" />
            <div className="post_texts">
                {/* <p className="post_text">{props.post.postid}</p> */}
                <p className="post_text">{props.post.posteralias}</p>
                <p className="post_text">{props.post.posttext}</p>
                <p className="post_text">{ts.toLocaleTimeString()}</p>
            </div>
            { 
                ( props.post.postimagecid!=='' ) && 
                <img className="post_image" src={imagebasedomains[0]+props.post.postimagecid} width={100}/>
            }
            {
                canDeletePost && 
                <button className="post_delete_button" onClick={deletePost} >Delete</button>
            }
        </div>
    );
}

export default Post;