// @flow
import * as React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import SendIcon from './icons/send-icon';
import EmojiIcon from './icons/emoji-icon';
import KeyboardIcon from './icons/keyboard-icon';
import EmojiSelector from './emoji-selector';
import {sendMessage} from '../actions';

const barStyle = {
    height: 50,
    display: 'flex',
};

const formStyle = {flex: 1, display: 'flex'};

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

class ChatBar extends React.Component<
    {
        onSend: Function,
        match: {params: {conversationId?: string}},
    },
    {
        text: string,
        emojiSelectorOpen: boolean,
    }
> {
    state = {text: '', emojiSelectorOpen: false};
    input = null;

    handleSubmit = e => {
        e.preventDefault();
        const messageText = this.state.text.trim();
        if (messageText.length > 0) {
            const {params: {conversationId}} = this.props.match;
            this.props.onSend(messageText, conversationId);
            this.setState({text: ''});
            if (this.input) {
                this.input.focus();
            }
        }
    };

    handleToggleEmojiKeyboard = () => {
        this.setState(
            ({emojiSelectorOpen}) => ({
                emojiSelectorOpen: !emojiSelectorOpen,
            }),
            () => {
                if (!this.state.emojiSelectorOpen) {
                    if (this.input) {
                        this.input.focus();
                    }
                }
            }
        );
    };

    handleEmojiSelected = emoji => {
        const input = this.input;
        if (input) {
            let strPos = input.selectionStart;
            const front = input.value.substring(0, strPos);
            const back = input.value.substring(strPos, input.value.length);
            this.setState({text: front + emoji + back});
            strPos += emoji.length;
            input.selectionStart = strPos;
            input.selectionEnd = strPos;
        }
    };

    handleDelete = () => {
        const input = this.input;
        if (input) {
            let strPos = input.selectionStart;
            const front = input.value.substring(0, strPos);
            const back = input.value.substring(strPos, input.value.length);
            this.setState({text: front.substring(0, strPos - 1) + back});
            strPos -= 1;
            input.selectionStart = strPos;
            input.selectionEnd = strPos;
        }
    };

    render() {
        const {text, emojiSelectorOpen} = this.state;
        return (
            <div>
                <div style={barStyle}>
                    <button style={buttonStyle} onClick={this.handleToggleEmojiKeyboard}>
                        {emojiSelectorOpen ? <KeyboardIcon /> : <EmojiIcon />}
                    </button>
                    <form onSubmit={this.handleSubmit} style={formStyle}>
                        <input
                            ref={node => (this.input = node)}
                            style={inputStyle}
                            type="text"
                            placeholder="type a message"
                            value={text}
                            onChange={evt => this.setState({text: evt.target.value})}
                        />
                        <button style={buttonStyle}>
                            <SendIcon color={text.trim().length > 0 ? '#2196F3' : '#CCC'} />
                        </button>
                    </form>
                </div>
                {emojiSelectorOpen &&
                    <EmojiSelector
                        style={{height: 250}}
                        onSelectEmoji={this.handleEmojiSelected}
                        onDelete={this.handleDelete}
                    />}
            </div>
        );
    }
}

export default withRouter(connect(null, {onSend: sendMessage})(ChatBar));
