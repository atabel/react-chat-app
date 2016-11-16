export const addConversation = conversation => ({
    type: 'ADD_CONVERSATION',
    payload: conversation,
});

export const disconnectUser = userId => ({
    type: 'DISCONNECT_USER',
    payload: userId,
});

export const addMessage = message => (dispatch, getState) => {
    const {currentUser} = getState();
    const conversationId = message.sender === currentUser.id || message.receiver !== currentUser.id
        ? message.receiver
        : message.sender;

    return dispatch({
        type: 'ADD_MESSAGE',
        payload: {...message, conversationId},
    });
};

export const sendMessage = (messageText) => (dispatch, getState, {chatClient}) => {
    const {currentUser, currentConversation} = getState();
    const {time} = chatClient.sendMessage(messageText, currentConversation);
    const message = {
        sender: currentUser.id,
        text: messageText,
        time: time,
        receiver: currentConversation
    };
    dispatch(addMessage(message));
};

export const openConversation = conversationId => ({
    type: 'OPEN_CONVERSATION',
    payload: conversationId,
});

export const closeConversation = () => ({
    type: 'CLOSE_CONVERSATION',
});

