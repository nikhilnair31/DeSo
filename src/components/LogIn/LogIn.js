import React, {useContext, useEffect, useState } from 'react';
import './LogIn.scss';
import {user} from '../../helpers/user'

const LogIn = () => {
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');

    const handleusernamechange = event => {
        console.log(event.target.value);
        setusername(event.target.value);
    }
    const handlepasswordchange = event => {
        console.log(event.target.value);
        setpassword(event.target.value);
    }
    const login = () => {
        user.auth(username, password, ({ err }) => err && alert(err));
    }
    const signup = () => {
        user.create(username, password, ({ err }) => {
            if (err) {
              alert(err);
            } else {
              login();
            }
        });
    }

    return (
        <div className="login_wrapper">
            <div className="login">
                <h1>🔫💬</h1>
                <div className="login_text">
                    <h1>Welcome</h1>
                    <a href="https://docs.google.com/document/d/14Q2jeHABjQZgS-B4zeXYWJ7g1-WPgBSSEIqeVNpG414/edit?usp=sharing">Privacy Policy</a>
                    
                    <label>Username</label>
                    <input name="username" onChange={handleusernamechange} minLength={3} maxLength={16} />

                    <label>Password</label>
                    <input name="password" onChange={handlepasswordchange} type="password" />
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