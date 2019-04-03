import * as React from 'react';
import {shallow} from 'enzyme';
import {ViewGameComponents} from '../../src/renderer/components/platform/pages/ViewGameComponents';

jest.mock('../../src/cookie');

describe('Test the View Game Components Page', () => {
	const ViewGameComponentsInstance = shallow(<ViewGameComponents/>);

	it('renders without crashing', () => {
		expect(ViewGameComponentsInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(ViewGameComponentsInstance).toMatchSnapshot();
	});

	it('renders a login-header-container classed component', () => {
		expect(ViewGameComponentsInstance.find('.view-game-components-container')).toExist();
	});

});
