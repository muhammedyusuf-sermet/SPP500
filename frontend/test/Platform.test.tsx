import * as React from "react"
import {shallow, ShallowWrapper} from 'enzyme';
import { Platform } from "../src/renderer/components/Platform";

jest.mock('../src/cookie');

describe('Platform Component', () => {
	let platformInstance: ShallowWrapper<Platform>;

	beforeEach(() => {
		platformInstance = shallow(<Platform/>);
	});

	it('renders without crashing', () => {
		expect(platformInstance).toBeDefined();
	});

	/*it('renders a registration-container classed component', () => {
		expect(platformInstance.find('.platform-container')).toExist();
	});*/

	/*it('successfully logs out', () => {
		var logoutForm = platformInstance.find('form');
		logoutForm.simulate('submit', {preventDefault() {}});

		expect(platformInstance.state('redirectToHome')).toEqual(true);
		expect(platformInstance.find('Redirect')).toExist();
	});*/
});
