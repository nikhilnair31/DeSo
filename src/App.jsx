import {useEffect, useState} from 'react'
import LogIn from './components/LogIn';
import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';
import {user} from './helpers/user'
import './App.scss';

const App = () => {
    const [initialload, setinitialload] = useState(false)
    const [userLoggedIn, setuserLoggedIn] = useState(false)
    const [currusername, setcurrusername] = useState('')

    useEffect(() => {
        if(user && currusername === '' && !initialload) {
            user.get('alias').on(v => setcurrusername(v));
            setinitialload(true);
        }
    }, [currusername])

    if(userLoggedIn) {
        return (
            <div className="root_child">
                <Header setcurrusername={setcurrusername} currusername={currusername} />
                <Home currusername={currusername} />
                {/* <Footer /> */}
            </div>
        );
    }
    if(!userLoggedIn) {
        return (
            <div className="root_child">
                <LogIn setcurrusername={setcurrusername} setuserLoggedIn={setuserLoggedIn} />
                {/* <Footer /> */}
            </div>
        );
    }
}

export default App;