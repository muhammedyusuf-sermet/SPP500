import * as React from 'react';
import {shallow} from 'enzyme';
import {HomePage} from '../src/renderer/components/Home';

jest.mock('../src/cookie');

describe('Test the Landing/Registration/Login Page', () => {
	const appInstance = shallow(<HomePage/>);

	it('renders without crashing', () => {
		expect(appInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(appInstance).toMatchSnapshot();
	});
});
