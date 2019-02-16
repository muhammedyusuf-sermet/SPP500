import * as React from 'react';
import {shallow} from 'enzyme';
import {App} from '../src/renderer/app';


describe('Test the Landing/Registration/Login Page', () => {
	const appInstance = shallow(<App/>);

	it('renders without crashing', () => {
		expect(appInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(appInstance).toMatchSnapshot();
	});
});
