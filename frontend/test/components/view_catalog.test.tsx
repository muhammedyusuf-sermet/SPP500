import * as React from 'react';
import {shallow, ShallowWrapper } from 'enzyme';
import {ViewCatalog, IViewCatalogProps, IViewCatalogState} from '../../src/renderer/components/platform/pages/ViewCatalog';
import { History } from 'history';

jest.mock('../../src/cookie');

describe('Test the View Catalog Page', () => {
	const viewCatalogInstance: ShallowWrapper<IViewCatalogProps, IViewCatalogState, ViewCatalog> = shallow(
		<ViewCatalog
			{...{
				location: {
					pathname: '/catalog/monsters'
				},
				match: {
					url: '/catalog'
				},
				history: {
					replace: jest.fn()
				} as unknown as History
			} as IViewCatalogProps
			} />
		);

	it('renders without crashing', () => {
		expect(viewCatalogInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(viewCatalogInstance).toMatchSnapshot();
	});

	it('changes tabs', () => {
		viewCatalogInstance.instance().changeTab({} as React.ChangeEvent<{}>, 'buildings');
		expect(viewCatalogInstance.state().value).toEqual('buildings');
	});

	describe('componentWillReceiveProps()', () => {
		let viewCatalogInstance: ShallowWrapper<IViewCatalogProps, IViewCatalogState, ViewCatalog>;
		beforeEach(() => {
			viewCatalogInstance = shallow(
				<ViewCatalog
					{...{
						location: {
							pathname: '/catalog/monsters'
						},
						match: {
							url: '/catalog'
						}} as IViewCatalogProps
					} />
				);
		})

		it('renders without crashing', () => {
			expect(viewCatalogInstance).toBeDefined();
		});

		it('renders new props', () => {
			viewCatalogInstance.setProps({
				location: {
					pathname: '/catalog/spells',
				}
			} as IViewCatalogProps);
			expect(viewCatalogInstance.state().value).toEqual('spells');
		});
	});

	describe('each tab renders', () => {
		let viewCatalogInstance: ShallowWrapper<IViewCatalogProps, IViewCatalogState, ViewCatalog>;
		it('renders equipment without crashing', () => {
			viewCatalogInstance = shallow(
				<ViewCatalog
					{...{
						location: {
							pathname: '/catalog/equipment'
						},
						match: {
							url: '/catalog'
						}} as IViewCatalogProps
					} />
				);
			expect(viewCatalogInstance).toBeDefined();
		});

		it('renders locations without crashing', () => {
			viewCatalogInstance = shallow(
				<ViewCatalog
					{...{
						location: {
							pathname: '/catalog/locations'
						},
						match: {
							url: '/catalog'
						}} as IViewCatalogProps
					} />
				);
			expect(viewCatalogInstance).toBeDefined();
		});

		it('renders buildings without crashing', () => {
			viewCatalogInstance = shallow(
				<ViewCatalog
					{...{
						location: {
							pathname: '/catalog/buildings'
						},
						match: {
							url: '/catalog'
						}} as IViewCatalogProps
					} />
				);
			expect(viewCatalogInstance).toBeDefined();
		});

		it('renders spells without crashing', () => {
			viewCatalogInstance = shallow(
				<ViewCatalog
					{...{
						location: {
							pathname: '/catalog/spells'
						},
						match: {
							url: '/catalog'
						}} as IViewCatalogProps
					} />
				);
			expect(viewCatalogInstance).toBeDefined();
		});
	});
});
