import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

import keycloak from './keycloak';

keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
  if (authenticated) {
    const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    window.location.reload();
  }
});
