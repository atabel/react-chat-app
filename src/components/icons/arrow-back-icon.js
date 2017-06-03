// @flow
import React from 'react';

const style = {transition: 'fill 0.3s ease'};

type Props = {
    color?: string,
    size?: number,
};

const ArrowBackIcon = ({color = 'currentColor', size = 24}: Props) =>
    <svg
        style={style}
        fill={color}
        height={size}
        width={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>;

export default ArrowBackIcon;
