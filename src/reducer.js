// @flow
import {combineReducers} from 'redux';
import type {Message, Conversation, User} from './models';
import type {Action} from './actions';

const flatMap = (list, fn) => [].concat(...list.map(fn));

const unique = list => Array.from(new Set(list));

const getMessageId = message => `${message.sender}_${message.time}`;

const messages = (state = {}, action: Action) => {
    if (action.type === 'ADD_MESSAGE') {
        const {conversationId, ...message} = action.payload;
        const messageId = getMessageId(message);
        return {
            ...state,
            [conversationId]: {
                ...state[conversationId],
                [messageId]: {...message, id: messageId},
            },
        };
    } else if (action.type === 'SET_MESSAGES') {
        return action.payload || state;
    }

    return state;
};

const conversations = (state = {}, action: Action) => {
    if (action.type === 'ADD_CONVERSATION' || action.type === 'SET_CURRENT_USER') {
        return {...state, [action.payload.id]: {...action.payload, connected: true}};
    } else if (action.type === 'DISCONNECT_USER') {
        if (action.payload in state) {
            return {...state, [action.payload]: {...state[action.payload], connected: false}};
        }
    } else if (action.type === 'SET_CONVERSATIONS') {
        return action.payload || state;
    }
    return state;
};

const currentUser = (state: ?User = null, action: Action) =>
    action.type === 'SET_CURRENT_USER' ? action.payload : state;

export default combineReducers({
    currentUser,
    messages,
    conversations,
});

export type State = {
    currentUser: ?User,
    messages: {
        [conversationId: string]: {
            [messageId: string]: Message,
        },
    },
    conversations: {
        [conversationId: string]: Conversation,
    },
};

export const getCurrentUser = (state: State) => state.currentUser || {id: ''};

export const getUser = (state: State) => (userId: string) => state.conversations[userId];
export const getConversation = (state: State, conversationId: string): Conversation => getUser(state)(conversationId);

export const getConversationMessages = (state: State, conversationId: string): Array<Message> => {
    const messages = state.messages[conversationId] || {};
    return Object.keys(messages).map(cid => messages[cid]);
};

export const getConversationUsers = (state: State, conversationId: string): Array<User> =>
    unique(flatMap(getConversationMessages(state, conversationId), ({sender, receiver}) => [sender, receiver])).map(
        getUser(state)
    );

const getLastMessage = (state, conversation) => {
    const messages = getConversationMessages(state, conversation);
    if (messages.length > 0) {
        return messages[messages.length - 1];
    } else {
        return null;
    }
};

export const getConversations = (state: State) => {
    const me = getCurrentUser(state);
    return Object.keys(state.conversations)
        .filter(id => id !== me.id)
        .map(id => state.conversations[id])
        .map(conversation => {
            const lastMessage = getLastMessage(state, conversation.id);
            if (lastMessage === null) {
                return {
                    ...conversation,
                    lastMessage: null,
                };
            }
            const {sender, ...rest} = lastMessage;
            return {
                ...conversation,
                lastMessage: {
                    ...rest,
                    sender: getUser(state)(lastMessage.sender),
                },
            };
        });
};
