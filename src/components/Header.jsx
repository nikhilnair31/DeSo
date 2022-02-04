import {useEffect, useState} from 'react'
import { useNavigate , Link } from "react-router-dom";
import {user} from '../helpers/user'
import './Header.scss';

const Header = (props) => {
    let navigate = useNavigate();

    function handleClick() {
        navigate('/User');
    }
    function signout() {
        user.leave();
        props.setcurrusername('');
    }

    return (
        <header className="user_bio">
            <img src={`https://avatars.dicebear.com/api/initials/${props.currusername}.svg`} alt="avatar" width={55} onClick={handleClick}/> 
            <span className='title'>hi {props.currusername}</span>
            <button className="signout_button" onClick={signout}>Sign Out</button>
        </header>
    );
}

export default Header;