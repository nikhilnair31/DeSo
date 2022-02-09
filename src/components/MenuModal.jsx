import React, {  } from 'react';
import './MenuModal.scss';

const MenuModal = (props) => {
    function deleteButton() {
        console.log('deleteButton');
        props.deletePost();
        props.close();
    }
    function reportPost() {
        console.log('reportPost');
        props.reportPost();
        props.close();
    }
    function sharePost() {
        console.log('sharePost');
        props.close();
    }

    return (
        <div className="menu_modal">
            <div className="header"> What do you wish to do? </div>
            {/* <div className="content"> Type it out or upload it! </div>             */}
            { props.canDeletePost && <button className="button delete_button"  onClick ={deleteButton}>Delete</button>}
            { !props.canDeletePost && <button className="button report_button" onClick ={reportPost}>Report</button> }
            {/* <button className="button share_button" onClick ={sharePost}>Share</button> */}
            <button className="button cancel_button" onClick ={props.close}>Cancel</button>
        </div>
    );
}

export default MenuModal;