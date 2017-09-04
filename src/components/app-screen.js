// @flow
import * as React from 'react';
import Header from './header';

type Props = {children?: React.Element<any>};

const AppScreen = ({children, ...props}: Props) =>
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
        <Header {...props} />
        <div style={{flex: 1, height: 'calc(100% - 56px)', overflow: 'auto', background: 'white'}}>
            {children}
        </div>
    </div>;

export default AppScreen;
