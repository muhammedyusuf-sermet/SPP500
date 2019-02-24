import * as React from "react"
import {shallow} from 'enzyme';
import { LandingPage } from "../src/renderer/components/LandingPage";

it('renders a landing-container classed component', () => {
	const wrapper = shallow(<LandingPage/>);
	expect(wrapper.find('.landing-container')).toExist();
});