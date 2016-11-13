import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

const getInitialState = ({conversations, messages} = {}, user) => {
    const state = {
        conversations: {
            ...conversations,
            all: {
                name: 'All',
                fullName: 'All',
                id: 'all',
                avatar: require('./assets/ic_group.svg'),
            },
            [user.id]: user,
        },
        currentUser: user,
        messages,
    };

    return state;
};

const configStore = (persistedState, user, chatClient) =>
    createStore(
        reducer,
        getInitialState(persistedState, user),
        applyMiddleware(thunk.withExtraArgument({chatClient}))
    );

export default configStore;