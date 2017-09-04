// @flow
import * as React from 'react';
import {connect} from 'react-redux';
import chatClient from '../chat-client';
import ChatsListScreen from './chats-list-screen';
import ConversationScreen from './conversation-screen';
import FlipMove from 'react-flip-move';
import {addMessage, addConversation, disconnectUser} from '../actions';
import {Route, Redirect} from 'react-router-dom';

import type {Conversation, Message} from '../models';

const isOpeningConversation = ({pathname}) => pathname.indexOf('conversation/') !== -1;

type Props = {
    onReceiveMessage: (m: Message) => void,
    onReceiveConversation: (c: Conversation) => void,
    onUserDisconnects: (uid: string) => void,
    location: {
        key: string,
        pathname: string,
    },
};

class App extends React.Component<Props> {
    componentDidMount() {
        const appContainer = document.getElementById('root');
        if (appContainer) {
            appContainer.style.background = 'black';
        }

        const {onReceiveConversation, onReceiveMessage, onUserDisconnects} = this.props;

        chatClient.onMessage(({sender, payload, time, receiver}) => {
            onReceiveMessage({sender, text: payload.text, media: payload.media, time, receiver});
        });

        chatClient.onUser(({payload}) => {
            onReceiveConversation(payload);
        });

        chatClient.onUserDisconnects(({payload: userId}) => {
            onUserDisconnects(userId);
        });

        chatClient.getUsers();
    }

    render() {
        const {location} = this.props;
        return (
            <FlipMove
                style={{height: '100%'}}
                duration={200}
                enterAnimation={{
                    from: location.pathname.indexOf('/conversations') !== -1
                        ? {
                              transform: '',
                              opacity: '0.5',
                          }
                        : {
                              transform: 'translateX(50%)',
                              opacity: '0',
                          },
                    to: {
                        transform: '',
                        opacity: '1',
                    },
                }}
                leaveAnimation={{
                    from: {
                        transform: '',
                        opacity: '1',
                    },
                    to: location.pathname.indexOf('/conversations') !== -1
                        ? {
                              transform: 'translateX(50%)',
                              opacity: '0',
                          }
                        : {
                              transform: '',
                              opacity: '0.5',
                          },
                }}
            >
                <Redirect exact from="/" to="/conversations" />
                <Route
                    location={location}
                    key={isOpeningConversation(location) ? location.key : 'list'}
                    path="/conversations"
                    component={ChatsListScreen}
                />
                <Route
                    location={location}
                    key={location.key + 'conv'}
                    path="/conversation/:conversationId"
                    component={ConversationScreen}
                />
            </FlipMove>
        );
    }
}

export default connect(null, {
    onReceiveConversation: addConversation,
    onReceiveMessage: addMessage,
    onUserDisconnects: disconnectUser,
})(App);
