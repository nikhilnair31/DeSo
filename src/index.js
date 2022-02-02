import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './helpers/reportWebVitals';
import App from './App';
import './index.scss';

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);

reportWebVitals();