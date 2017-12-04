//@flow
import React from 'react';
import Header from '../header';
import IconButton from '../icon-button';
import {shallow, mount} from 'enzyme';
import {JSDOM} from 'jsdom';

const setUpDocument = () => {
    const dom = new JSDOM();
    global.window = dom.window;
    global.document = dom.window.document;
};
setUpDocument();

test('Header renders a title', () => {
    const wrapper = shallow(<Header title="section title" />);

    expect(wrapper.find('h2').text()).toBe('section title');
});

test('Header has an Icon', () => {
    const wrapper = shallow(<Header title="section title" icon="icon/url.jpg" onClickIcon={() => {}} />);

    expect(wrapper.find(IconButton).length === 1).toBe(true);
});

test('handler is called when click on header icon', () => {
    const clickIconSpy = jest.fn();
    const wrapper = mount(<Header title="section title" icon="icon/url.jpg" onClickIcon={clickIconSpy} />);

    wrapper.find(IconButton).simulate('click');

    expect(clickIconSpy).toBeCalled();
});
