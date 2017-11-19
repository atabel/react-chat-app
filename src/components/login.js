// @flow
import * as React from 'react';
import {connect} from 'react-redux';
import type {MapDispatchToProps} from 'react-redux';
import {initSession} from '../actions';
import type {Action} from '../actions';

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

type Props = {
    onSignIn: *,
};

class Login extends React.Component<Props, {}> {
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

const mapDispatchToProps: MapDispatchToProps<Action, {}, Props> = dispatch => ({
    onSignIn: (userInfo, token) => dispatch(initSession(userInfo, token)),
});

export default connect(null, mapDispatchToProps)(Login);
