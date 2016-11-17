import React from 'react';
import IconButton from './icon-button';

const headerStyle = {
    height: 56,
    display: 'flex',
    background: '#2196F3',
    color: 'white',
    alignItems: 'center',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
    zIndex: 1, // for the shadow to work
    transition: 'all ease 0.3s',
};

const iconStyle = {padding: 16};
const titleStyle = {flex: 1};

const Header = ({title, icon, onClickIcon, actions = [], style}) => (
    <header style={{...headerStyle, ...style}}>
        {icon && (
            <IconButton
                icon={icon}
                onPress={onClickIcon}
                style={iconStyle}
            />
        )}
        <h2
            style={{...titleStyle, paddingLeft: icon ? 0 : 16}}
        >
            {title}
        </h2>
        {actions.map(({title, icon, callback}) =>
            <IconButton
                key={title}
                icon={icon}
                onPress={callback}
                label={title}
                style={iconStyle}
            />
        )}
    </header>
);

export default Header;