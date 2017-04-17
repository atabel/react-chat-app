// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import configureStore from './store';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import PrivateRoute from './components/private-route';

const initApp = () => {
    const store = configureStore();

    ReactDOM.render(
        <Provider store={store}>
            <Router>
                <Route render={({location}) => <PrivateRoute location={location} path="/" component={App} />} />
            </Router>
        </Provider>,
        document.getElementById('root')
    );
};

initApp();
