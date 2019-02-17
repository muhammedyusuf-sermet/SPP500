import * as React from 'react';
import {shallow} from 'enzyme';
import {ViewCatalog} from '../../src/renderer/components/platform/pages/ViewCatalog';


describe('Test the View Catalog Page', () => {
	const viewCatalogInstance = shallow(<ViewCatalog/>);

	it('renders without crashing', () => {
		expect(viewCatalogInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(viewCatalogInstance).toMatchSnapshot();
	});
});
