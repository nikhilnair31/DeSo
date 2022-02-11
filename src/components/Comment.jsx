import React, { useEffect, useState } from 'react'
import { db, user } from '../helpers/user';
import { encryption_key } from '../helpers/functions';
import { useNavigate, useLocation } from "react-router-dom";
import { imagebasedomains, timeDifference } from '../helpers/functions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Popup from 'reactjs-popup';
import MenuModal from './MenuModal';
import GUN from 'gun';
import './Comment.scss';

const Comment = ({comment, postid , removeCommentFromArr}) => {
    let navigate = useNavigate();
    const [posteravatarurl, setposteravatarurl] = useState('');
    const [canDeleteComment, setcanDeleteComment] = useState(false);

    function getUserAvatar() {
        const users = db.get('users').get('curruser'+comment.commenterpub);
        users.once(async (data, id) => {
            console.log('getUserAvatar id: ', id, ' - data: ', data);
            const decrypted_userpub = await GUN.SEA.decrypt(data.userpub, encryption_key);
            const decrypted_pfpcid = await GUN.SEA.decrypt(data.pfpcid, encryption_key);
            const decrypted_useralias = await GUN.SEA.decrypt(data.useralias, encryption_key);
            if(decrypted_userpub === comment.commenterpub)
                setposteravatarurl((decrypted_pfpcid!==undefined && decrypted_pfpcid!==null && decrypted_pfpcid!=='') ? imagebasedomains[0]+decrypted_pfpcid : `https://avatars.dicebear.com/api/big-ears-neutral/${decrypted_useralias}.svg`);
        });
    }
    function goToPostersUserPage() {
        navigate('/User',
        {
            state: {
                username: comment.commenteralias,
                userpub: comment.commenterpub,
            }
        });
    }
    function isCommentDeletableByCurrUser() {
        setcanDeleteComment( comment.commenterpub === user.is.pub );
    }
    function reportComment() {
        console.log('reportComment');
        toast.error('Comment Reported.');
    }
    function deleteComment() {
        console.log('deleteComment postid: ', postid, ' - comment.commentid: ', comment.commentid);
        toast.error('Comment Deleted.');

        const commentsofpost = db.get('commentsof'+postid);
        commentsofpost.get(comment.commentid).put(null);
        removeCommentFromArr(comment.commentid)
    }
    
    useEffect(() => {
        console.log('Comment comment: ', comment);
        getUserAvatar();
        isCommentDeletableByCurrUser();
    }, []);

    return (
        <div className="indiv_comment">
            <div className="comment_top_container">
                <img className="post_avatar" src={posteravatarurl} alt="avatar" onClick={goToPostersUserPage}/>
                <p className="comment_alias">{comment.commenteralias}</p>
                <p className="comment_sep"> · </p>
                <p className="comment_time">{timeDifference(new Date(comment.commentertime))}</p>
                <Popup trigger={<i className="fas fa-ellipsis-h post_menu_button"></i>} modal nested >
                    { close => <MenuModal close={close} canDeletePost={canDeleteComment} deletePost={deleteComment} reportPost={reportComment} /> }
                </Popup>
            </div>

            <p className="comment_comment">{comment.commentercomment}</p>
        </div>
    );
}

export default Comment