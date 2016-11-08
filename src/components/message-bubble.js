import React from 'react';

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

const OwnMessage = ({children}) => (
    <div style={messageContainerRightStyle}>
        <div style={messageRightStyle}>
            <div>
                {children}
            </div>
        </div>
    </div>
);

const OtherMessage = ({sender, children}) => (
    <div style={messageContainerLeftStyle}>
        <img style={avatarStyle} width={48} height={48} src={sender.avatar} alt={`${sender.name} avatar`} />
        <div style={messageLeftStyle}>
            <div style={{fontWeight: 500, marginBottom: 4, color: getUserColor(sender)}}>
                {sender.name}
            </div>
            <div>
                {children}
            </div>
        </div>
    </div>
);

const MessageBubble = ({sender, text, time, me}) => {
    const MessageWrapper = sender.id === me.id
        ? OwnMessage
        : OtherMessage;

    return (
        <MessageWrapper sender={sender}>
            <span style={{wordBreak: 'break-word'}}>
                {text}
            </span>
            <span style={timeStyle}>
                {formatTime(time)}
            </span>
        </MessageWrapper>
    )
}

export default MessageBubble