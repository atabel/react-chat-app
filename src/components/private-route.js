import React from 'react';
import {connect} from 'react-redux';
import {getCurrentUser} from '../reducer';
import {Route} from 'react-router-dom';
import Login from './login';

const PrivateRoute = ({isLoggedIn, component, ...rest}) => (
    <Route {...rest} render={props => isLoggedIn ? React.createElement(component, props) : <Login />} />
);

export default connect(state => ({
    isLoggedIn: !!getCurrentUser(state),
}))(PrivateRoute);
