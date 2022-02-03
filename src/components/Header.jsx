import {useEffect, useState} from 'react'
import {user} from '../helpers/user'
import './Header.scss';

const Header = (props) => {
    function signout() {
        user.leave();
        props.setcurrusername('');
    }

    return (
        <header className="user_bio">
            <img src={`https://avatars.dicebear.com/api/initials/${props.currusername}.svg`} alt="avatar" width={55}/> 
            <span className='title'>hi {props.currusername}</span>
            <button className="signout_button" onClick={signout}>Sign Out</button>
        </header>
    );
}

export default Header;