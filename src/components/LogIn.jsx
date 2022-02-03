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
            <div className="login">
                <h1 className='login_text'>DeSo</h1>
                <div className="login_inputs">
                    <h3 className='login_text'>Username</h3>
                    <input name="username" onChange={e => setusername(e.target.value)} minLength={3} maxLength={16} />
                    <h3 className='login_text'>Password</h3>
                    <input name="password" onChange={e => setpassword(e.target.value)} />
                </div>
                <div className="login_button_container">
                    <button className="login_button" onClick={login}>
                        <h5 className="button_text" >Login</h5>
                    </button>
                    <button className="login_button" onClick={signup}>
                        <h5 className="button_text" >Signup</h5>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LogIn;