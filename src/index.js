import React from 'react'
import ReactDOM from 'react-dom';
import reportWebVitals from './helpers/reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from './components/LogIn';
import Home from './components/Home';
import User from './components/User';
import PostPage from './components/PostPage';
import './index.scss';
import './assets/fonts/FonsecaBold.otf'; 
import './assets/fonts/GothamLight.otf'; 
import './assets/fonts/Marvin 400.otf'; 
import './assets/fonts/MontserratAlternates-Regular.woff'; 
import './assets/fonts/RousseauDeco.ttf'; 

document.body.classList.add('theme-light');

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LogIn />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/User" element={<User />} />
                <Route path="/Post" element={<PostPage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>, 
    document.body
    // document.getElementById('root')
);

reportWebVitals();