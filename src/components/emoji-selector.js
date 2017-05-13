// @flow
import React from 'react';
import emojis from 'emoji-shortnames';
import {emojify} from 'react-emojione';
import EmojiIcon from './emoji-icon';
import BackSpaceIcon from './back-space-icon';
import FlowerIcon from './flower-icon';
import FoodIcon from './food-icon';
import CarIcon from './car-icon';
import emojiData from 'react-emojione/lib/data/emoji-data';
import deferRender from '../utils/defer-render';

const supportedEmojis = new Set(emojiData.map(([, , shortName]) => shortName));

const toneEmojiRegex = /_tone[0-9]:$/;
const isNotTone = emojiShortName => !toneEmojiRegex.test(emojiShortName);
const isSupported = emojiShortName => supportedEmojis.has(emojiShortName);

const categories = {
    people: emojis.people.filter(isNotTone),
    nature: emojis.nature,
    food: [...emojis.food, ...emojis.activity],
    travel: [...emojis.travel, ...emojis.flags],
    objects: [...emojis.objects, ...emojis.symbols],
};

Object.keys(categories).forEach(category => {
    categories[category] = categories[category].filter(isSupported);
});

const categoryIcon = {
    people: EmojiIcon,
    nature: FlowerIcon,
    food: FoodIcon,
    travel: CarIcon,
    objects: EmojiIcon,
};

const renderCategoryIcon = (categoryName, isSelected) => {
    const Component = categoryIcon[categoryName] || EmojiIcon;
    const props = isSelected ? {color: '#2196F3'} : {};
    return <Component {...props} />;
};

const selectorStyle = {display: 'flex', flexDirection: 'column', background: '#F8F8F8'};
const tabsGroupStyle = {height: 50, display: 'flex', borderBottom: '1px solid #ddd'};
const tabStyle = {flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '8px 0'};
const drawerStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    overflowY: 'auto',
};
const emojiStyle = {padding: '9px 7px'};

const Drawer = deferRender(({emojis, onSelectEmoji}) => (
    <div style={drawerStyle}>
        {emojis.map(shortName => (
            <div key={shortName} style={emojiStyle} onClick={() => onSelectEmoji(shortName)}>
                {emojify(shortName)}
            </div>
        ))}
    </div>
));

class EmojiSelector extends React.Component {
    state = {selectedCategory: 'people'};

    render() {
        const {selectedCategory} = this.state;
        const {onSelectEmoji, onDelete, style} = this.props;
        const categoryEmojis = categories[selectedCategory];

        return (
            <div style={{...selectorStyle, ...style}}>
                <ul style={tabsGroupStyle}>
                    {Object.keys(categories).map(category => (
                        <li
                            key={category}
                            onClick={() => this.setState({selectedCategory: category})}
                            style={tabStyle}
                            title={category}
                        >
                            {renderCategoryIcon(category, category === selectedCategory)}
                        </li>
                    ))}
                    <li key="delete" onClick={onDelete} style={tabStyle} title="delete">
                        <BackSpaceIcon />
                    </li>
                </ul>
                <Drawer emojis={categoryEmojis} onSelectEmoji={onSelectEmoji} />
            </div>
        );
    }
}

export default EmojiSelector;
