// @flow
import * as React from 'react';

type Props = {
    icon: string | React.Element<any>,
    label?: string,
    onPress: () => mixed,
    style?: Object,
};

const IconButton = ({icon, label, onPress, style}: Props) =>
    typeof icon === 'string' ? (
        <img src={icon} onClick={onPress} alt={label} style={style} />
    ) : (
        <div onClick={onPress} style={style}>
            {icon}
        </div>
    );

export default IconButton;
