import {sendMessage, addMessage} from '../actions';

test('send message', () => {
    const messageText = 'ola k ase';
    const getState = () => ({
        currentUser: 'me',
    });
    const conversationId = 'convid';

    const chatClientMock = {
        sendMessage(text, conversation) {
            expect(text).toBe(messageText);
            expect(conversation).toBe(conversationId);
            return 1234;
        },
    };

    const dispatchSpy = jest.fn();

    sendMessage(messageText, conversationId)(dispatchSpy, getState, {chatClient: chatClientMock});

    expect(dispatchSpy).toBeCalled();
});

test('add message sent by me', () => {
    const getState = () => ({
        currentUser: {id: 'me'},
    });

    const dispatchSpy = jest.fn();

    addMessage({
        sender: 'me',
        receiver: 'other',
        text: 'ola k ase',
    })(dispatchSpy, getState);

    expect(dispatchSpy).toBeCalledWith({
        type: 'ADD_MESSAGE',
        payload: {
            sender: 'me',
            receiver: 'other',
            text: 'ola k ase',
            conversationId: 'other',
        },
    });
});

test('add message sent by other', () => {
    const getState = () => ({
        currentUser: {id: 'me'},
    });

    const dispatchSpy = jest.fn();

    addMessage({
        sender: 'other',
        receiver: 'me',
        text: 'ola k ase',
    })(dispatchSpy, getState);

    expect(dispatchSpy).toBeCalledWith({
        type: 'ADD_MESSAGE',
        payload: {
            sender: 'other',
            receiver: 'me',
            text: 'ola k ase',
            conversationId: 'other',
        },
    });
});
