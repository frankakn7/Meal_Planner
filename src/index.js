import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Home from './Pages/Home/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FourOFour from './Pages/404/FourOFour';
import Ingredients from './Pages/Ingredients/Ingredients';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
