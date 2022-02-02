import React, {useEffect, useState, useContext, useRef} from 'react';
import './ChatMessage.scss';

const ChatMessage = (props) => {
    const [messageClass, setmessageClass] = useState('');
    const [avatar, setavatar] = useState('');
    const [ts, setts] = useState(new Date());

    useEffect(() => {
        // console.log('props.message.who: ', props.message.who); 
        setmessageClass( props.message.who === props.sender ? 'sent' : 'received');
        setavatar(`https://avatars.dicebear.com/api/initials/${props.message.who}.svg`);
        setts(new Date(props.message.when));
    }, []);

    return (
        <div className={`message_${messageClass}`}>
            <img src={avatar} alt="avatar" width={50}/>
            <div className="message_texts">
                {/* <p className="message_text">{props.message.who}</p> */}
                <p className="message_text">{props.message.what}</p>
                <time className="message_text">{ts.toLocaleTimeString()}</time>
            </div>
        </div>
    );
}

export default ChatMessage;