import { useNavigate } from "react-router-dom";
import './Header.scss';

const Header = (props) => {
    let navigate = useNavigate();

    function handleClick() {
        navigate('/User',
        {
            state: {
                currusername: props.currusername,
            }
        });
    }

    return (
        <header className="user_bio">
            <img src={`https://avatars.dicebear.com/api/initials/${props.currusername}.svg`} alt="avatar" width={45} className='userpfp' onClick={handleClick}/> 
            <span className='title' >hi {props.currusername}</span>
        </header>
    );
}

export default Header;