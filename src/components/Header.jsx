import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { user, db } from '../helpers/user'
import './Header.scss';

let imagebasedomains = ['https://ipfs.io/ipfs/', 'https://gateway.pinata.cloud/ipfs']
let match = {
    // lexical queries are kind of like a limited RegEx or Glob.
    '.': {
    // property selector
    '>': new Date(+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(), // find any indexed property larger ~3 hours ago
    },
    '-': 1, // filter in reverse
};

const Header = (props) => {
    let navigate = useNavigate();
    const [avatarurl, setavatarurl] = useState(`https://avatars.dicebear.com/api/big-ears-neutral/${props.currusername}.svg`);
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
        
        const users = db.get('users');
        users.map(match).once(async (data, id) => {
            if(data.userpub === user.is.pub){
                setfulluserdata(data);
                if(data.pfpcid!==undefined && data.pfpcid!==null) {
                    setavatarurl(imagebasedomains[0]+data.pfpcid);
                }
                else {
                    setavatarurl(`https://avatars.dicebear.com/api/big-ears-neutral/${props.currusername}.svg`);
                }
            }
        });
    }

    useEffect(() => { 
        getfulluserdata();
    }, [fulluserdata]);

    return (
        <header className="user_bio">
            <img src={avatarurl} alt="avatar" width={45} className='userpfp' onClick={goToUserPage}/> 
            <span className='title' >hi {(fulluserdata.userfullname) ? fulluserdata.userfullname.toLowerCase().split(" ")[0] : props.currusername}</span>
            <i className={lighttheme ? 'themeicon fas fa-adjust spin_backward' : 'themeicon fas fa-adjust spin_forward'} onClick={themeswitch} ></i>
        </header>
    );
}

export default Header;