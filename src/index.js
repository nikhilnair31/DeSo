import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom';
import reportWebVitals from './helpers/reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {user} from './helpers/user'
import LogIn from './components/LogIn';
import User from './components/User';
import App from './App.jsx';
import './index.scss';


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