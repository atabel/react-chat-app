// @flow
import * as React from 'react';
import IconButton from '../icon-button';
import renderer from 'react-test-renderer';

test('Renders an img when a url is passed', () => {
    const tree = renderer.create(<IconButton icon="some/url" label="some title" onPress={() => {}} />);

    expect(tree).toMatchSnapshot();
});

test('Renders an icon as child when a react element is passed', () => {
    const tree = renderer.create(<IconButton icon={<svg>whatever</svg>} onPress={() => {}} />);

    expect(tree).toMatchSnapshot();
});
