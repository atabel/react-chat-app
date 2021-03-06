// @flow
import * as React from 'react';
import {connect} from 'react-redux';
import type {MapStateToProps} from 'react-redux';
import chatBackground from '../assets/background2.png';
import FlipMove from 'react-flip-move';
import ChatBar from './chat-bar';
import {getConversationMessages, getConversationUsers, getCurrentUser} from '../reducer';
import MessageBubble from './message-bubble';
import type {State as StoreState} from '../reducer';

const getScrollToBottomDistance = node => {
    // this should not be needed, but flow thinks this node can be an Element instead of HTMLElement
    if (node instanceof HTMLElement) {
        return node.scrollHeight - (node.scrollTop + node.offsetHeight);
    }
    return 0;
};

const byTime = (message1, message2) => message1.time - message2.time;

const conversationStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
};

const messagesListContainerStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundImage: `url(${chatBackground})`,
    backgroundColor: 'rgba(0,0,0,0.05)',
    backgroundRepeat: 'repeat',
};

const bubbleContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
};

type Props = {
    messages: *,
    currentUser: *,
    users: *,
};

type State = {
    windowHeight: number,
};

class Conversation extends React.Component<Props, State> {
    state = {windowHeight: window.innerHeight};
    shouldScrollBottom = false;
    list = null;

    componentWillUpdate(nextProps) {
        let iHaveJustSentAMessage = false;
        if (nextProps.messages !== this.props.messages) {
            if (nextProps.messages.length > 0) {
                const lastMessage = nextProps.messages[nextProps.messages.length - 1];
                iHaveJustSentAMessage = lastMessage.sender === nextProps.currentUser.id;
            }
        }
        this.shouldScrollBottom = iHaveJustSentAMessage || getScrollToBottomDistance(this.list) === 0;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.shouldScrollBottom) {
            this.scrollToBottom();
        }
        if (this.list) {
            this.list.scrollTop += prevState.windowHeight - this.state.windowHeight;
        }
    }

    componentDidMount() {
        this.scrollToBottom();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        this.setState({windowHeight: window.innerHeight});
    };

    scrollToBottom = () => {
        if (this.list) {
            this.list.scrollTop = this.list.scrollHeight;
        }
    };

    getMessagePosition = node => {
        // As we are going to scroll to bottom before the animation start,
        // we need to apply the scroll-to-bottom distance correction
        const scrollCorrection =
            this.shouldScrollBottom && node.parentElement
                ? getScrollToBottomDistance(node.parentElement.parentElement)
                : 0;
        const {left, top, right, bottom, height, width} = node.getBoundingClientRect();
        return {
            left,
            right,
            bottom: bottom - scrollCorrection,
            top: top - scrollCorrection,
            height,
            width,
        };
    };

    getUser = id => {
        return this.props.users.find(user => user.id === id);
    };

    render() {
        const {messages} = this.props;

        return (
            <div style={conversationStyle}>
                <div style={messagesListContainerStyle}>
                    <div style={{overflow: 'auto'}} ref={node => (this.list = node)}>
                        <FlipMove
                            duration={200}
                            typeName="ul"
                            enterAnimation={{
                                from: {transform: 'scaleY(0)', transformOrigin: 'bottom'},
                                to: {transform: '', transformOrigin: 'bottom'},
                            }}
                            getPosition={this.getMessagePosition}
                        >
                            {messages
                                .sort(byTime)
                                .map(message => ({
                                    ...message,
                                    senderUser: this.getUser(message.sender),
                                }))
                                .map(({senderUser, text, time, media}) => (
                                    <li key={`${senderUser.id}-${time}`} style={bubbleContainerStyle}>
                                        <MessageBubble
                                            {...{sender: senderUser, text, time, media}}
                                            me={this.props.currentUser}
                                        />
                                    </li>
                                ))}
                        </FlipMove>
                    </div>
                </div>
                <ChatBar />
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<StoreState, {conversationId: string}, Props> = (state, props) => ({
    messages: getConversationMessages(state, props.conversationId),
    users: getConversationUsers(state, props.conversationId),
    currentUser: getCurrentUser(state),
});

export default connect(mapStateToProps)(Conversation);
