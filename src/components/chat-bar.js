import React, {PropTypes as t} from 'react';
import SendIcon from './send-icon';

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
        }
    },

    render() {
        const {text} = this.state;
        return (
            <form onSubmit={this.handleSubmit} style={barStyle}>
                <input
                    style={inputStyle}
                    type="text"
                    ref={node => (this.input = node)}
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

export default ChatBar;