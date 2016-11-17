import React, {PropTypes as t} from 'react';
import {connect} from 'react-redux';
import SendIcon from './send-icon';
import {sendMessage} from '../actions';

const barStyle = {
    height: 50,
    display: 'flex',
    paddingLeft: 16,
};

const inputStyle = {
    border: 'none',
    outline: 'none',
    flex: 1,
};

const buttonStyle = {
    padding: '8px 16px',
    border: 'none',
    background: 'transparent',
    outline: 'none',
};

const ChatBar = React.createClass({
    propTypes: {
        onSend: t.func,
    },

    getInitialState() {
        return {text: ''};
    },

    handleSubmit(e) {
        e.preventDefault();
        const messageText = this.state.text.trim();
        if (messageText.length > 0) {
            this.props.onSend(messageText);
            this.setState({text: ''});
            this.input.focus();
        }
    },

    render() {
        const {text} = this.state;
        return (
            <form onSubmit={this.handleSubmit} style={barStyle}>
                <input
                    ref={node => this.input = node}
                    style={inputStyle}
                    type="text"
                    placeholder="type a message"
                    value={text}
                    onChange={evt => this.setState({text: evt.target.value})}
                />
                <button style={buttonStyle}>
                    <SendIcon color={text.trim().length > 0 ? '#2196F3' : '#ccc'} />
                </button>
            </form>
        );
    },
});

export default connect(
    null,
    {onSend: sendMessage}
)(ChatBar);