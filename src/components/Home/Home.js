import React, {useEffect, useState, useContext, useRef} from 'react';
import Login from '../LogIn/LogIn';
import ChatMessage from '../ChatMessage/ChatMessage'
import {user} from '../../helpers/user'
import GUN from 'gun';
import './Home.scss';

const Home = (props) => {
    const [loadedmessages, setloadedmessages] = useState(false);
    const [newMessage, setnewMessage] = useState('');
    const [allmessages, setallmessages] = useState([]);

    const db = GUN({
        peers: [
          'http://localhost:8765/gun'
        ]
    })

    async function sendMessage() {
        const secret = await GUN.SEA.encrypt(newMessage, '#foo');
        console.log('newMessage: ', newMessage, '- secret: ', secret);
        const message = user.get('all').set({ what: secret });
        const index = new Date().toISOString();
        db.get('chat').get(index).put(message);
        setnewMessage('');
    }

    useEffect(() => { 
        if(!loadedmessages) {
            let filluparr = [];
            var match = {
                // lexical queries are kind of like a limited RegEx or Glob.
                '.': {
                // property selector
                '>': new Date(+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(), // find any indexed property larger ~3 hours ago
                },
                '-': 1, // filter in reverse
            };
            // Get Messages
            db.get('chat')
            .map(match)
            .once(async (data, id) => {
                if (data) {
                    // Key for end-to-end encryption
                    const key = '#foo';
                    var message = {
                        // transform the data
                        who: db.user(data).get('alias'), // a user might lie who they are! So let the user system detect whose data it is.
                        what: (await GUN.SEA.decrypt(data.what, key)) + '', // force decrypt as text.
                        when: GUN.state.is(data, 'what'), // get the internal timestamp for the what property.
                    };
                    console.log('chat message: ', message);
                    if (message.what) {
                        // setallmessages([...allmessages.slice(-100), message].sort((a, b) => a.when - b.when));
                        // setallmessages([...allmessages, message]);
                        filluparr.push(message);
                        setallmessages(filluparr);
                    }
                }
            });
            setloadedmessages(true);
        }
    }, [allmessages]);

    return (
        <div className="root_home">
            {
                // console.log('allmessages: ', allmessages) &&
                // allmessages.length > 1 && 
                allmessages.map((message, index) => (
                    <ChatMessage key={index} message={message} sender={props.currusername} />
                ))
            }
            <form onSubmit={sendMessage}>
                <input type="text" placeholder="Type a message..." onChange={e => setnewMessage(e.target.value)} maxLength={100} />
                <button type="submit" disabled={!newMessage}>Send</button>
            </form>
        </div>
    );
}

export default Home;