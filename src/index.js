// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import configureStore from './store';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import PrivateRoute from './components/private-route';
import registerServiceWorker from './register-service-worker';

const initApp = () => {
    const store = configureStore();
    const el = document.getElementById('root');

    if (!el) {
        console.error('Dom element with id #root not found!');
        return;
    }

    ReactDOM.render(
        <Provider store={store}>
            <Router>
                <Route render={({location}) => <PrivateRoute location={location} path="/" component={App} />} />
            </Router>
        </Provider>,
        el
    );
};

initApp();
registerServiceWorker();
