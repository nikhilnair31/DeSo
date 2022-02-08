import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { db, user } from '../helpers/user'
import { unpinFile } from '../helpers/pinata'
import Popup from 'reactjs-popup';
import MenuModal from './MenuModal';
import './Post.scss';

let imagebasedomains = ['https://ipfs.io/ipfs/', 'https://gateway.pinata.cloud/ipfs']

const Post = (props) => {
    let navigate = useNavigate();
    const [posteravatarurl, setposteravatarurl] = useState('');
    const [canDeletePost, setcanDeletePost] = useState(false);
    const [postLikeCount, setpostLikeCount] = useState(0);
    const [postLikeUserPubsArr, setpostLikeUserPubsArr] = useState('');
    const [postLikedByCurrUser, setpostLikedByCurrUser] = useState(false);
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
    const isPostLikedByCurrUser = () => {
        if(props.post.likeduserpubs!==undefined) {
            setpostLikeUserPubsArr(props.post.likeduserpubs);
            if( props.post.likeduserpubs.includes(user.is.pub) ) {
                setpostLikedByCurrUser(true);
                // console.log('post already liked');
            }
            else {
                setpostLikedByCurrUser(false);
                // console.log('post not liked');
            }
        }
    }
    function goToPostersUserPage() {
        navigate('/User',
        {
            state: {
                currusername: props.post.posteralias,
                userpub: props.post.posterpub,
            }
        });
    }
    function reportPost() {
        console.log('reportPost');

        const posts = db.get('posts').get(props.post.postid);
        posts.once(async (data, id) => {
            console.log('data: ', data, 'id: ', id);
            posts.get(props.post.postid).put({reportcount: (data.reportcount ? data.reportcount+1 : 1)});
        });
    }
    function deletePost() {
        console.log('deletePost');

        const posts = db.get('posts');
        posts.get(props.post.postid).put(null);
        if(props.post.imagecid){
            unpinFile(props.post.imagecid).then( async (resp) => {
                console.log('deletePost resp: ', resp);
            });
        }
    }
    function likePost() {
        console.log('likePost');
        
        const posts = db.get('posts');
        if(postLikedByCurrUser) {
            console.log('postLikedByCurrUser');
            let str = postLikeUserPubsArr;
            str = str.replace(user.is.pub, '');
            console.log('not postLikedByCurrUser str: ', str);
            setpostLikedByCurrUser(false);
            setpostLikeUserPubsArr(str);
            setpostLikeCount(postLikeCount-1);
            posts.get(props.post.postid).put({
                likecount: postLikeCount-1,
                likeduserpubs: str
            });
        }
        else {
            console.log('not postLikedByCurrUser');
            let str = postLikeUserPubsArr;
            str = str + ' ' + user.is.pub;
            console.log('not postLikedByCurrUser str: ', str);
            setpostLikedByCurrUser(true);
            setpostLikeUserPubsArr(str);
            setpostLikeCount(postLikeCount+1);
            posts.get(props.post.postid).put({
                likecount: postLikeCount+1,
                likeduserpubs: str
            });
        }
    }
    function commentPost() {
        console.log('commentPost');
    }

    useEffect(() => {
        setts(new Date(props.post.posttime));
        setcanDeletePost( props.post.posterpub === user.is.pub && !props.post.nftflag );
        setpostLikeCount((props.post.likecount===undefined) ? 0 : props.post.likecount);
        setpostCommentCount((props.post.commentcount===undefined) ? 0 : props.post.commentcount);

        const users = db.get('users').get('curruser'+props.post.posterpub);
        users.once(async (data, id) => {
            // console.log('id: ', id, ' - data: ', data);
            if(data.userpub === props.post.posterpub)
                setposteravatarurl((data.pfpcid!==undefined && data.pfpcid!==null) ? imagebasedomains[0]+data.pfpcid : `https://avatars.dicebear.com/api/big-ears-neutral/${data.useralias}.svg`);
        });
        
        isPostLikedByCurrUser();
    }, [props.post]);

    return (
        <div className={'post '+( props.post.nftflag ? 'isnft' : '' )}>
            <div className="post_avatar_container" onClick={goToPostersUserPage}>
                <img className="post_avatar" src={posteravatarurl} alt="avatar" />
            </div>
            <div className="post_text_image_container">
                <div className="alias_container">
                    <p className="post_alias">{props.post.posteralias}</p>
                    <p className="post_sep"> · </p>
                    <p className="post_time">{timeDifference(ts)}</p>
                </div>
                {/* <div className="post_text_container"></div> */}
                {/* <p className="post_text">{props.post.postid}</p> */}
                <p className="post_text">{props.post.posttext}</p>
                { 
                    ( props.post.imagecid!=='' ) && 
                    <img className="post_image" src={imagebasedomains[0]+props.post.imagecid} alt='postimage' />
                }
                <div className="post_interaction_container">
                    <i className={"fas fa-heart interact_button like_button"+(postLikedByCurrUser?' liked':'')} onClick={likePost} ></i>
                    <p className="interact_text like_text">{postLikeCount}</p>
                    <i className="fas fa-comment interact_button comment_button" onClick={commentPost} ></i>
                    <p className="interact_text comment_text">{postCommentCount}</p>
                </div>
            </div>
            <div className="post_menu_container">
                <Popup trigger={<i className="fas fa-ellipsis-h post_menu_button"></i>} modal nested >
                    { close => <MenuModal close={close} canDeletePost={canDeletePost} deletePost={deletePost} reportPost={reportPost} /> }
                </Popup>
            </div>
        </div>
    );
}

export default Post;