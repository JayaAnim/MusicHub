import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';

import App from './components/App';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import './style.css'; //import css file!

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));
