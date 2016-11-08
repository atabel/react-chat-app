import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

export default (user, chatClient) =>
    createStore(reducer, {
        conversations: {
            all: {
                name: 'All',
                fullName: 'All',
                id: 'all',
                avatar: require('./assets/ic_group.svg'),
            },
            [user.id]: user,
        },
        currentUser: user,
    }, applyMiddleware(thunk.withExtraArgument({chatClient})));