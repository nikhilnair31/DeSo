import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './helpers/reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from './components/LogIn';
// import Mint from './components/Mint';
import User from './components/User';
import App from './App.jsx';
import './index.scss';

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="LogIn" element={<LogIn />} />
            {/* <Route path="Mint" element={<Mint />} /> */}
            <Route path="User" element={<User />} />
        </Routes>
        {/* <React.StrictMode>
            <App />
        </React.StrictMode> */}
    </BrowserRouter>,
	document.getElementById('root')
);

reportWebVitals();