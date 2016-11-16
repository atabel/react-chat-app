import React, {PropTypes as t} from 'react';
import {connect} from 'react-redux';
import chatClient from '../chat-client';
import Conversation from './conversation';
import ChatsListScreen from './chats-list-screen';
import FlipMove from 'react-flip-move';
import AppScreen from './app-screen';
import {getCurrentConversation} from '../reducer';
import {
    addMessage,
    addConversation,
    disconnectUser,
    closeConversation
} from '../actions';

const App = React.createClass({

    propTypes: {
        onReceiveMessage: t.func,
        onReceiveConversation: t.func,
        onCloseConversation: t.func,
        onUserDisconnects: t.func,
    },

    getInitialState() {
        return {closingConversation: false};
    },

    componentDidMount() {
        const {onReceiveConversation, onReceiveMessage, onUserDisconnects} = this.props;
        chatClient.on('message', ({sender, payload, time, receiver}) => {
            onReceiveMessage({sender, text: payload.text, media: payload.media, time, receiver});
        });

        chatClient.on('user', ({payload}) => {
            onReceiveConversation(payload)
        });

        chatClient.on('disconnect', ({payload: userId}) => {
            onUserDisconnects(userId);
        });

        chatClient.getUsers();
    },

    handleBackButtonPress() {
        this.setState({closingConversation: true});
    },

    handleFinishAnimation() {
        if (this.state.closingConversation) {
            this.props.onCloseConversation();
            this.setState({closingConversation: false});
        }
    },

    renderConversation() {
        return (
            <AppScreen
                title={this.props.currentConversation.fullName}
                icon={require('../assets/ic_arrow_back.svg')}
                onClickIcon={this.handleBackButtonPress}
            >
                <Conversation />
            </AppScreen>
        );
    },

    renderChatsList() {
        return <ChatsListScreen />;
    },

    render() {
        const {currentConversation} = this.props;
        const {closingConversation} = this.state;
        const showConversation = currentConversation && !closingConversation;
        return (
            <FlipMove
                duration={200}
                enterAnimation={{
                    from: {
                        transform: closingConversation ? '' : 'translateX(50%)',
                        opacity: 0,
                    },
                    to: {
                        transform: '', opacity: 1,
                    },
                }}
                leaveAnimation={{
                    to: {
                        transform: closingConversation ? 'translateX(50%)' : '',
                        opacity: 0,
                    },
                }}
                onFinishAll={this.handleFinishAnimation}
            >
                {
                    showConversation ? (
                        <div key="conversation">
                            {this.renderConversation()}
                        </div>
                    ) : (
                        <div key="chats-list">
                            {this.renderChatsList()}
                        </div>
                    )
                }
            </FlipMove>
        );
    },
});

export default connect(
    state => ({
        currentConversation: getCurrentConversation(state)
    }),
    {
        onReceiveConversation: addConversation,
        onReceiveMessage: addMessage,
        onCloseConversation: closeConversation,
        onUserDisconnects: disconnectUser,
    }
)(App);
