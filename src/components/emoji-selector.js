// @flow
import * as React from 'react';
import {emojify} from 'react-emojione';
import EmojiIcon from './icons/emoji-icon';
import BackSpaceIcon from './icons/back-space-icon';
import FlowerIcon from './icons/flower-icon';
import FoodIcon from './icons/food-icon';
import CarIcon from './icons/car-icon';
import emojis from 'react-emojione/lib/data/emoji-shortnames';
import deferRender from '../utils/defer-render';

const toneEmojiRegex = /_tone[0-9]:$/;
const isNotTone = (emojiShortName: string) => !toneEmojiRegex.test(emojiShortName);

const categories = {
    people: emojis.people.filter(isNotTone),
    nature: emojis.nature,
    food: [...emojis.food, ...emojis.activity],
    travel: [...emojis.travel, ...emojis.flags],
    objects: [...emojis.objects, ...emojis.symbols],
};

type CategoryName = $Keys<typeof categories>;

const getEmojisForCategory = (catName: CategoryName): string[] => categories[catName];

const categoryIcon = {
    people: EmojiIcon,
    nature: FlowerIcon,
    food: FoodIcon,
    travel: CarIcon,
    objects: EmojiIcon,
};

const getIconForCategory = (catName: CategoryName): React.ComponentType<any> => categoryIcon[catName];

const renderCategoryIcon = (categoryName, isSelected) => {
    const Component = getIconForCategory(categoryName);
    const props = isSelected ? {color: '#2196F3'} : {};
    return <Component {...props} />;
};

const selectorStyle = {display: 'flex', flexDirection: 'column', background: '#F8F8F8'};
const tabsGroupStyle = {height: 50, display: 'flex', borderBottom: '1px solid #ddd'};
const tabStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px 0',
};
const drawerStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    overflowY: 'auto',
};
const emojiStyle = {padding: '9px 7px'};

type DrawerProps = {
    emojis: string[],
    onSelectEmoji: string => mixed,
};

const Drawer = deferRender(({emojis, onSelectEmoji}: DrawerProps) => (
    <div style={drawerStyle}>
        {emojis.map(shortName => (
            <div key={shortName} style={emojiStyle} onClick={() => onSelectEmoji(shortName)}>
                {emojify(shortName)}
            </div>
        ))}
    </div>
));

type Props = {
    onSelectEmoji: (emojiShortName: string) => mixed,
    onDelete: () => mixed,
    style?: Object,
};

type State = {
    selectedCategory: CategoryName,
};

class EmojiSelector extends React.Component<Props, State> {
    state = {selectedCategory: 'people'};

    render() {
        const {selectedCategory} = this.state;
        const {onSelectEmoji, onDelete, style} = this.props;
        const categoryEmojis = getEmojisForCategory(selectedCategory);

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

const es = <EmojiSelector onDelete={() => {}} onSelectEmoji={() => {}} />;

export default EmojiSelector;
