// @flow
import React from 'react';
import {Route} from 'react-router-dom';
import AppScreen from './app-screen';
import ChatsList from './chats-list';
import ArrowBackIcon from './arrow-back-icon';
import debounce from 'lodash/debounce'

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

    handleFilterChange: () => {},

    componentDidMount() {
        this.handleFilterChange = debounce((text) => {
            this.setState({searchText: text});
        }, 160);
    },

    renderSearchInput() {
        const {searchText} = this.state;
        return (
            <input
                autoFocus
                style={inputStyle}
                type="text"
                placeholder="search..."
                defaultValue={searchText}
                onChange={(evt) => this.handleFilterChange(evt.target.value)}
            />
        );
    },

    render() {
        const {searchText} = this.state;
        return (
            <Route path="/conversations/search">
                {({match: isSearching, history}) => (
                    <AppScreen
                        style={isSearching && {background: 'white', color: '#191919'}}
                        icon={isSearching && <ArrowBackIcon style={{fill: 'currentColor'}} />}
                        onClickIcon={history.goBack}
                        title={isSearching ? this.renderSearchInput() : 'Chats'}
                        actions={isSearching ? [] : [{
                            icon: require('../assets/ic_search.svg'),
                            title: 'Search',
                            callback: () => history.push('/conversations/search')
                        }]}
                    >
                        <ChatsList searchFilter={isSearching ? searchText : ''} />
                    </AppScreen>
                )}
            </Route>
        );
    },
});

export default ChatsListScreen;
