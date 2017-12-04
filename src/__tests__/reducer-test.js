//@flow
import reducer, {getCurrentUser} from '../reducer';

test('initial state', () => {
    expect(reducer(undefined, {})).toEqual({
        currentUser: null,
        messages: {},
        conversations: {},
    });
});

test('set current user', () => {
    const newCurrentUser = 'any user id';
    const newState = reducer(undefined, {type: 'SET_CURRENT_USER', payload: newCurrentUser});

    expect(getCurrentUser(newState)).toBe(newCurrentUser);
});

test('Add message', () => {
    const initialState = {messages: {}};
    const newMessage = {
        sender: 'sender user id',
        text: 'ola k ase',
        time: 12345,
        receiver: 'receiver id',
        conversationId: 'receiver id',
    };
    const expectedMessageId = 'sender user id_12345';

    const newState = reducer(initialState, {type: 'ADD_MESSAGE', payload: newMessage});

    expect(newState.messages).toEqual({
        'receiver id': {
            [expectedMessageId]: {
                sender: newMessage.sender,
                text: newMessage.text,
                time: newMessage.time,
                receiver: newMessage.receiver,
                id: expectedMessageId,
            },
        },
    });
});

test('Add conversation', () => {
    const initialState = {conversations: {}};
    const newConversation = {
        id: 'whateverid',
        avatar: 'avatar.com/whatever.jpg',
        name: 'Pedro',
        fullName: 'Pedro Ladaria',
    };

    const newState = reducer(initialState, {type: 'ADD_CONVERSATION', payload: newConversation});

    expect(newState.conversations).toEqual({
        [newConversation.id]: {
            ...newConversation,
            connected: true,
        },
    });
});
