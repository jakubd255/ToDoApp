import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { CookiesProvider } from "react-cookie";
import { ConfigProvider } from "antd";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CookiesProvider>
        <ConfigProvider>
            <App/>
        </ConfigProvider>
    </CookiesProvider>
);