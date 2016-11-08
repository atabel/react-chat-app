import React, {PropTypes as t} from 'react';
import {connect} from 'react-redux';
import chatBackground from '../assets/background2.png';
import FlipMove from 'react-flip-move';
import ChatBar from './chat-bar';
import {getCurrentConversationMessages, getCurrentConversationUsers, getCurrentUser} from '../reducer';
import {sendMessage} from '../actions'

const userNameColors = [
    '#35cd96', '#6bcbef', '#e542a3', '#91ab01',
    '#ffa97a', '#1f7aec', '#dfb610', '#029d00',
    '#8b7add', '#fe7c7f', '#ba33dc', '#59d368',
    '#b04632', '#fd85d4', '#8393ca', '#ff8f2c',
    '#a3e2cb', '#b4876e', '#c90379', '#ef4b4f',
];

const colorForUserId = {};
let lastAssignedColorIdx = -1;
const getUserColor = user => {
    let color = colorForUserId[user.id];
    if (!color) {
        lastAssignedColorIdx = (lastAssignedColorIdx + 1) % userNameColors.length;
        color = userNameColors[lastAssignedColorIdx];
        colorForUserId[user.id] = color;
    }
    return color;
};

const getScrollToBottomDistance = (node) =>
    node.scrollHeight - (node.scrollTop + node.offsetHeight);

const byTime = (message1, message2) =>
    message1.time - message2.time;

const messageContainerStyle = {
    padding: 8,
    display: 'flex',
};

const messageContainerRightStyle = {
    ...messageContainerStyle,
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
};

const messageContainerLeftStyle = {
    ...messageContainerStyle,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
};

const avatarStyle = {
    borderRadius: '50%',
    marginRight: 8,
    alignSelf: 'flex-end',
};

const messageStyle = {
    fontSize: 14,
    maxWidth: '80%',
    padding: 8,
    borderRadius: 4,
    boxShadow: '0 1px .5px rgba(0,0,0,.13)',
};

const messageRightStyle = {
    ...messageStyle,
    background: '#2196F3',
    color: 'white',
};

const messageLeftStyle = {
    ...messageStyle,
    background: 'white',
};

const timeStyle = {
    float: 'right',
    margin: '8px -4px -4px 12px',
    fontSize: 11,
    opacity: 0.4,
};

const twoDigits = num =>
    num >= 10 ? `${num}` : `0${num}`;

const formatTime = timestamp => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = twoDigits(date.getMinutes());
    return `${hours}:${minutes}`;
};

const Conversation = React.createClass({

    propTypes: {
        messages: t.arrayOf(t.shape({
            text: t.string,
            time: t.number,
            sender: t.string, //id
        })),
        onSend: t.func,
        currentUser: t.object,
        users: t.arrayOf(t.object),
    },

    componentWillUpdate() {
        this.shouldScrollBottom = getScrollToBottomDistance(this.list) === 0;
    },

    componentDidUpdate() {
        if (this.shouldScrollBottom) {
            this.list.scrollTop = this.list.scrollHeight;
        }
    },

    componentDidMount() {
        this.list.scrollTop = this.list.scrollHeight;
    },

    isMe(user) {
        return user.id === this.props.currentUser.id;
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
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        backgroundImage: `url(${chatBackground})`,
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        backgroundRepeat: 'repeat',
                    }}
                >
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
                                .map(({sender, text, time}) =>
                                <li
                                    style={{display: 'flex', flexDirection: 'column'}}
                                    key={`${sender.id}-${time}`}
                                >
                                    <div style={this.isMe(sender) ? messageContainerRightStyle : messageContainerLeftStyle}>
                                        {!this.isMe(sender) && (
                                            <img style={avatarStyle} width={48} height={48} src={sender.avatar} alt={`${sender.name} avatar`} />
                                        )}
                                        <div style={this.isMe(sender) ? messageRightStyle : messageLeftStyle}>
                                            {!this.isMe(sender) && (
                                                <div style={{fontWeight: 500, marginBottom: 4, color: getUserColor(sender)}}>
                                                    {sender.name}
                                                </div>
                                            )}
                                            <div>
                                                <span style={{wordBreak: 'break-word'}}>
                                                    {text}
                                                </span>
                                                <span style={timeStyle}>
                                                    {formatTime(time)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </FlipMove>
                    </div>
                </div>
                <ChatBar onSend={this.props.onSend} />
            </div>
        );
    },
});

export default connect(
    state => ({
        messages: getCurrentConversationMessages(state),
        users: getCurrentConversationUsers(state),
        currentUser: getCurrentUser(state),
    }),
    {onSend: sendMessage},
)(Conversation);