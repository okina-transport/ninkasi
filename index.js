import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import Keycloak from 'keycloak-js';
import App from './containers/App';
import configureStore from './store/store';
import './sass/main.scss';
import injectTapEventPlugin from 'react-tap-event-plugin';
import cfgreader from './config/readConfig';



cfgreader.readConfig(
    function (config) {
        window.config = config;
        authWithKeyCloak(config.endpointBase);
    }.bind(this)
);

function authWithKeyCloak(endpointBase) {
    let kc = new Keycloak(endpointBase + 'config/keycloak.json');

    kc
        .init({onLoad: 'login-required', checkLoginIframe: false, useNonce:false })
        .success(authenticated => {
            if (authenticated) {
                localStorage.setItem('NINKASI::jwt', kc.token);


                setInterval(() => {
                    kc.updateToken(10).error(() => kc.logout());
                    localStorage.setItem('NINKASI::jwt', kc.token);
                }, 10000);

                   if (canAccessNinkasi(kc)){
                       renderIndex(kc);
                   }else{
                       renderUnauthorizedMessage();
                   }
            } else {
                kc.login();
            }
        });
}

function canAccessNinkasi(kc) {
    for (let i = 0; i < kc.tokenParsed.realm_access.roles.length; i++) {
        let role =  kc.tokenParsed.realm_access.roles[i];
        if (role === "canAccessNinkasi"){
            return true;
        }
    }
    return false;
}

function renderUnauthorizedMessage() {

    render(
        <div>
            <div>
                <p>Unauthorized</p>
            </div>
        </div>,
        document.getElementById('root')
    );
}

function renderIndex(kc) {
    const store = configureStore(kc);
    injectTapEventPlugin();

    render(
        <Provider store={store}>
            <App/>
        </Provider>,
        document.getElementById('root')
    );
}
