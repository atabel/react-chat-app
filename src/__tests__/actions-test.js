import test from 'ava';
import {sendMessage, addMessage} from '../actions';
import {spy} from 'sinon';

test('send message', t => {
    const messageText = 'ola k ase';
    const getState = () => ({
        currentUser: 'me',
        currentConversation: 'convid',
    });

    const chatClientMock = {
        sendMessage(text, conversation) {
            t.is(text, messageText);
            t.is(conversation, 'convid');
            return 1234;
        },
    };

    const dispatchSpy = spy();

    sendMessage(messageText)(dispatchSpy, getState, {chatClient: chatClientMock});

    t.true(dispatchSpy.called);
});

test('add message sent by me', t => {
    const getState = () => ({
        currentUser: {id: 'me'},
    });

    const dispatchSpy = spy();

    addMessage({
        sender: 'me',
        receiver: 'other',
        text: 'ola k ase',
    })(dispatchSpy, getState);

    t.true(
        dispatchSpy.calledWith({
            type: 'ADD_MESSAGE',
            payload: {
                sender: 'me',
                receiver: 'other',
                text: 'ola k ase',
                conversationId: 'other',
            },
        })
    );
});

test('add message sent by other', t => {
    const getState = () => ({
        currentUser: {id: 'me'},
    });

    const dispatchSpy = spy();

    addMessage({
        sender: 'other',
        receiver: 'me',
        text: 'ola k ase',
    })(dispatchSpy, getState);

    t.true(
        dispatchSpy.calledWith({
            type: 'ADD_MESSAGE',
            payload: {
                sender: 'other',
                receiver: 'me',
                text: 'ola k ase',
                conversationId: 'other',
            },
        })
    );
});
