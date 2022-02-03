import {useEffect, useState} from 'react'
import {user} from '../helpers/user'
import './Header.scss';

const Header = (props) => {
    function signout() {
        user.leave();
        props.setcurrusername('');
    }

    return (
        <div className="user_bio">
            <span className='title'>Sup {props.currusername}</span>
            <img src={`https://avatars.dicebear.com/api/initials/${props.currusername}.svg`} alt="avatar" width={50}/> 
            <button className="signout-button" onClick={signout}>Sign Out</button>
        </div>
    );
}

export default Header;