import React, { useEffect } from 'react'
// import { Avatar } from 'antd'
import { Link } from 'react-router-dom'
import { timeDifference } from '../helpers/functions'

const MyComment = (props) => {

    function childComments() {
        if(props.allComments) {
            return props.allComments;
            // allComments.filter(c => c.parent_id === comment.id);
        }
        else {
            return []
        }
    }
    // function goToPostersUserPage() {
    //     navigate('/User',
    //     {
    //         state: {
    //             username: props.post.posteralias,
    //             userpub: props.post.posterpub,
    //         }
    //     });
    // }
    
    useEffect(() => {
        console.log('MyComment props.allComments: ', props.allComments);
    }, []);

    const Comment = (props) => {
        console.log('Comment props: ', props);
        // return (
        //     <Comment >
        //     {
        //         childComments().map(c => (
        //             <MyComment key={c.id} comment={c} allComments={allComments} />
        //         ))
        //     }
        //     </Comment>
        // );
    }

    return (
        childComments().map(c => (
            <Comment key={c.id} comment={c} />
        ))
        // <Comment
        //     author={
        //         // <Link to={`/profile/${comment.user.id}`}>{comment.user.name}</Link>
        //         <p className="post_alias">{comment.posteralias}</p>
        //     }
        //     avatar={
        //         // <Link to={`/profile/${comment.user.id}`}>
        //         //     <img src={comment.user.avatar} alt={`${comment.user.name}-avatar`} />
        //         // </Link>
        //         <div className="post_avatar_container" onClick={goToPostersUserPage}>
        //             <img className="post_avatar" src={posteravatarurl} alt="avatar" />
        //         </div>
        //     }
        //     content={
        //         <p>{`${comment.id} - ${comment.text}`}</p>
        //     }
        //     datetime={timeDifference(comment.created_at)}
        // >
        // {
        //     childComments().map(c => (
        //         <MyComment key={c.id} comment={c} allComments={allComments} createComment={createComment} user_id={user_id} post_id={post_id} parent_id={c.id} />
        //     ))
        // }
        // </Comment>
    )
}

export default MyComment