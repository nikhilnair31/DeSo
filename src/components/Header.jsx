import React, { useEffect, useState } from 'react';
import { imagebasedomains } from '../helpers/functions';
import { useNavigate } from "react-router-dom";
import { user, db } from '../helpers/user'
import GUN from 'gun';
import './Header.scss';

const Header = (props) => {
    let navigate = useNavigate();
    const [avatarurl, setavatarurl] = useState(`https://avatars.dicebear.com/api/big-ears-neutral/${props.currusername}.svg`);
    const [userfullname, setuserfullname] = useState('');
    const [fulluserdata, setfulluserdata] = useState({});
    const [lighttheme, setlighttheme] = useState(false);

    function themeswitch() {
        console.log('themeswitch: ', lighttheme);

        let currtheme = lighttheme;
        currtheme = !currtheme;
        setlighttheme(currtheme);
        if(currtheme) {
            document.body.classList.remove('theme-light');
            document.body.classList.add('theme-dark');
        }
        else {
            document.body.classList.remove('theme-dark');
            document.body.classList.add('theme-light');
        }
    }
    function goToUserPage() {
        navigate('/User',
        {
            state: {
                username: props.currusername,
                userpub: user.is.pub,
            }
        });
    }
    function getfulluserdata() {
        console.log('getfulluserdata');
        
        const users = db.get('users').get('curruser'+user.is.pub);
        users.once( async (data, id) => {
            // console.log('id: ', id, ' - data: ', data);
            const decrypted_useralias = await GUN.SEA.decrypt(data.useralias, process.env.REACT_APP_ENCRYPTION_KEY);
            const decrypted_userfullname = await GUN.SEA.decrypt(data.userfullname, process.env.REACT_APP_ENCRYPTION_KEY);
            const decrypted_pfpcid = await GUN.SEA.decrypt(data.pfpcid, process.env.REACT_APP_ENCRYPTION_KEY);
            // console.log('decrypted_useralias: ', decrypted_useralias, ' - decrypted_userfullname: ', decrypted_userfullname);
            setfulluserdata(data);
            setuserfullname(decrypted_userfullname);
            setavatarurl((decrypted_pfpcid!==undefined && decrypted_pfpcid!==null && decrypted_pfpcid!=='') ? imagebasedomains[0]+decrypted_pfpcid : `https://avatars.dicebear.com/api/big-ears-neutral/${decrypted_useralias}.svg`);
        });
    }

    useEffect(() => { 
        getfulluserdata();
    }, [fulluserdata]);

    return (
        <header className="user_bio">
            <img src={avatarurl} alt="avatar" width={45} className='userpfp' onClick={goToUserPage}/> 
            <span className='title' >hi {(userfullname!=='') ? userfullname.toLowerCase().split(" ")[0] : props.currusername}</span>
            <i className={lighttheme ? 'themeicon fas fa-adjust spin_backward' : 'themeicon fas fa-adjust spin_forward'} onClick={themeswitch} ></i>
        </header>
    );
}

export default Header;