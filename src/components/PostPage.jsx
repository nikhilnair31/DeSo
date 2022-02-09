
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { db, user } from '../helpers/user';
import { unpinFile } from '../helpers/pinata';
import { imagebasedomains, timeDifference } from '../helpers/functions';
import Popup from 'reactjs-popup';
import MenuModal from './MenuModal';
import Comment from './Comment';
import './PostPage.scss';

const PostPage = () => {
    let navigate = useNavigate();
    const { state } = useLocation();
    const [posteravatarurl, setposteravatarurl] = useState('');
    const [canDeletePost, setcanDeletePost] = useState(false);
    const [postLikeCount, setpostLikeCount] = useState(0);
    const [postLikeUserPubsArr, setpostLikeUserPubsArr] = useState('');
    const [postLikedByCurrUser, setpostLikedByCurrUser] = useState(false);
    const [postCommentCount, setpostCommentCount] = useState(0);
    const [comment, setcomment] = useState('');
    const [allcomments, setallcomments] = useState([]);
    const [ts, setts] = useState(new Date());
    
    function goToPostersUserPage() {
        navigate('/User',
        {
            state: {
                username: state.post.posteralias,
                userpub: state.post.posterpub,
            }
        });
    }
    function reportPost() {
        console.log('reportPost');

        const posts = db.get('posts').get(state.post.postid);
        posts.once(async (data, id) => {
            console.log('data: ', data, 'id: ', id);
            posts.get(state.post.postid).put({reportcount: (data.reportcount ? data.reportcount+1 : 1)});
        });
    }
    function deletePost() {
        console.log('deletePost');

        const posts = db.get('posts');
        posts.get(state.post.postid).put(null);
        if(state.post.imagecid){
            unpinFile(state.post.imagecid).then( async (resp) => {
                console.log('deletePost resp: ', resp);
            });
        }
    }
    function likePost() {
        console.log('likePost');

        const posts = db.get('posts');
        if(postLikedByCurrUser) {
            // console.log('postLikedByCurrUser');
            let str = postLikeUserPubsArr;
            str = str.replace(user.is.pub, '');
            console.log('postLikedByCurrUser user.is.pub: ', user.is.pub, ' - str: ', str);
            setpostLikedByCurrUser(false);
            setpostLikeUserPubsArr(str);
            setpostLikeCount(postLikeCount-1);
            posts.get(state.post.postid).put({
                likecount: postLikeCount-1,
                likeduserpubs: str
            });
        }
        else {
            // console.log('not postLikedByCurrUser');
            let str = postLikeUserPubsArr;
            str = str + ' ' + user.is.pub;
            console.log('not postLikedByCurrUser user.is.pub: ', user.is.pub, ' - str: ', str);
            setpostLikedByCurrUser(true);
            setpostLikeUserPubsArr(str);
            setpostLikeCount(postLikeCount+1);
            posts.get(state.post.postid).put({
                likecount: postLikeCount+1,
                likeduserpubs: str
            });
        }
    }
    function commentPost() {
        console.log('commentPost');

        const indexkey = new Date().toISOString();
        const thiscomment = db.get('singlecomment'+indexkey);
        thiscomment.put({
            commenterpub: user.is.pub,
            commenteralias: state.curruseralias,
            commentercomment: comment,
            commentertime: indexkey,
        });
        db.get('allcomments').set(thiscomment);
        db.get('commentsof'+state.post.postid).set(thiscomment);

        db.get('posts').get(state.post.postid).put({
            commentcount: postCommentCount+1,
        });
        setpostCommentCount(postCommentCount+1);
    }
    function backToHome() {
        navigate(-1);
    }

    useEffect(() => {
        console.log('PostPage state: ', state);

        db.get('commentsof'+state.post.postid).once((data, id) => {
            console.log('id: ', id, '- data: ', data);
            if(data) {
                let postcomments = []
                let keysarr = Object.keys(data);
                console.log('keysarr: ', keysarr);
                keysarr.slice(1, keysarr.length).forEach(element => {
                    console.log('element: ', element);
                    db.get(element).once((data, id) => {
                        if(data) {
                            let firscomment = {
                                commenterpub: data.commenterpub,
                                commenteralias: data.commenteralias,
                                commentercomment: data.commentercomment,
                                commentertime: data.commentertime,
                            }
                            postcomments = [...postcomments, firscomment];
                            setallcomments(postcomments);

                            db.get('posts').get(state.post.postid).put({
                                commentcount: postcomments.length+1,
                            });
                            setpostCommentCount(postcomments.length+1);
                            console.log('id: ', id, 'data: ', data);
                        }
                    });
                });
            }
        });

        setts(state.ts);
        setcanDeletePost(state.canDeletePost);
        setpostLikeCount(state.postLikeCount);
        setpostCommentCount(state.postCommentCount);
        setposteravatarurl(state.posteravatarurl);
        setpostLikedByCurrUser(state.postLikedByCurrUser);
    }, [state.post]);

    return (
        <div className={'postpage'}>
            <header className="header">
                <i className="fa fa-chevron-left backbutton" onClick={backToHome} ></i>
                <p className='title' >Post</p>
            </header>

            <div className={'postdata '+( state.post.nftflag ? 'isnft' : '' )}>
                <div className="post_avatar_container" onClick={goToPostersUserPage}>
                    <img className="post_avatar" src={posteravatarurl} alt="avatar" />
                </div>
                <div className="post_text_image_container">
                    <div className="alias_container">
                        <p className="post_alias">{state.post.posteralias}</p>
                        <p className="post_sep"> · </p>
                        <p className="post_time">{timeDifference(ts)}</p>
                    </div>
                    <p className="post_text">{state.post.posttext}</p>
                    { ( state.post.imagecid!=='' ) && <img className="post_image" src={imagebasedomains[0]+state.post.imagecid} alt='postimage' /> }
                    <div className="post_interaction_container">
                        <i className={"fas fa-heart interact_button like_button"+(postLikedByCurrUser?' liked':'')} onClick={likePost} ></i>
                        <p className="interact_text like_text">{postLikeCount}</p>
                        <i className="fas fa-comment interact_button comment_button" ></i>
                        <p className="interact_text comment_text">{postCommentCount}</p>
                    </div>
                </div>
                <div className="post_menu_container">
                    <Popup trigger={<i className="fas fa-ellipsis-h post_menu_button"></i>} modal nested >
                        { close => <MenuModal close={close} canDeletePost={canDeletePost} deletePost={deletePost} reportPost={reportPost} /> }
                    </Popup>
                </div>
            </div>
            
            <header className="comment_in_container">
                <input className="comment_in" type="text" placeholder="Comment..." value={comment} onChange={e => setcomment(e.target.value)} />
                <button className="button pushcomment_button" onClick={commentPost} >Save</button>
            </header>

            { allcomments.length>0 && <Comment allcomments={allcomments} /> }
        </div>
    );
}

export default PostPage;