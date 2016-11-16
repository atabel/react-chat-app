import React from 'react'

const iconStyle = {width: 24, height: 24};

const IconButton = ({icon, label, onPress, style}) => (
    typeof icon === 'string' ? (
        <img
            src={icon}
            onClick={onPress}
            alt={label}
            style={{iconStyle, ...style}}
        />
    ) : (
        <div onClick={onPress} style={{iconStyle, ...style}}>
            {icon}
        </div>
    )
);

export default IconButton;