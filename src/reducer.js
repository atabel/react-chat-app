// @flow weak
import {combineReducers} from 'redux';

const flatMap = (list, fn) =>
    [].concat(...list.map(fn));

const unique = (list) => Array.from(new Set(list));

const getMessageId = message =>
    `${message.sender}_${message.time}`;

const messages = (state = {}, {type, payload}) => {
    if (type === 'ADD_MESSAGE') {
        const {conversationId, ...message} = payload;
        const messageId = getMessageId(message);
        return {
            ...state,
            [conversationId]: {
                ...state[conversationId],
                [messageId]: {...message, id: messageId},
            },
        };
    }

    return state;
}

const conversations = (state = {}, {type, payload}) => {
    if (type === 'ADD_CONVERSATION') {
        return {...state, [payload.id]: {...payload, connected: true}};
    } else if (type === 'DISCONNECT_USER') {
        if (payload in state) {
            return {...state, [payload]: {...state[payload], connected: false}};
        }
    }
    return state;
}

const currentUser = (state = null, {type, payload}) =>
    (type === 'SET_CURRENT_USER') ? payload : state;

export default combineReducers({
    currentUser,
    messages,
    conversations,
});

export const getCurrentUser = state => state.currentUser;

export const getUser = state => userId => state.conversations[userId];
export const getConversation = (state, conversationId) => getUser(state)(conversationId);

export const getConversationMessages = (state, conversationId) => {
    const messages = state.messages[conversationId] || {};
    return Object.keys(messages).map(cid => messages[cid]);
};

export const getConversationUsers = (state, conversationId) =>
    unique(flatMap(getConversationMessages(state, conversationId), ({sender, receiver}) => [sender, receiver]))
        .map(getUser(state));

const getLastMessage = (state, conversation) => {
    const messages = getConversationMessages(state, conversation);
    if (messages.length > 0) {
        return messages[messages.length - 1];
    } else {
        return null;
    }
};

export const getConversations = state => {
    const me = getCurrentUser(state);
    return Object.keys(state.conversations)
        .filter(id => id !== me.id)
        .map(id => state.conversations[id])
        .map(conversation => {
            const lastMessage = getLastMessage(state, conversation.id);
            return {
                ...conversation,
                lastMessage: lastMessage ? {
                    ...lastMessage,
                    sender: getUser(state)(lastMessage.sender),
                } : null,
            };
        });
};
