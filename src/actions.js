// @flow
import type {State} from './reducer';
import {getCurrentUser} from './reducer';
import type {Conversation, Message, User} from './models';
import {loadState, storeSession} from './storage';

type AddConversationAction = {type: 'ADD_CONVERSATION', payload: Conversation};
type DisconnectUserAction = {type: 'DISCONNECT_USER', payload: string};
type AddMessageAction = {type: 'ADD_MESSAGE', payload: Message};
type SetCurrentUserAction = {type: 'SET_CURRENT_USER', payload: User};
type SetMessagesAction = {type: 'SET_MESSAGES', payload: {[id: string]: Message}};
type SetConversationsAction = {type: 'SET_CONVERSATIONS', payload: {[id: string]: Conversation}};

export type Action =
    | AddConversationAction
    | DisconnectUserAction
    | AddMessageAction
    | SetCurrentUserAction
    | SetMessagesAction
    | SetConversationsAction;

// eslint-disable-next-line no-use-before-define
type ThunkAction = (dispatch: Dispatch, getState: GetState, {chatClient: Object}) => any;
type Dispatch = (action: Action | ThunkAction) => any;
type GetState = () => State;

export const addConversation = (conversation: Conversation): AddConversationAction => ({
    type: 'ADD_CONVERSATION',
    payload: conversation,
});

export const disconnectUser = (userId: string): DisconnectUserAction => ({
    type: 'DISCONNECT_USER',
    payload: userId,
});

export const addMessage = (message: Message): ThunkAction => (dispatch, getState) => {
    const currentUser = getCurrentUser(getState());
    const conversationId =
        message.sender === currentUser.id || message.receiver !== currentUser.id ? message.receiver : message.sender;

    return dispatch({
        type: 'ADD_MESSAGE',
        payload: {...message, conversationId},
    });
};

export const sendMessage = (messageText: string, conversationId: string): ThunkAction => (
    dispatch,
    getState,
    {chatClient}
) => {
    const currentUser = getCurrentUser(getState());
    const {time} = chatClient.sendMessage(messageText, conversationId);
    const message = {
        sender: currentUser.id,
        text: messageText,
        time: time,
        receiver: conversationId,
    };
    dispatch(addMessage(message));
};

export const initSession = (userInfo: User, sessionToken: string): ThunkAction => (
    dispatch,
    getState,
    {chatClient}
) => {
    storeSession(sessionToken, userInfo);
    chatClient.init(sessionToken);
    const {messages, conversations} = loadState(userInfo.id);

    dispatch({
        type: 'SET_CURRENT_USER',
        payload: userInfo,
    });
    dispatch({
        type: 'SET_MESSAGES',
        payload: messages,
    });
    dispatch({
        type: 'SET_CONVERSATIONS',
        payload: conversations,
    });
};
