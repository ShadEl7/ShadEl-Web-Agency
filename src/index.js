import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css'; // Importing global styles
import App from './pages/App'; // Main App component

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);