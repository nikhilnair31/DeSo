import {useEffect, useState} from 'react'
import LogIn from './components/LogIn';
import Header from './components/Header';
import Home from './components/Home';
import {user} from './helpers/user'
import './App.scss';

const App = () => {
    const [currusername, setcurrusername] = useState('')
    const [initialload, setinitialload] = useState(false)

    // document.getElementById("root").classList.add('theme-dark');

    useEffect(() => {
        if(user && currusername === '' && !initialload) {
            user.get('alias').on(v => setcurrusername(v));
            setinitialload(true);
        }
    }, [currusername])

    if(currusername!=='') {
        return (
            <div className="root">
                <Header setcurrusername={setcurrusername} currusername={currusername} />
                <Home currusername={currusername} />
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