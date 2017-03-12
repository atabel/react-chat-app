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

// window.onSignIn = googleUser => {
//     const profile = googleUser.getBasicProfile();
//     const token = googleUser.getAuthResponse().id_token;
//
//     const userInfo = {
//         id: profile.getId(),
//         fullName: profile.getName(),
//         avatar: profile.getImageUrl(),
//         name: profile.getGivenName(),
//         familyName: profile.getFamilyName(),
//         email: profile.getEmail(),
//     };
//
//     console.log({userInfo, token});
//
//     chatClient.init(token);
//
//     setTimeout(
//         () => {
//             const signInButton = document.getElementById('signInButton');
//             if (signInButton) {
//                 signInButton.remove();
//             }
//             initApp(userInfo);
//         },
//         500
//     );
// };
