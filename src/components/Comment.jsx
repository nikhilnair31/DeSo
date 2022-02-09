import React, { useEffect, useState } from 'react'
import { db, user } from '../helpers/user';
import { useNavigate, useLocation } from "react-router-dom";
import { imagebasedomains, timeDifference } from '../helpers/functions';
import Popup from 'reactjs-popup';
import MenuModal from './MenuModal';
import './Comment.scss';

const Comment = (props) => {
    
    useEffect(() => {
        console.log('MyComment props.allcomments: ', props.allcomments);
    }, [props.allcomments]);

    const CommentItem = ({comment}) => {
        console.log('Comment comment: ', comment);
        let navigate = useNavigate();
        const [posteravatarurl, setposteravatarurl] = useState('');
        const [canDeletePost, setcanDeletePost] = useState(false);

        function goToPostersUserPage() {
            navigate('/User',
            {
                state: {
                    username: comment.commenteralias,
                    userpub: comment.commenterpub,
                }
            });
        }
        function deletePost() {
            console.log('deletePost');
    
            // const posts = db.get('posts');
            // posts.get(state.post.postid).put(null);
            // if(state.post.imagecid){
            //     unpinFile(state.post.imagecid).then( async (resp) => {
            //         console.log('deletePost resp: ', resp);
            //     });
            // }
        }
        
        useEffect(() => {
            const users = db.get('users').get('curruser'+comment.commenterpub);
            users.once(async (data, id) => {
                // console.log('id: ', id, ' - data: ', data);
                if(data.userpub === comment.commenterpub)
                    setposteravatarurl((data.pfpcid!==undefined && data.pfpcid!==null) ? imagebasedomains[0]+data.pfpcid : `https://avatars.dicebear.com/api/big-ears-neutral/${data.useralias}.svg`);
            });
        }, [props.allcomments]);

        return (
            <div className="indiv_comment">
                <div className="comment_top_container">
                    <img className="post_avatar" src={posteravatarurl} alt="avatar" onClick={goToPostersUserPage}/>
                    <p className="comment_alias">{comment.commenteralias}</p>
                    <p className="comment_sep"> · </p>
                    <p className="comment_time">{timeDifference(new Date(comment.commentertime))}</p>
                    <Popup trigger={<i className="fas fa-ellipsis-h post_menu_button"></i>} modal nested >
                        { close => <MenuModal close={close} canDeletePost={canDeletePost} deletePost={deletePost} /> }
                    </Popup>
                </div>

                {/* <p>{comment.commenterpub}</p> */}
                <p className="comment_comment">{comment.commentercomment}</p>
            </div>
        );
    }

    if(props.allcomments) {
        return (
            <div className="allcomments_container" >
            {   
                props.allcomments.map(c => (
                    <CommentItem key={c.id} comment={c} />
                ))
            }
            </div>
        )
    }
    else {
        return (
            <div></div>
        )
    }
}

export default Comment