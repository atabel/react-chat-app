// @flow
import type {State} from './reducer';
import type {Conversation, Message} from './models';
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
