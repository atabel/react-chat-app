import React from 'react';
import {connect} from 'react-redux';
import AppScreen from './app-screen';
import Conversation from './conversation';
import {getConversation} from '../reducer';

const ConversationScreen = ({conversation, history}) =>
    <AppScreen title={conversation.fullName} icon={require('../assets/ic_arrow_back.svg')} onClickIcon={history.goBack}>
        <Conversation conversationId={conversation.id} />
    </AppScreen>;

export default connect((state, {match: {params}}) => ({
    conversation: getConversation(state, params.conversationId),
}))(ConversationScreen);
