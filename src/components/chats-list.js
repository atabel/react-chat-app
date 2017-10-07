// @flow
import * as React from 'react';
import {connect} from 'react-redux';
import type {MapStateToProps} from 'react-redux';
import FlipMove from 'react-flip-move';
import {getConversations, getCurrentUser} from '../reducer';
import {Link} from 'react-router-dom';

const chatRowStyle = {
    height: 64,
    display: 'flex',
    background: 'white',
};

const chatLinkStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    color: 'inherit',
    textDecoration: 'inherit',
};

const avatarStyle = {
    height: 48,
    width: 48,
    borderRadius: '50%',
    margin: '0 8px',
};

const rowContentStyle = {
    flex: 1,
    height: '100%',
    padding: '12px 8px 12px 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minWidth: 0,
    borderBottom: '1px solid #eee',
};

const ellipsis = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const titleStyle = {
    ...ellipsis,
    fontWeight: 500,
};

const previewStyle = {
    ...ellipsis,
    color: '#ccc',
};

const getConversationPreview = ({lastMessage, id: conversationId}, me) => {
    const isGroupChat = conversationId === 'all';
    if (lastMessage) {
        const {sender} = lastMessage;
        const senderName = sender.id === me.id ? 'me' : sender.name;
        return (
            <span>
                {isGroupChat && <span style={{color: '#2196F3'}}>{`${senderName}: `}</span>}
                <span>{lastMessage.text}</span>
            </span>
        );
    } else {
        return isGroupChat ? 'Talk with everyone!' : null;
    }
};

const byTime = (conversationA, conversationB) => {
    if (conversationA.lastMessage) {
        if (conversationB.lastMessage) {
            return conversationB.lastMessage.time - conversationA.lastMessage.time;
        }
        return -1;
    }
    return 1;
};

const matchesSearch = searchFilter => conversation =>
    conversation.fullName.toLowerCase().startsWith(searchFilter.toLowerCase());

const ChatsList = ({conversations, onSelectChat, currentUser, searchFilter = ''}) => (
    <FlipMove typeName="ul" duration={160}>
        {conversations
            .filter(matchesSearch(searchFilter))
            .sort(byTime)
            .map(conversation => (
                <li style={chatRowStyle} key={conversation.id}>
                    <Link to={`/conversation/${conversation.id}`} style={chatLinkStyle}>
                        <img style={avatarStyle} src={conversation.avatar} alt={`${conversation.name} avatar`} />
                        <div style={rowContentStyle}>
                            <div style={titleStyle}>{conversation.fullName}</div>
                            <div style={previewStyle}>
                                {conversation.connected === false && <span style={{color: '#2196F3'}}>(offline) </span>}
                                {getConversationPreview(conversation, currentUser) ||
                                    `${conversation.fullName} has joined!`}
                            </div>
                        </div>
                    </Link>
                </li>
            ))}
    </FlipMove>
);

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
    conversations: getConversations(state),
    currentUser: getCurrentUser(state),
});

export default connect(mapStateToProps)(ChatsList);
