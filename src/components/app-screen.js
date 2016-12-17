// @flow
import React from 'react';
import Header from './header';

type Props = {children?: React$Element<*>};

const AppScreen = ({children, ...props}: Props) => (
    <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
        <Header {...props} />
        <div style={{flex: 1, height: 'calc(100% - 56px)'}}>
            {children}
        </div>
    </div>
);

export default AppScreen;
