import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { db, user } from '../helpers/user';
import { unpinFile } from '../helpers/pinata';
import { imagebasedomains, timeDifference } from '../helpers/functions';
import { ToastContainer, toast } from 'react-toastify';
import GUN from 'gun';
import Popup from 'reactjs-popup';
import MenuModal from './MenuModal';
import './Post.scss';
import 'react-toastify/dist/ReactToastify.css';

const Post = (props) => {
    let navigate = useNavigate();
    const [posteravatarurl, setposteravatarurl] = useState('');
    const [canDeletePost, setcanDeletePost] = useState(false);
    const [postLikeCount, setpostLikeCount] = useState(0);
    const [postCommentCount, setpostCommentCount] = useState(0);
    const [postLikeUserPubsArr, setpostLikeUserPubsArr] = useState('');
    const [postLikedByCurrUser, setpostLikedByCurrUser] = useState(false);
    const [ts, setts] = useState(new Date());
    
    function getUserAvatar() {
        const users = db.get('users').get('curruser'+props.post.posterpub);
        users.once( async (data, id) => {
            const decrypted_userpub = await GUN.SEA.decrypt(data.userpub, process.env.REACT_APP_ENCRYPTION_KEY);
            const decrypted_pfpcid = await GUN.SEA.decrypt(data.pfpcid, process.env.REACT_APP_ENCRYPTION_KEY);
            const decrypted_useralias = await GUN.SEA.decrypt(data.useralias, process.env.REACT_APP_ENCRYPTION_KEY);
            // console.log('getUserAvatar id: ', id, ' - decrypted_pfpcid: ', decrypted_pfpcid, ' - decrypted_useralias: ', decrypted_useralias);
            if(decrypted_userpub === props.post.posterpub)
                setposteravatarurl((decrypted_pfpcid!==undefined && decrypted_pfpcid!==null && decrypted_pfpcid!=='') ? imagebasedomains[0]+decrypted_pfpcid : `https://avatars.dicebear.com/api/big-ears-neutral/${decrypted_useralias}.svg`);
        });
    }
    function getPostDataCounts() {
        setts(new Date(props.post.posttime));
        setpostLikeCount((props.post.likecount===undefined) ? 0 : props.post.likecount);
        setpostCommentCount((props.post.commentcount===undefined) ? 0 : props.post.commentcount);
    }
    function isPostLikedByCurrUser() {
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
    function isPostDeletableByCurrUser() {
        setcanDeletePost( props.post.posterpub === user.is.pub && !props.post.nftflag );
    }
    function goToPostersUserPage() {
        navigate('/User',
        {
            state: {
                username: props.post.posteralias,
                userpub: props.post.posterpub,
            }
        });
    }
    function goToPostPage() {
        navigate('/Post',
        {
            state: {
                post: props.post,
                curruseralias: props.curruseralias,
                posteravatarurl: posteravatarurl,
                canDeletePost: canDeletePost,
                postLikeCount: postLikeCount,
                postCommentCount: postCommentCount,
                postLikeUserPubsArr: postLikeUserPubsArr,
                postLikedByCurrUser: postLikedByCurrUser,
                ts: ts,
            }
        });
    }
    async function likePost() {
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
                likecount: await GUN.SEA.encrypt(postLikeCount-1, process.env.REACT_APP_ENCRYPTION_KEY),
                likeduserpubs: await GUN.SEA.encrypt(str, process.env.REACT_APP_ENCRYPTION_KEY),
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
                likecount: await GUN.SEA.encrypt(postLikeCount+1, process.env.REACT_APP_ENCRYPTION_KEY),
                likeduserpubs: await GUN.SEA.encrypt(str, process.env.REACT_APP_ENCRYPTION_KEY),
            });
        }
    }
    function reportPost() {
        console.log('reportPost');
        toast.error('Post Reported.');

        const posts = db.get('posts').get(props.post.postid);
        posts.once(async (data, id) => {
            const decrypted_reportcount = await GUN.SEA.decrypt(data.reportcount, process.env.REACT_APP_ENCRYPTION_KEY);
            posts.put({
                reportcount: await GUN.SEA.encrypt( (decrypted_reportcount ? decrypted_reportcount+1 : 1) , process.env.REACT_APP_ENCRYPTION_KEY),
            });
        });
    }
    function deletePost() {
        console.log('deletePost');
        toast.error('Post Deleted.');

        const posts = db.get('posts');
        posts.get(props.post.postid).put(null);
        if(props.post.imagecid){
            unpinFile(props.post.imagecid).then( async (resp) => {
                console.log('deletePost resp: ', resp);
            });
        }
        props.removePostFromArr(props.post.postid);
    }

    useEffect(() => {
        getPostDataCounts();
        getUserAvatar();
        isPostLikedByCurrUser();
        isPostDeletableByCurrUser();
    }, [posteravatarurl]);

    return (
        <div className={'post '+( props.post.nftflag ? 'isnft' : '' )} >            
            <div className="post_avatar_container" onClick={goToPostersUserPage}>
                <img className="post_avatar" src={posteravatarurl} alt="avatar" />
            </div>

            <div className="post_text_image_container" >
                <div className="alias_container">
                    <p className="post_alias">{props.post.posteralias}</p>
                    <p className="post_sep"> · </p>
                    <p className="post_time">{timeDifference(ts)}</p>
                </div>

                <p className="post_text" onClick={goToPostPage}>{props.post.posttext}</p>

                { ( props.post.imagecid!=='' ) && <img className="post_image" src={imagebasedomains[0]+props.post.imagecid} alt='postimage' /> }
                
                <div className="post_interaction_container">
                    <i className={"fas fa-heart interact_button like_button"+(postLikedByCurrUser?' liked':'')} onClick={likePost} ></i>
                    <p className="interact_text like_text">{postLikeCount}</p>
                    <i className="fas fa-comment interact_button comment_button" onClick={goToPostPage} ></i>
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