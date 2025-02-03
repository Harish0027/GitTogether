import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendering the app within BrowserRouter to enable React Router for routing functionality
root.render(
  <>
    <App />
  </>
);

// Optional: You can measure and log performance if you want, 
// or you can remove this if you don't need it
reportWebVitals();
