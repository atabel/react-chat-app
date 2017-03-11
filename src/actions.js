// @flow weak
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

export const sendMessage = (messageText, conversationId) => (dispatch, getState, {chatClient}) => {
    const {currentUser} = getState();
    const {time} = chatClient.sendMessage(messageText, conversationId);
    const message = {
        sender: currentUser.id,
        text: messageText,
        time: time,
        receiver: conversationId
    };
    dispatch(addMessage(message));
};
