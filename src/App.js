import './App.scss';
import Gun from 'gun'
import {useEffect, useState} from 'react'
import LogIn from './components/LogIn/LogIn';
import {user, username} from './helpers/user'

const App = () => {

    const [txt, setTxt] = useState()

    useEffect(() => {
        console.log('user: ', user, '- username: ', username);
    }, [])

    function signout() {
        user.leave();
        username.set('');
    }

    return (
        <div className="App">
            {
                username &&
                <div class="user-bio">
                    <span>Hello {username}</span>
                    <img src={`https://avatars.dicebear.com/api/initials/${username}.svg`} alt="avatar" /> 
                    <button class="signout-button" onClick={signout}>Sign Out</button>
                </div>
            }
            {
                !username && 
                <LogIn />
            }
        </div>
    );
}

export default App;