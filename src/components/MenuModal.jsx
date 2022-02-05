import React, {  } from 'react';
import './MenuModal.scss';

const MenuModal = (props) => {
    function deleteButtonOnClick() {
        props.deletePost();
        props.close();
    }

    return (
        <div className="menu_modal">
            <div className="header"> What do you wish to do? </div>
            {/* <div className="content"> Type it out or upload it! </div>             */}
            {props.canDeletePost && <button className="menu_button delete_button"  onClick ={deleteButtonOnClick}>Delete</button>}
            <button className="menu_button share_button" onClick ={props.close}>Share</button>
            <button className="menu_button cancel_button" onClick ={props.close}>Cancel</button>
        </div>
    );
}

export default MenuModal;