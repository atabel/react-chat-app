// @flow
import React from 'react';
import {connect} from 'react-redux';
import {initSession} from '../actions';
import {getCurrentUser} from '../reducer';

const loadGapi = new Promise((resolve, reject) => {
    const check = () => {
        if (window.gapi) {
            resolve(window.gapi);
        } else {
            setTimeout(check, 50);
        }
    };
    check();
});

class Login extends React.Component {
    componentDidMount() {
        loadGapi.then(gapi => {
            gapi.signin2.render('login-button', {
                scope: 'https://www.googleapis.com/auth/plus.login',
                width: 200,
                height: 50,
                longtitle: true,
                theme: 'dark',
                onsuccess: this.onSignIn,
            });
        });
    }

    onSignIn = googleUser => {
        const profile = googleUser.getBasicProfile();
        const token = googleUser.getAuthResponse().id_token;

        const userInfo = {
            id: profile.getId(),
            fullName: profile.getName(),
            avatar: profile.getImageUrl(),
            name: profile.getGivenName(),
            familyName: profile.getFamilyName(),
            email: profile.getEmail(),
        };

        console.log({userInfo, token});

        setTimeout(() => this.props.onSignIn(userInfo, token), 1000);
    };

    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div id="login-button" />
            </div>
        );
    }
}

export default connect(
    state => ({
        isLoggedIn: !!getCurrentUser(state),
    }),
    {onSignIn: initSession}
)(Login);
