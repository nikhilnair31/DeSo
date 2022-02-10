
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { db, user } from '../helpers/user';
import { unpinFile } from '../helpers/pinata';
import { imagebasedomains, timeDifference } from '../helpers/functions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Popup from 'reactjs-popup';
import MenuModal from './MenuModal';
import Comment from './Comment';
import GUN from 'gun';
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
    
    function isPostLikedByCurrUser() {
        if(postLikeUserPubsArr!==undefined) {
            // console.log('isPostLikedByCurrUser postLikeUserPubsArr: ', postLikeUserPubsArr , 'user.is.pub: ', user.is.pub);
            if( postLikeUserPubsArr.includes(user.is.pub) ) {
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
                username: state.post.posteralias,
                userpub: state.post.posterpub,
            }
        });
    }
    function getPostComments() {
        console.log('getPostComments');

        db.get('commentsof'+state.post.postid).once((data, id) => {
            console.log('id: ', id, '- data: ', data);
            if(data) {
                let postcomments = []
                let finalkeysarr = [];
                let keysarr = Object.keys(data);
                console.log('keysarr: ', keysarr);
                keysarr.forEach(element => {
                    console.log('data[element]: ', data[element]);
                    if(data[element]) finalkeysarr.push(element);
                });
                finalkeysarr.slice(0, finalkeysarr.length).forEach(element => {
                    console.log('element: ', element);
                    db.get(element).once(async (data, id) => {
                        if(data) {
                            // let firscomment = {
                            //     commentid: id,
                            //     commenterpub: data.commenterpub,
                            //     commenteralias: data.commenteralias,
                            //     commentercomment: data.commentercomment,
                            //     commentertime: data.commentertime,
                            // }
                            let firscomment = {
                                commentid: id,
                                commenterpub: await GUN.SEA.decrypt(data.commenterpub, process.env.REACT_APP_ENCRYPTION_KEY),
                                commenteralias: await GUN.SEA.decrypt(data.commenteralias, process.env.REACT_APP_ENCRYPTION_KEY),
                                commentercomment: await GUN.SEA.decrypt(data.commentercomment, process.env.REACT_APP_ENCRYPTION_KEY),
                                commentertime: await GUN.SEA.decrypt(data.commentertime, process.env.REACT_APP_ENCRYPTION_KEY),
                            }
                            postcomments = [...postcomments, firscomment];
                            setallcomments(postcomments);

                            db.get('posts').get(state.post.postid).put({
                                commentcount: await GUN.SEA.encrypt(postcomments.length+1, process.env.REACT_APP_ENCRYPTION_KEY),
                            });
                            setpostCommentCount(postcomments.length+1);
                            // console.log('id: ', id, 'data: ', data);
                        }
                    });
                });
            }
        });
    }
    function getLatestPostData() {
        console.log('getLatestPostData');
        const posts = db.get('posts');
        posts.get(state.post.postid).once( async (data, id) => {
            if (data) {
                const decrypted_likecount = await GUN.SEA.decrypt(data.likecount, process.env.REACT_APP_ENCRYPTION_KEY);
                const decrypted_commentcount = await GUN.SEA.decrypt(data.commentcount, process.env.REACT_APP_ENCRYPTION_KEY);
                const decrypted_likeduserpubs = await GUN.SEA.decrypt(data.likeduserpubs, process.env.REACT_APP_ENCRYPTION_KEY);
                console.log('data.likeduserpubs: ', data.likeduserpubs);
                setpostLikeCount(decrypted_likecount ? decrypted_likecount : 0);
                setpostCommentCount(decrypted_commentcount ? decrypted_commentcount : 0);
                setpostLikeUserPubsArr(decrypted_likeduserpubs ? decrypted_likeduserpubs : '');
            }
        });
    }
    function removeCommentFromArr(removecommentid) {
        console.log('PostPage removeCommentFromArr: ', removecommentid);
        const newcommentarr = allcomments.filter((comment) => comment.commentid !== removecommentid);
        setallcomments(newcommentarr);
    }
    function reportPost() {
        console.log('reportPost');
        toast.error('Post Reported.');

        const posts = db.get('posts').get(state.post.postid);
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
        posts.get(state.post.postid).put(null);
        if(state.post.imagecid){
            unpinFile(state.post.imagecid).then( async (resp) => {
                console.log('deletePost resp: ', resp);
                navigate(-1);
            });
        }
        else { 
            navigate(-1);
        }
    }
    function goBack() {
        console.log('goBack');
        navigate(-1);
    }
    async function likePost() {
        console.log('likePost');

        const posts = db.get('posts');
        if(postLikedByCurrUser) {
            console.log('postLikedByCurrUser');
            let str = postLikeUserPubsArr;
            str = str.replace(user.is.pub, '');
            setpostLikedByCurrUser(false);
            setpostLikeUserPubsArr(str);
            setpostLikeCount(postLikeCount-1);
            posts.get(state.post.postid).put({
                likecount: await GUN.SEA.encrypt(postLikeCount-1, process.env.REACT_APP_ENCRYPTION_KEY),
                likeduserpubs: await GUN.SEA.encrypt(str, process.env.REACT_APP_ENCRYPTION_KEY),
            });
        }
        else {
            console.log('not postLikedByCurrUser');
            let str = postLikeUserPubsArr;
            str = str + ' ' + user.is.pub;
            setpostLikedByCurrUser(true);
            setpostLikeUserPubsArr(str);
            setpostLikeCount(postLikeCount+1);
            posts.get(state.post.postid).put({
                likecount: await GUN.SEA.encrypt(postLikeCount+1, process.env.REACT_APP_ENCRYPTION_KEY),
                likeduserpubs: await GUN.SEA.encrypt(str, process.env.REACT_APP_ENCRYPTION_KEY),
            });
        }
    }
    async function commentPost() {
        console.log('commentPost');
        toast.success('Commented!');

        const indexkey = new Date().toISOString();
        const thiscomment = db.get('singlecomment'+indexkey);
        thiscomment.put({
            commenterpub: await GUN.SEA.encrypt(user.is.pub, process.env.REACT_APP_ENCRYPTION_KEY),
            commenteralias: await GUN.SEA.encrypt(state.curruseralias, process.env.REACT_APP_ENCRYPTION_KEY),
            commentercomment: await GUN.SEA.encrypt(comment, process.env.REACT_APP_ENCRYPTION_KEY),
            commentertime: await GUN.SEA.encrypt(indexkey, process.env.REACT_APP_ENCRYPTION_KEY),
        });
        db.get('allcomments').set(thiscomment);
        db.get('commentsof'+state.post.postid).set(thiscomment);
        setcomment('');

        const posts = db.get('posts');
        posts.get(state.post.postid).put({
            commentcount: await GUN.SEA.encrypt(postCommentCount+1, process.env.REACT_APP_ENCRYPTION_KEY),
        });
        setpostCommentCount(postCommentCount+1);

        getPostComments();
    }

    useEffect(() => {
        console.log('PostPage state: ', state);

        getLatestPostData();
        isPostLikedByCurrUser();
        getPostComments();

        setts(state.ts);
        setcanDeletePost(state.canDeletePost);
        setposteravatarurl(state.posteravatarurl);
    }, [postLikeUserPubsArr, state.post]);

    return (
        <div className={'postpage'}>
            <header className="header">
                <i className="fa fa-chevron-left backbutton" onClick={goBack} ></i>
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

            { 
                allcomments.length>0 && 
                <div className="allcomments_container" >
                {   
                    allcomments.map(c => (
                        <Comment key={c.commentid} comment={c} postid={state.post.postid} removeCommentFromArr={removeCommentFromArr} />
                    ))
                }
                </div>
            }
            
            <ToastContainer position="bottom-left" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss/>
        </div>
    );
}

export default PostPage;