// @flow
import * as React from 'react';
import {Route} from 'react-router-dom';
import AppScreen from './app-screen';
import ChatsList from './chats-list';
import ArrowBackIcon from './icons/arrow-back-icon';
import SearchIcon from './icons/search-icon';
import debounce from 'lodash/debounce';

const inputStyle = {
    border: 'none',
    outline: 'none',
    fontSize: 16,
    background: 'transparent',
};

type State = {isSearching: boolean, searchText: string};

class ChatsListScreen extends React.Component<{}, State> {
    state = {
        isSearching: false,
        searchText: '',
    };

    handleFilterChange = debounce(text => {
        this.setState({searchText: text});
    }, 160);

    renderSearchInput() {
        const {searchText} = this.state;
        return (
            <input
                autoFocus
                style={inputStyle}
                type="text"
                placeholder="search..."
                defaultValue={searchText}
                onChange={evt => this.handleFilterChange(evt.target.value)}
            />
        );
    }

    render() {
        const {searchText} = this.state;
        return (
            <Route path="/conversations/search">
                {({match: isSearching, history}) => (
                    <AppScreen
                        style={isSearching && {background: 'white', color: '#191919'}}
                        icon={isSearching && <ArrowBackIcon />}
                        onClickIcon={history.goBack}
                        title={isSearching ? this.renderSearchInput() : 'Chats'}
                        actions={
                            isSearching
                                ? []
                                : [
                                      {
                                          icon: <SearchIcon />,
                                          title: 'Search',
                                          callback: () => history.push('/conversations/search'),
                                      },
                                  ]
                        }
                    >
                        <ChatsList searchFilter={isSearching ? searchText : ''} />
                    </AppScreen>
                )}
            </Route>
        );
    }
}

export default ChatsListScreen;
