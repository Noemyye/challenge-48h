import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import App from './App';
import StationInfo from './components/station.jsx'; // attention à l'orthographe de "compoment"
import List from './components/List.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/station/:id" element={<StationInfo />} />
                <Route path="/list" element={<List />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
