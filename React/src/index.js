import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter, useNavigate } from 'react-router-dom';

import App from './App';
import { getConfig } from './config';
import { linkContext } from './utils/context';

import './index.css';

const Auth0ProviderWithRedirectCallback = ({ children, ...props }) => {
  const navigate = useNavigate();
  const onRedirectCallback = (appState) => {
    navigate((appState && appState.returnTo) || window.location.pathname);
  };
  return (
    <Auth0Provider onRedirectCallback={onRedirectCallback} {...props}>
      {children}
    </Auth0Provider>
  );
};

const config = getConfig();
const mainProviderConfig = {
  ...config,
  audience: `https://${config.domain}/api/v2/`,
  redirectUri: `${window.location.origin}?primary`,
  scope:
    'openid email profile read:current_user update:current_user_identities',
  skipRedirectCallback: window.location.href.includes('?secondary'),
  cacheLocation: 'localstorage',
};

const linkProviderConfig = {
  ...config,
  context: linkContext,
  scope: 'openid email profile',
  redirectUri: `${window.location.origin}?secondary`,
  skipRedirectCallback: window.location.href.includes('?primary'),
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithRedirectCallback {...mainProviderConfig}>
        <Auth0ProviderWithRedirectCallback {...linkProviderConfig}>
          <App />
        </Auth0ProviderWithRedirectCallback>
      </Auth0ProviderWithRedirectCallback>
    </BrowserRouter>
  </React.StrictMode>
);
