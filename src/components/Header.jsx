import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { user, db } from '../helpers/user'
import './Header.scss';

const Header = (props) => {
    const [fulluserdata, setfulluserdata] = useState({});
    const [lighttheme, setlighttheme] = useState(false);
    let navigate = useNavigate();

    function themeswitch() {
        console.log('themeswitch');
        setlighttheme(!lighttheme);
        if(lighttheme) {
            // document.getElementById("root").classList.remove('theme-light');
            // document.getElementById("root").classList.add('theme-dark');
            document.getElementsByTagName("BODY")[0].classList.remove('theme-light');
            document.getElementsByTagName("BODY")[0].classList.add('theme-dark');
        }
        else {
            // document.getElementById("root").classList.remove('theme-dark');
            // document.getElementById("root").classList.add('theme-light');
            document.getElementsByTagName("BODY")[0].classList.remove('theme-dark');
            document.getElementsByTagName("BODY")[0].classList.add('theme-light');
        }
    }
    function handleClick() {
        navigate('/User',
        {
            state: {
                currusername: props.currusername,
                userpub: user.is.pub,
            }
        });
    }
    function getfulluserdata() {
        console.log('getfulluserdata');
        var match = {
            // lexical queries are kind of like a limited RegEx or Glob.
            '.': {
            // property selector
            '>': new Date(+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(), // find any indexed property larger ~3 hours ago
            },
            '-': 1, // filter in reverse
        };
        const users = db.get('users');
        users.map(match).once(async (data, id) => {
            if(data.userpub === user.is.pub){
                console.log('getfulluserdata id: ', id, ' - data: ', data);
                setfulluserdata(data);
            }
        });
    }

    useEffect(() => { 
        themeswitch();
        getfulluserdata();
    }, []);

    return (
        <header className="user_bio">
            <img src={`https://avatars.dicebear.com/api/big-ears-neutral/${props.currusername}.svg`} alt="avatar" width={45} className='userpfp' onClick={handleClick}/> 
            <span className='title' >hi {(fulluserdata.userfullname) ? fulluserdata.userfullname.toLowerCase().split(" ")[0] : props.currusername}</span>
            <i class={lighttheme ? 'themeicon fas fa-adjust spin_backward' : 'themeicon fas fa-adjust spin_forward'} onClick={themeswitch} ></i>
        </header>
    );
}

export default Header;