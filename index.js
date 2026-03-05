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

                const url = new URL(window.location.href);
                let parsed = parseCallbackParams(url.hash.substring(1), ['code', 'state', 'session_state', 'kc_action_status', 'kc_action', 'iss']);
                if (parsed.oauthParams && kc.authServerUrl + '/realms/' + kc.realm === parsed.oauthParams.iss) {
                    setInterval(() => {
                        kc.updateToken(10).error(() => kc.logout());
                        localStorage.setItem('NINKASI::jwt', kc.token);
                    }, 10000);
                    removeFragment();
                    if (canAccessNinkasi(kc)){
                        renderIndex(kc);
                    }else{
                        renderUnauthorizedMessage();
                    }
                } else {
                    kc.logout();
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


function parseCallbackParams(paramsString, supportedParams) {
    const params = paramsString.split('&')
    const oauthParams = {}
    let result = ''

    for (const param of params.reverse()) {
        const entry = new URLSearchParams(param).entries().next().value

        if (!entry) {
            result = '&' + result
            continue
        }

        const [key, value] = entry

        if (supportedParams.includes(key) && !(key in oauthParams)) {
            oauthParams[key] = value
        } else {
            result = result.length === 0 ? param : param + '&' + result
        }
    }

    return {
        paramsString: result,
        oauthParams
    }
}

function removeFragment() {
    window.location.replace("#");
    if (typeof window.history.replaceState == 'function') {
        history.replaceState({}, '', window.location.href.slice(0, -1));
    }
}