import React from 'react';

const style = {transition: 'fill 0.3s ease'};

const SendIcon = ({color, size = 24}) => (
    <svg
        style={style}
        fill={color}
        height={size}
        width={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
);

export default SendIcon;