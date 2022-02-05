import React, { useEffect, useState } from 'react';
import { db, user } from '../helpers/user'
import { unpinFile } from '../helpers/pinata'
import Popup from 'reactjs-popup';
import MenuModal from './MenuModal';
import './Post.scss';

let imagebasedomains = ['https://ipfs.io/ipfs/', 'https://gateway.pinata.cloud/ipfs']

const Post = (props) => {
    const [canDeletePost, setcanDeletePost] = useState(false);
    const [avatar, setavatar] = useState('');
    const [postLikeCount, setpostLikeCount] = useState(0);
    const [postCommentCount, setpostCommentCount] = useState(0);
    const [ts, setts] = useState(new Date());
    
    const timeDifference = (utc) => {
        // dayjs(item.utc).format("YYYY-MM-DD")
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;
    
        var now = Math.floor(Date.now())
        var elapsed = now - utc;
        // console.log(elapsed, '=', now, '-', utc);
    
        if (elapsed < msPerMinute) {
            return Math.round(elapsed/1000) + 's';   
        }
        else if (elapsed < msPerHour) {
            return Math.round(elapsed/msPerMinute) + 'm';   
        }
        else if (elapsed < msPerDay ) {
            return Math.round(elapsed/msPerHour ) + 'h';   
        }
        else if (elapsed < msPerMonth) {
            return Math.round(elapsed/msPerDay) + 'd';   
        }
        else if (elapsed < msPerYear) {
            return Math.round(elapsed/msPerMonth) + 'month';   
        }
        else {
            //return 'around ' + Math.round(elapsed/msPerYear ) + ' years ago'; 
            return Math.round(elapsed/msPerYear ) + 'year';   
        }
    }
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
    function likePost() {
        console.log('likePost');
        const posts = db.get('posts');
        const thispost = db.get('singlepost'+props.post.posttime);
        thispost.put({
            posterpub: props.post.posterpub, 
            posteralias: props.post.posteralias, 
            posttext: props.post.posttext, 
            posttime: props.post.posttime, 
            imagecid: props.post.postimagecid, 
            nftflag: props.post.postnftflag, 
            likecount: postLikeCount+1, 
            commentcount: props.post.postcommentcount, 
            comments: props.post.postcomments 
        });
        posts.set(thispost);
        setpostLikeCount(postLikeCount+1);
    }
    function commentPost() {
        console.log('commentPost');
    }

    useEffect(() => {
        // console.log('props.post: ', props.post, '\n props.curruseralias: ', props.curruseralias); 
        // console.log('props.post.posterpub === user.is.pub: ', (props.post.posterpub === user.is.pub), '!props.post.postnftflag: ', (!props.post.postnftflag), ' = ', (props.post.posterpub === user.is.pub && !props.postnftflag)); 
        setcanDeletePost( props.post.posterpub === user.is.pub && !props.post.postnftflag );
        setavatar(`https://avatars.dicebear.com/api/initials/${props.post.posteralias}.svg`);
        setts(new Date(props.post.posttime));
        setpostLikeCount((props.postlikecount===undefined) ? 0 : props.postlikecount);
        setpostCommentCount((props.postcommentcount===undefined) ? 0 : props.postlikecount);
    }, [props.post]);

    return (
        <div className={'post '+( props.post.postnftflag ? 'isnft' : '' )}>
            <div className="post_avatar_container">
                <img className="post_avatar" src={avatar} alt="avatar" />
            </div>
            <div className="post_text_image_container">
                <p className="post_alias">{props.post.posteralias} · {timeDifference(ts)}</p>
                <div className="post_text_container">
                    {/* <p className="post_text">{props.post.postid}</p> */}
                    <p className="post_text">{props.post.posttext}</p>
                </div>
                { 
                    ( props.post.postimagecid!=='' ) && 
                    <img className="post_image" src={imagebasedomains[0]+props.post.postimagecid} />
                }
                <div className="post_interaction_container">
                    <i class="fas fa-heart interact_button like_button" onClick={likePost} ></i>
                    <p className="interact_text like_text">{postLikeCount}</p>
                    <i class="fas fa-comment-alt interact_button comment_button" onClick={commentPost} ></i>
                    <p className="interact_text comment_text">{postCommentCount}</p>
                </div>
            </div>
            <div className="post_menu_container">
                <Popup trigger={<i class="fas fa-ellipsis-h post_menu_button"></i>} modal nested >
                    { close => <MenuModal close={close} canDeletePost={canDeletePost} deletePost={deletePost} /> }
                </Popup>
            </div>
        </div>
    );
}

export default Post;