import * as React from "react"
import {shallow} from 'enzyme';
import { Footer } from "../src/renderer/components/Footer";

it('renders a footer-container classed component', () => {
	const wrapper = shallow(<Footer/>);
	expect(wrapper.find('.footer-container')).toExist();
});