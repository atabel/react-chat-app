import React, {PropTypes as t} from 'react';
import {connect} from 'react-redux';
import chatBackground from '../assets/background2.png';
import FlipMove from 'react-flip-move';
import ChatBar from './chat-bar';
import {getCurrentConversationMessages, getCurrentConversationUsers, getCurrentUser} from '../reducer';
import MessageBubble from './message-bubble';

const getScrollToBottomDistance = (node) =>
    node.scrollHeight - (node.scrollTop + node.offsetHeight);

const byTime = (message1, message2) =>
    message1.time - message2.time;

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

const Conversation = React.createClass({

    propTypes: {
        messages: t.arrayOf(t.shape({
            text: t.string,
            time: t.number,
            sender: t.string, //id
        })),
        currentUser: t.object,
        users: t.arrayOf(t.object),
    },

    getInitialState() {
        return {windowHeight: window.innerHeight};
    },

    componentWillUpdate(nextProps) {
        let iHaveJustSentAMessage = false;
        if (nextProps.messages !== this.props.messages) {
            const lastMessage = nextProps.messages[nextProps.messages.length - 1];
            iHaveJustSentAMessage = lastMessage.sender === nextProps.currentUser.id;
        }
        this.shouldScrollBottom = iHaveJustSentAMessage || getScrollToBottomDistance(this.list) === 0;
    },

    componentDidUpdate(prevProps, prevState) {
        if (this.shouldScrollBottom) {
            this.scrollToBottom();
        }
        this.list.scrollTop += prevState.windowHeight - this.state.windowHeight;
    },

    componentDidMount() {
        this.scrollToBottom();
        window.addEventListener('resize', this.handleResize);
    },

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },

    handleResize() {
        this.setState({windowHeight: window.innerHeight});
    },

    scrollToBottom() {
        this.list.scrollTop = this.list.scrollHeight;
    },

    getMessagePosition(node) {
        // As we are going to scroll to bottom before the animation start,
        // we need to apply the scroll-to-bottom distance correction
        const scrollCorrection = this.shouldScrollBottom
            ? getScrollToBottomDistance(node.parentElement.parentElement)
            : 0;
        const {left, top} = node.getBoundingClientRect();
        return {
            left,
            top: top - scrollCorrection,
        };
    },

    getUser(id) {
        return this.props.users.find(user => user.id === id);
    },

    render() {
        const {messages} = this.props;

        return (
            <div style={conversationStyle}>
                <div style={messagesListContainerStyle}>
                    <div style={{overflow: 'auto'}} ref={node => this.list = node}>
                        <FlipMove
                            duration={200}
                            typeName="ul"
                            enterAnimation={{
                                from: { transform: 'scaleY(0)', transformOrigin: 'bottom' },
                                to: { transform: '', transformOrigin: 'bottom' },
                            }}
                            getPosition={this.getMessagePosition}
                        >
                            {messages.sort(byTime)
                                .map((message) => ({...message, sender: this.getUser(message.sender)}))
                                .map(({sender, text, time, media}) =>
                                <li key={`${sender.id}-${time}`} style={bubbleContainerStyle}>
                                    <MessageBubble {...{sender, text, time, media}} me={this.props.currentUser} />
                                </li>
                            )}
                        </FlipMove>
                    </div>
                </div>
                <ChatBar />
            </div>
        );
    },
});

export default connect(
    state => ({
        messages: getCurrentConversationMessages(state),
        users: getCurrentConversationUsers(state),
        currentUser: getCurrentUser(state),
    })
)(Conversation);