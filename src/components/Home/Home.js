import React, {useEffect, useState, useContext, useRef} from 'react';
import Intro from '../Intro/Intro';
import Search from '../Search/Search';
import AddIdea from '../AddIdea/AddIdea';
import CardContainer from '../CardContainer/CardContainer';
import Card from '../CardContainer/Card/Card.js';
import RandCard from '../CardContainer/Card/RandCard.js';
import Footer from '../Footer/Footer';
import ScrollToTop from '../ScrollToTop/ScrollToTop';
import Confirm from '../Confirm/Confirm';
import Post from "../../helpers/post.js";
import { ConfirmContext } from '../../providers/ConfirmProvider';
import './Home.scss';

const Home = (props) => {
    const {conf, pid} = useContext(ConfirmContext);
    const [showConf, setShowConf] = conf;

    const footRef = useRef(null);

    const [posts, setPosts] = useState([]);
    const [lastKey, setLastKey] = useState("");
    const [ideaListLoading, setIdeaListLoading] = useState(false);
    const [searchedIdea, setSearchedIdea] = useState('');
    const [randIdea, setRandIdea] = useState(null);
    const [gotRandIdea, setGotRandIdea] = useState(false);
	const [tagList, setTagList] = useState(['games', 'apps', 'startup']);
	const [tagStatusList, setTagStatusList] = useState([true, true, true]);

    const filteredPosts = posts.filter(idea => {
        return idea.post.idea.toLowerCase().includes(searchedIdea.toLowerCase()) || 
            idea.post.displayName.toLowerCase().includes(searchedIdea.toLowerCase()) || 
                ((typeof idea.post.tag !== 'undefined') ? idea.post.tag.toLowerCase().includes(searchedIdea.toLowerCase()) : null);
    });

    const fetchRandIdea = () => {
        // console.log(`fetchRandIdea`);
        Post.randomIdea()
            .then((res) => {
              //console.log(`res.randomIndex:${res.randomIndex} - randIdeaPost: ${res.posts[res.randomIndex]}`);
                setRandIdea(res.posts[res.randomIndex]);
                setGotRandIdea(true);
            })
            .catch((err) => {
              //console.log(err);
                setIdeaListLoading(false);
        });
    };

    const fetchPost = () => {
        // console.log(`fetchPost: ${lastKey}`);
        if (lastKey !== "") {
          //console.log(`has lastKey`);
            setIdeaListLoading(true);
            Post.postsNextBatch(lastKey)
                .then((res) => {
                    setLastKey(res.lastKey);
                    setPosts(posts.concat(res.posts));
                    setIdeaListLoading(false);
                })
                .catch((err) => {
                  //console.log(err);
                    setIdeaListLoading(false);
                });
        }
        else {
            // console.log(`lastKey empty`);
            setIdeaListLoading(true);
            Post.postsFirstBatch()
                .then((res) => {
                    setLastKey(res.lastKey);
                    setPosts(res.posts);
                    setIdeaListLoading(false);
                })
                .catch((err) => {
                  //console.log(err);
                    setIdeaListLoading(false);
            });
        }
    };

    useEffect(() => { 
        if(filteredPosts.length <= 0)
            footRef.current.style.position = "absolute";
        else
            footRef.current.style.position = "relative";

        if(posts.length <= 0 && !ideaListLoading)
            fetchPost();
        // if(!gotRandIdea)
        //     fetchRandIdea();
    }, [gotRandIdea, filteredPosts]);

    function Empty(props) {
        return (
            <div className="empty_item">
                <p className="empty_text">{props.text}</p>
            </div>
        );
    }

    function MoreIdeas(props) {
        return (
            <div className="more_ideas">
                <button className="more_ideas_button" onClick={() => fetchPost()}>{props.text}</button>
            </div>
        );
    }

    return (
        <div id="root_child">
            {showConf && <Confirm />}
            <Intro />
            <Search setSearchedIdea={setSearchedIdea} fullfiltpost={filteredPosts} tagList={tagList} setTagList={setTagList} tagStatusList={tagStatusList} setTagStatusList={setTagStatusList}/>
            <AddIdea />
            {
                (randIdea !== null) && (searchedIdea.length <= 0) &&
                <CardContainer heading_text='Random Idea' cardcont_id='randcont'>
                    <RandCard key={randIdea.id} post_id={randIdea.id} post_utc={randIdea.post.utc} post_idea_text={randIdea.post.idea} post_idea_tag={randIdea.post.tag} op_uid={randIdea.post.uid} op_displayName={randIdea.post.displayName} post_upvotes={randIdea.post.upvotes} setGotRandIdea={setGotRandIdea} />
                </CardContainer>
            }
            {
                (filteredPosts.length > 0) && 
                <CardContainer heading_text='Past Ideas' cardcont_id='pastcont'>
                {   
                    filteredPosts.map(({id, post}) => (
                        <Card key={id} post_id={id} post_utc={post.utc} post_idea_text={post.idea} post_idea_tag={post.tag} op_uid={post.uid} op_displayName={post.displayName} post_upvotes={post.upvotes} />
                    ))
                }
                <MoreIdeas text="More Ideas?"/>
                </CardContainer>
            }
            {
                (filteredPosts.length <= 0) && 
                <CardContainer heading_text='' cardcont_id='emptycont'>
                    <Empty text="oops! something's broken i guess? 🤷"/>
                </CardContainer>
            }
            <Footer refe={footRef}/>
            <ScrollToTop />
        </div>
    );
}

export default Home;