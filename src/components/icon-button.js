// @flow
import React from 'react';

const iconStyle = {width: 24, height: 24};

type Props = {
    icon: string,
    label?: string,
    onPress: () => void,
    style?: Object,
};

const IconButton = ({icon, label, onPress, style}: Props) =>
    (typeof icon === 'string'
        ? <img src={icon} onClick={onPress} alt={label} style={{iconStyle, ...style}} />
        : <div onClick={onPress} style={{iconStyle, ...style}}>
              {icon}
          </div>);

export default IconButton;
