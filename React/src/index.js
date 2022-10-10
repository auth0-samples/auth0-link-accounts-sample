import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';

import App from './App';
import { getConfig } from './config';
import history from "./utils/history";
import { linkContext } from './utils/context';

import './index.css';

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

const config = getConfig();
const mainProviderConfig = {
  ...config,
  audience: `https://${config.domain}/api/v2/`,
  redirectUri: `${window.location.origin}?primary`,
  scope:  'openid email profile read:current_user update:current_user_identities',
  skipRedirectCallback: window.location.href.includes('?secondary'),
  cacheLocation: 'localstorage',
  onRedirectCallback
}

const linkProviderConfig = {
  ...config,
  context: linkContext,
  scope: 'openid email profile',
  redirectUri: `${window.location.origin}?secondary`,
  skipRedirectCallback: window.location.href.includes('?primary'),
  onRedirectCallback
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider {...mainProviderConfig}>
      <Auth0Provider {...linkProviderConfig}>
       <App />
      </Auth0Provider>
    </Auth0Provider>
  </React.StrictMode>
);
