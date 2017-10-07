// @flow
import * as React from 'react';
import {connect} from 'react-redux';
import type {MapStateToProps} from 'react-redux';
import AppScreen from './app-screen';
import Conversation from './conversation';
import {getConversation} from '../reducer';
import type {Conversation as ConversationModel} from '../models';
import ArrowBackIcon from './icons/arrow-back-icon';

type Props = {
    conversation: ConversationModel,
    history: {goBack: Function},
};

const ConversationScreen = ({conversation, history}: Props) => (
    <AppScreen title={conversation.fullName} icon={<ArrowBackIcon />} onClickIcon={history.goBack}>
        <Conversation conversationId={conversation.id} />
    </AppScreen>
);

const mapStateToProps: MapStateToProps<*, *, *> = (state, {match: {params}}) => ({
    conversation: getConversation(state, params.conversationId),
});

export default connect(mapStateToProps)(ConversationScreen);
