import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import chatClient from './chat-client';
import createStore from './store';
import {Provider} from 'react-redux';
import {loadState, storeState} from './storage';
import debounce from 'lodash/debounce';

const initApp = (userInfo) => {
    const persistedState = loadState(userInfo.id);

    const store = createStore(persistedState, userInfo, chatClient);

    store.subscribe(debounce(() => {
        const {messages, conversations, currentUser} = store.getState();
        storeState({messages, conversations}, currentUser.id);
    }), 1000);

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

