// @flow
import type {State} from './reducer';
import type {Conversation, Message, User} from './models';
import {loadState, storeSession} from './storage';
type Dispatch = (action: Object) => void;
type GetState = () => State;

export const addConversation = (conversation: Conversation) => ({
    type: 'ADD_CONVERSATION',
    payload: conversation,
});

export const disconnectUser = (userId: string) => ({
    type: 'DISCONNECT_USER',
    payload: userId,
});

export const addMessage = (message: Message) =>
    (dispatch: Dispatch, getState: GetState) => {
        const {currentUser} = getState();
        const conversationId = message.sender === currentUser.id || message.receiver !== currentUser.id
            ? message.receiver
            : message.sender;

        return dispatch({
            type: 'ADD_MESSAGE',
            payload: {...message, conversationId},
        });
    };

export const sendMessage = (messageText: string, conversationId: string) =>
    (dispatch: Dispatch, getState: GetState, {chatClient}: Object) => {
        const {currentUser} = getState();
        const {time} = chatClient.sendMessage(messageText, conversationId);
        const message = {
            sender: currentUser.id,
            text: messageText,
            time: time,
            receiver: conversationId,
        };
        dispatch(addMessage(message));
    };

export const initSession = (userInfo: User, sessionToken: string) =>
    (dispatch: Dispatch, getState: GetState, {chatClient}: Object) => {
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
