import React, { useState } from 'react';
import { db, user } from '../helpers/user';
import { useNavigate } from "react-router-dom";
import { encryption_key } from '../helpers/functions';
import GUN from 'gun';
import './LogIn.scss';

const LogIn = () => {
    let navigate = useNavigate();
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');

    function login () {
        console.log('login');
        user.auth(username, password, async ({ err }) => {
            if (err){
                console.log('login err');
                alert(err);
            }
            else{
                console.log('login');
                console.log('encryption_key: ', encryption_key, ' - user.is.pub: ', user.is.pub, ' - username: ', username);
                
                db.get('curruser'+user.is.pub).once( async (curruserpub) => {
                    // console.log('curruserpub: ', curruserpub);
                    if(curruserpub){
                        navigate('/Home');
                        // window.location.href = '/Home'
                    }
                    else {
                        let data = {
                            userpub: await GUN.SEA.encrypt(user.is.pub, encryption_key),
                            useralias: await GUN.SEA.encrypt(username, encryption_key),
                            userfullname: await GUN.SEA.encrypt('', encryption_key),
                            useremail: await GUN.SEA.encrypt('', encryption_key),
                            userbio: await GUN.SEA.encrypt('', encryption_key),
                            pfpcid: await GUN.SEA.encrypt('', encryption_key),
                        }
                        const curruser = db.get('curruser'+user.is.pub);
                        curruser.put(data);
                        const users = db.get('users');
                        users.set(curruser);
                        navigate('/Home');
                        // window.location.href = '/Home'
                    }
                })
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
        // <div id="body_child">
            <div className="login_container">
                <div className="login">
                    <img className='logo_img' src='./images/Logo.png' alt='logo'/>
                        
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
        // </div>
    );
}

export default LogIn;