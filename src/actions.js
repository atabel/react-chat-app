export const addConversation = conversation => ({
    type: 'ADD_CONVERSATION',
    payload: conversation,
});

export const addMessage = message => ({
    type: 'ADD_MESSAGE',
    payload: message,
})

export const sendMessage = (messageText) => (dispatch, getState, {chatClient}) => {
    const {currentUser, currentConversation} = getState();
    const message = {
        sender: currentUser.id,
        text: messageText,
        time: Date.now(),
        receiver: currentConversation
    };
    dispatch(addMessage(message));
    chatClient.sendMessage(messageText, currentConversation);
};

export const openConversation = conversationId => ({
    type: 'OPEN_CONVERSATION',
    payload: conversationId,
});

export const closeConversation = () => ({
    type: 'CLOSE_CONVERSATION',
});

