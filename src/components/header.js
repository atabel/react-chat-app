import React from 'react';

const headerStyle = {
    height: 56,
    display: 'flex',
    background: '#2196F3',
    color: 'white',
    alignItems: 'center',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
};

const iconStyle = {padding: 16};
const titleStyle = {flex: 1};

const Header = ({title, icon, onClickIcon}) => (
    <header style={headerStyle}>
        {icon && (
            <img src={icon} onClick={onClickIcon} alt="header button" style={iconStyle} />
        )}
        <h2 style={{...titleStyle, paddingLeft: icon ? 0 : 16}}>{title}</h2>
    </header>
);

export default Header;