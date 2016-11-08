import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import chatClient from './chat-client';
import createStore from './store';
import {Provider} from 'react-redux';

const initApp = (userInfo) => {
    const store = createStore(userInfo, chatClient);
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root')
    );
};

window.onSignIn = (googleUser) => {
    const profile = googleUser.getBasicProfile();
    const token = googleUser.getAuthResponse().id_token;

    const userInfo = {
        id: profile.getId(),
        fullName: profile.getName(),
        avatar: profile.getImageUrl(),
        name: profile.getGivenName(),
        familyName: profile.getFamilyName(),
        email: profile.getEmail(),
    };

    console.log({userInfo, token});

    chatClient.init(token);

    setTimeout(() => {
        document.getElementById('signInButton').remove();
        initApp(userInfo);
    }, 500);
};

