//@flow
import React from 'react';
import {connect} from 'react-redux';
import type {MapStateToProps} from 'react-redux';
import {getCurrentUser} from '../reducer';
import {Route} from 'react-router-dom';
import Login from './login';

type Props = {
    isLoggedIn: boolean,
    component: any, //React.ElementType,
};

const PrivateRoute = ({isLoggedIn, component, ...rest}: Props) => (
    <Route {...rest} render={props => (isLoggedIn ? React.createElement(component, props) : <Login />)} />
);

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
    isLoggedIn: !!getCurrentUser(state),
});

export default connect(mapStateToProps)(PrivateRoute);
