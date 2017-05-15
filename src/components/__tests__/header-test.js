import React from 'react';
import Header from '../header';
import IconButton from '../icon-button';
import {shallow, mount} from 'enzyme';
import test from 'ava';
import {spy} from 'sinon';
import {JSDOM} from 'jsdom';

const setUpDocument = () => {
    const dom = new JSDOM();
    global.window = dom.window;
    global.document = dom.window.document;
};
setUpDocument();

test('Header renders a title', t => {
    const wrapper = shallow(<Header title="section title" />);

    t.is(wrapper.find('h2').text(), 'section title');
});

test('Header has an Icon', t => {
    const wrapper = shallow(<Header title="section title" icon="icon/url.jpg" onClickIcon={() => {}} />);

    t.true(wrapper.find(IconButton).length === 1);
});

test('handler is called when click on header icon', t => {
    const clickIconSpy = spy();
    const wrapper = mount(<Header title="section title" icon="icon/url.jpg" onClickIcon={clickIconSpy} />);

    wrapper.find(IconButton).simulate('click');

    t.true(clickIconSpy.called);
});
