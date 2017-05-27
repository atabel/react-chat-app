// @flow
import React from 'react';

type Props = {
    icon: string | React$Element<*>,
    label?: string,
    onPress: () => void,
    style?: Object,
};

const IconButton = ({icon, label, onPress, style}: Props) =>
    typeof icon === 'string'
        ? <img src={icon} onClick={onPress} alt={label} style={style} />
        : <div onClick={onPress} style={style}>
              {icon}
          </div>;

export default IconButton;
