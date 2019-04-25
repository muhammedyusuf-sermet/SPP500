import * as React from 'react';
import {shallow} from 'enzyme';
import {ViewGameComponents} from '../../src/renderer/components/platform/pages/ViewGameComponents';
import { Route } from 'react-router';

jest.mock('../../src/cookie');

describe('Test the View Game Components Page', () => {
	const viewGameComponentsInstance = shallow(<Route path="/game_components" component={ViewGameComponents} />);

	it('renders without crashing', () => {
		expect(viewGameComponentsInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(viewGameComponentsInstance).toMatchSnapshot();
	});

	it('renders a login-header-container classed component', () => {
		expect(viewGameComponentsInstance.find('.view-game-components-container')).toExist();
	});

});
