import React, {useEffect, useState, useReducer, useRef} from 'react';
import ChatMessage from '../ChatMessage/ChatMessage'
import {db, user} from '../../helpers/user'
import GUN from 'gun';
import './Home.scss';

const initialState = {
    messages: []
}
function reducer(state, message) {
    return {
        messages: [message, ...state.messages].sort((a, b) => a.when - b.when)
    }
}

const Home = (props) => {
    const [newMessage, setnewMessage] = useState('');
    const [state, dispatch] = useReducer(reducer, initialState)

    async function sendMessage() {
        const secret = await GUN.SEA.encrypt(newMessage, '#foo');
        console.log('newMessage: ', newMessage, '- secret: ', secret);
        const message = user.get('all').set({ what: secret });
        const index = new Date().toISOString();
        db.get('chat').get(index).put(message);
        setnewMessage('');
    }

    useEffect(() => { 
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
                const key = '#foo';

                let whoalias = '';
                db.user(data).once(async (dat) => {
                    console.log('dat: ', dat, '- alias: ', dat.alias);
                    whoalias = dat.alias;

                    let decryptedwhat = '';
                    decryptedwhat = await GUN.SEA.decrypt(data.what, key) + '';

                    var message = {
                        who: whoalias, // a user might lie who they are! So let the user system detect whose data it is.
                        what: decryptedwhat, // force decrypt as text.
                        when: GUN.state.is(data, 'what'), // get the internal timestamp for the what property.
                    };
                    // console.log('chat data: ', data);
                    // console.log('chat message: ', message);
                    if (message.what) {
                        dispatch(message);
                    }
                });
            }
        });
    }, []);

    return (
        <div className="root_home">
            {
                state.messages.map((message, index) => (
                    <ChatMessage key={index} message={message} curruseralias={props.currusername} />
                ))
            }
            <input type="text" placeholder="Type a message..." onChange={e => setnewMessage(e.target.value)} maxLength={100} />
            <button type="submit" disabled={!newMessage} onClick ={sendMessage}>Send</button>
        </div>
    );
}

export default Home;