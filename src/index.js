import React from 'react'
import ReactDOM from 'react-dom';
import reportWebVitals from './helpers/reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from './components/LogIn';
import User from './components/User';
import App from './App.jsx';
import './index.scss';
import './assets/fonts/FonsecaBold.otf'; 
import './assets/fonts/GothamLight.otf'; 
import './assets/fonts/Marvin 400.otf'; 
import './assets/fonts/MontserratAlternates-Regular.woff'; 
import './assets/fonts/RousseauDeco.ttf'; 

document.getElementsByTagName("BODY")[0].classList.add('theme-light');

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="LogIn" element={<LogIn />} />
            <Route path="User" element={<User />} />
        </Routes>
    </BrowserRouter>,
	document.getElementById('root')
);

reportWebVitals();