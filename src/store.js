/* @flow */
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import debounce from 'lodash/debounce';
import chatClient from './chat-client';
import {loadState, storeState, loadSession} from './storage';
import reducer from './reducer';
import type {State} from './reducer';

const getInitialState = ({conversations, messages} = {}, user = null) => {
    const state = {
        conversations: {
            ...conversations,
            all: {
                name: 'All',
                fullName: 'All',
                id: 'all',
                avatar: require('./assets/ic_group.svg'),
            },
            ...(user ? {[user.id]: user} : {}),
        },
        currentUser: user,
        messages,
    };

    return state;
};

const configStore = () => {
    const {user, sessionToken} = loadSession();
    if (sessionToken) {
        chatClient.init(sessionToken);
    }
    const persistedState = user ? loadState(user.id) : {};

    const store = createStore(
        reducer,
        getInitialState(persistedState, user),
        applyMiddleware(thunk.withExtraArgument({chatClient}))
    );

    store.subscribe(
        debounce(() => {
            const {messages, conversations, currentUser}: State = store.getState();
            if (currentUser) {
                storeState({messages, conversations}, currentUser.id);
            }
        }, 1000)
    );

    return store;
};

export default configStore;
