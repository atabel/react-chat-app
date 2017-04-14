import test from 'ava';
import reducer, {getCurrentUser} from '../reducer';

test('initial state', t => {
    t.deepEqual(reducer({}, {}), {
        currentUser: null,
        messages: {},
        conversations: {},
        currentConversation: null,
    });
});

test('set current user', t => {
    const initialState = {currentUser: null};
    const newCurrentUser = 'any user id';
    const newState = reducer(initialState, {type: 'SET_CURRENT_USER', payload: newCurrentUser});

    t.is(getCurrentUser(newState), newCurrentUser);
});

test('Add message', t => {
    const initialState = {messages: {}};
    const newMessage = {
        sender: 'sender user id',
        text: 'ola k ase',
        time: 12345,
        receiver: 'receiver id',
        conversationId: 'receiver id'
    };
    const expectedMessageId = 'sender user id_12345';

    const newState = reducer(initialState, {type: 'ADD_MESSAGE', payload: newMessage});

    t.deepEqual(newState.messages, {
        'receiver id': {
            [expectedMessageId]: {
                sender: newMessage.sender,
                text: newMessage.text,
                time: newMessage.time,
                receiver: newMessage.receiver,
                id: expectedMessageId,
            },
        },
    })
});

test('Add conversation', t => {
    const initialState = {conversations: {}};
    const newConversation = {
        id: 'whateverid',
        avatar: 'avatar.com/whatever.jpg',
        name: 'Pedro',
        fullName: 'Pedro Ladaria',
    };

    const newState = reducer(initialState, {type: 'ADD_CONVERSATION', payload: newConversation});

    t.deepEqual(newState.conversations, {
        [newConversation.id]: {
            ...newConversation,
            connected: true,
        },
    })
})