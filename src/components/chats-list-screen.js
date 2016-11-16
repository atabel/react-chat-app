import React from 'react';
import AppScreen from './app-screen';
import ChatsList from './chats-list';
import ArrowBackIcon from './arrow-back-icon';

const inputStyle = {
    border: 'none',
    outline: 'none',
    fontSize: 16,
    background: 'transparent',
};

const ChatsListScreen = React.createClass({

    getInitialState() {
        return {
            isSearching: false,
            searchText: ''
        };
    },

    handleSearchPress() {
        this.setState({isSearching: true, searchText: ''});
    },

    handleBackPress() {
        this.setState({isSearching: false});
    },

    renderSearchInput() {
        const {searchText} = this.state;
        return (
            <input
                autoFocus
                style={inputStyle}
                type="text"
                placeholder="search..."
                value={searchText}
                onChange={(evt) => this.setState({searchText: evt.target.value})}
            />
        );
    },

    render() {
        const {isSearching, searchText} = this.state;
        return (
            <AppScreen
                style={isSearching && {background: 'white', color: '#191919'}}
                icon={isSearching && <ArrowBackIcon style={{fill: 'currentColor'}} />}
                onClickIcon={this.handleBackPress}
                title={isSearching ? this.renderSearchInput() : 'Chats'}
                actions={isSearching ? [] : [{
                    icon: require('../assets/ic_search.svg'),
                    title: 'Search',
                    callback: this.handleSearchPress
                }]}
            >
                <ChatsList searchFilter={searchText} />
            </AppScreen>
        );
    },
});

export default ChatsListScreen;