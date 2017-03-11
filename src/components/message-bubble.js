// @flow
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

const avatarSize = 48;
const avatarStyle = {
    borderRadius: '50%',
    marginRight: 8,
    alignSelf: 'flex-end',
};

const leftMessageStyle = {
    maxWidth: `calc(80% - ${avatarSize}px)`,
};

const rightMessageStyle = {
    maxWidth: '80%',
};

const textMessageStyle = {
    fontSize: 14,
    padding: 8,
    borderRadius: 4,
    boxShadow: '0 1px .5px rgba(0,0,0,.13)',
};

const ownTextMessageStyle = {
    ...textMessageStyle,
    ...rightMessageStyle,
    background: '#2196F3',
    color: 'white',
};

const otherTextMessageStyle = {
    ...textMessageStyle,
    ...leftMessageStyle,
    background: 'white',
};

const timeStyle = {
    float: 'right',
    margin: '8px -4px -4px 12px',
    fontSize: 11,
    opacity: 0.4,
};

const imgTimeStyle = {
    position: 'absolute',
    right: 8,
    bottom: 8,
    padding: '2px 4px',
    color: 'white',
    background: 'rgba(0,0,0,0.5)',
    fontSize: 11,
    borderRadius: 4,
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
        <div style={ownTextMessageStyle}>
            <div>
                {children}
            </div>
        </div>
    </div>
);

const OwnImage = ({children}) => (
    <div style={messageContainerRightStyle}>
        <div style={rightMessageStyle}>
            {children}
        </div>
    </div>
);

const Avatar = ({sender}) => (
    <img style={avatarStyle} width={avatarSize} height={avatarSize} src={sender.avatar} alt={`${sender.name} avatar`} />
);

const OtherMessage = ({sender, children}) => (
    <div style={messageContainerLeftStyle}>
        <Avatar sender={sender} />
        <div style={otherTextMessageStyle}>
            <div style={{fontWeight: 500, marginBottom: 4, color: getUserColor(sender)}}>
                {sender.name}
            </div>
            <div>
                {children}
            </div>
        </div>
    </div>
);

const OtherImage = ({sender, children}) => (
    <div style={messageContainerLeftStyle}>
        <Avatar sender={sender} />
        <div style={leftMessageStyle}>
            {children}
        </div>
    </div>
);

const Media = ({
    url,
    title,
    description,
    image,
    embed,
    isOwnMessage,
}) => (
    <div
        style={{
            background: isOwnMessage ? '#72bcf8' : '#eee',
            padding: 8,
            marginTop: 8,
            fontSize: 13,
        }}
    >
        <a href={url} style={{color: 'inherit', textDecoration: 'inherit'}} target="_blank">
            {title && <h3 style={{marginBottom: 8, fontWeight: 500}}>{title}</h3>}
            {description && <p style={{fontStyle: 'italic', marginBottom: 8}}>{description}</p>}
            {image && <img style={{width: '100%'}} src={image.url} alt={image.url} />}
        </a>
    </div>
);

const isImg = ({title, description, image, url} = {}) =>
    url && !title && !description && !image;

type Props = {
    sender: Object,
    text: string,
    media: Object,
    time: number,
    me: Object,
};

const MessageBubble = ({sender, text, media, time, me}: Props) => {
    const isOwnMessage = sender.id === me.id;

    const MessageWrapper = isOwnMessage ? OwnMessage : OtherMessage;
    const ImgWrapper = isOwnMessage ? OwnImage : OtherImage;

    return isImg(media) ? (
        <ImgWrapper sender={sender}>
            <div style={{position: 'relative'}}>
                <img style={{width: '100%', borderRadius: 4, overflow: 'hidden'}} src={media.url} alt={media.url} />
                <span style={imgTimeStyle}>
                    {formatTime(time)}
                </span>
            </div>
        </ImgWrapper>
    ) : (
        <MessageWrapper sender={sender}>
            <span style={{wordBreak: 'break-word', whiteSpace: 'pre-wrap'}}>
                {text}
            </span>
            {media && <Media {...media} isOwnMessage={isOwnMessage} />}
            <span style={timeStyle}>
                {formatTime(time)}
            </span>
        </MessageWrapper>
    );
}

export default MessageBubble
