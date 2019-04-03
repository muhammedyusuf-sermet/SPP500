import * as React from "react"
import { shallow, ShallowWrapper } from 'enzyme';
import {Pagination, IPaginationState} from '../../src/renderer/components/helpers/Pagination';

describe('Test the Pagination Component', () => {
	let paginationInstance: ShallowWrapper<any, IPaginationState, Pagination>;

	beforeEach(() => {
		paginationInstance = shallow(<Pagination/>);
		paginationInstance.setProps({ getTotalPages: () => {return 5;}, onPageChange: () => {return null;} })
	})

	it('renders without crashing', () => {
		expect(paginationInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(paginationInstance).toMatchSnapshot();
	});

	it('should update the state variables when Next button is clicked', () => {
		paginationInstance.instance().setState({ page: 2});
		paginationInstance.find('a#nextPageButton').simulate('click', {preventDefault: () => {}});

		expect(paginationInstance.state('page')).toEqual(3);
	});

	it('should update the state variables when Previous button is clicked', () => {
		paginationInstance.instance().setState({ page: 2 });
		paginationInstance.find('a#previousPageButton').simulate('click', {preventDefault: () => {}});

		expect(paginationInstance.state('page')).toEqual(1);
	});
});
