import * as React from "react"
import {shallow} from 'enzyme';
import { LoginHeader } from "../src/renderer/components/LoginHeader";

it('renders a login-header-container classed component', () => {
	const wrapper = shallow(<LoginHeader/>);
	expect(wrapper.find('.login-header-container')).toExist();
});