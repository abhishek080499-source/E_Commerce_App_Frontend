import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ScrollToTop from './components/ScrollToTop';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

// Redux imports
import { Provider } from 'react-redux';
import store from './redux/store';   // <-- store.js का path

const root = ReactDOM.createRoot(document.getElementById('root'));
// index.js
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <ScrollToTop />
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);


reportWebVitals();
