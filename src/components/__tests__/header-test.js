import React from 'react';
import Header from '../header';
import IconButton from '../icon-button';
import {shallow, mount} from 'enzyme';
import test from 'ava';
import {spy} from 'sinon';
import {jsdom} from 'jsdom';

const setUpDocument = () => {
    const doc = jsdom();
    global.document = doc;
    global.window = doc.defaultView;
};
setUpDocument();

test('Header renders a title', t => {
    const wrapper = shallow(<Header title="section title" />);

    t.is(wrapper.find('h2').text(), 'section title');
});

test('Header has an Icon', t => {
    const wrapper = shallow(<Header title="section title" icon="icon/url.jpg" />);

    t.true(wrapper.find(IconButton).length === 1);
});

test('handler is called when click on header icon', t => {
    const clickIconSpy = spy();
    const wrapper = mount(<Header title="section title" icon="icon/url.jpg" onClickIcon={clickIconSpy} />);

    wrapper.find(IconButton).simulate('click');

    t.true(clickIconSpy.called);
});
