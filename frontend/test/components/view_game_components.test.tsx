import * as React from 'react';
import {shallow, ShallowWrapper } from 'enzyme';
import {ViewGameComponents, IViewGameComponentsProps, IViewGameComponentsState} from '../../src/renderer/components/platform/pages/ViewGameComponents';
import { History } from 'history';

jest.mock('../../src/cookie');

describe('Test the View Game Components Page', () => {
	const viewGameComponentsInstance: ShallowWrapper<IViewGameComponentsProps, IViewGameComponentsState, ViewGameComponents> = shallow(
		<ViewGameComponents
			{...{
				location: {
					pathname: '/game_components/monsters'
				},
				match: {
					url: '/game_components'
				},
				history: {
					replace: jest.fn()
				} as unknown as History
			} as IViewGameComponentsProps
			} />
		);

	it('renders without crashing', () => {
		expect(viewGameComponentsInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(viewGameComponentsInstance).toMatchSnapshot();
	});

	it('changes tabs', () => {
		viewGameComponentsInstance.instance().changeTab({} as React.ChangeEvent<{}>, 'buildings');
		expect(viewGameComponentsInstance.state().value).toEqual('buildings');
	});

	describe('componentWillReceiveProps()', () => {
		let viewGameComponentsInstance: ShallowWrapper<IViewGameComponentsProps, IViewGameComponentsState, ViewGameComponents>;
		beforeEach(() => {
			viewGameComponentsInstance = shallow(
				<ViewGameComponents
					{...{
						location: {
							pathname: '/game_components/monsters'
						},
						match: {
							url: '/game_components'
						}} as IViewGameComponentsProps
					} />
				);
		})

		it('renders without crashing', () => {
			expect(viewGameComponentsInstance).toBeDefined();
		});

		it('renders new props', () => {
			viewGameComponentsInstance.setProps({
				location: {
					pathname: '/game_components/spells',
				}
			} as IViewGameComponentsProps);
			expect(viewGameComponentsInstance.state().value).toEqual('spells');
		});

		it('renders with bad props', () => {
			viewGameComponentsInstance.setProps({
				location: {
					pathname: '',
				}
			} as IViewGameComponentsProps);
			expect(viewGameComponentsInstance.state().value).toEqual('encounters');
		});
	});

	describe('each tab renders', () => {
		let viewGameComponentsInstance: ShallowWrapper<IViewGameComponentsProps, IViewGameComponentsState, ViewGameComponents>;
		it('renders without crashing even with bad props', () => {
			viewGameComponentsInstance = shallow(
				<ViewGameComponents
					{...{
						location: {
							pathname: ''
						},
						match: {
							url: '/game_components'
						}} as IViewGameComponentsProps
					} />
				);
			expect(viewGameComponentsInstance).toBeDefined();
		});

		it('renders equipment without crashing', () => {
			viewGameComponentsInstance = shallow(
				<ViewGameComponents
					{...{
						location: {
							pathname: '/game_components/equipment'
						},
						match: {
							url: '/game_components'
						}} as IViewGameComponentsProps
					} />
				);
			expect(viewGameComponentsInstance).toBeDefined();
		});

		it('renders locations without crashing', () => {
			viewGameComponentsInstance = shallow(
				<ViewGameComponents
					{...{
						location: {
							pathname: '/game_components/locations'
						},
						match: {
							url: '/game_components'
						}} as IViewGameComponentsProps
					} />
				);
			expect(viewGameComponentsInstance).toBeDefined();
		});

		it('renders buildings without crashing', () => {
			viewGameComponentsInstance = shallow(
				<ViewGameComponents
					{...{
						location: {
							pathname: '/game_components/buildings'
						},
						match: {
							url: '/game_components'
						}} as IViewGameComponentsProps
					} />
				);
			expect(viewGameComponentsInstance).toBeDefined();
		});

		it('renders spells without crashing', () => {
			viewGameComponentsInstance = shallow(
				<ViewGameComponents
					{...{
						location: {
							pathname: '/game_components/spells'
						},
						match: {
							url: '/game_components'
						}} as IViewGameComponentsProps
					} />
				);
			expect(viewGameComponentsInstance).toBeDefined();
		});
	});
});
