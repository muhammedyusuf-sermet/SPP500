import * as React from "react"
import {shallow} from 'enzyme';
import {HomePage} from '../src/renderer/components/Home';
import {Footer} from "../src/renderer/components/Footer";

jest.mock('../src/cookie');

it('renders a footer component', () => {
	const wrapper = shallow(<HomePage/>);
	expect(wrapper.find(Footer)).toExist();
});