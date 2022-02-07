import React, {useContext, useEffect, useState } from 'react';
import './LogIn.scss';
import {user} from '../helpers/user'

const LogIn = (props) => {
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');

    const login = () => {
        console.log('login');
        user.auth(username, password, ({ err }) => {
            if (err){
                console.log('login err');
                alert(err);
            }
            else{
                props.setcurrusername(username);
            }
        });
    }
    const signup = () => {
        console.log('signup');
        user.create(username, password, ({ err }) => {
            if (err){
                console.log('signup err');
                alert(err);
            }
            else{
                console.log('signup to login');
                login();
            }
        });
    }

    return (
        <div className="login_wrapper">
            {/* <div className="login_bg">
                <div className="circle"></div>
                <div className="line"></div>
            </div> */}
            <div className="login">
                <img className='logo_img' src='./images/Logo.png' />
                {/* <h1 className='text login_title_text'>DeSo</h1> */}
                <div className="login_inputs">
                    <h3 className='text input_title_text'>Username</h3>
                    <input className='input' name="username" placeholder='Username' onChange={e => setusername(e.target.value)} minLength={3} maxLength={16} />
                    <h3 className='text input_title_text'>Password</h3>
                    <input className='input' name="password" placeholder='Password' onChange={e => setpassword(e.target.value)} type="password" required />
                </div>
                <div className="login_button_container">
                    <button className="button login_button" onClick={login}>
                        <h5 className="button_text" >Login</h5>
                    </button>
                    <button className="button signup_button" onClick={signup}>
                        <h5 className="button_text" >Signup</h5>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LogIn;