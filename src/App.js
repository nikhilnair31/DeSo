import {useEffect, useState} from 'react'
import LogIn from './components/LogIn/LogIn';
import Home from './components/Home/Home';
import {user} from './helpers/user'
import './App.scss';

const App = () => {
    const [currusername, setcurrusername] = useState('')
    const [initialload, setinitialload] = useState(false)

    document.getElementById("root").classList.add('theme-dark');

    useEffect(() => {
        // console.log('user: ', user, '- currusername: ', currusername);
        if(user && currusername === '' && !initialload) {
            user.get('alias').on(v => setcurrusername(v));
            setinitialload(true);
        }
    }, [currusername])

    function signout() {
        user.leave();
        setcurrusername('');
    }

    // console.log('currusername: ', currusername);
    if(currusername!=='') {
        return (
            <div className="root">
                <div className="root_user_bio">
                    <span className='title'>Hello {currusername}</span>
                    <img src={`https://avatars.dicebear.com/api/initials/${currusername}.svg`} alt="avatar" width={50}/> 
                    <button className="signout-button" onClick={signout}>Sign Out</button>
                </div>
                <Home currusername={currusername}/>
            </div>
        );
    }
    else {
        return (
            <div className="root">
                <LogIn setcurrusername={setcurrusername} />
            </div>
        );
    }
}

export default App;