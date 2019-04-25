import * as React from "react"
import * as nock from 'nock';
import { shallow, ShallowWrapper } from 'enzyme';
import {EncounterList, IEncounterListState} from '../../src/renderer/components/platform/pages/view_game_components/EncounterList';
import * as EncounterInterface from '../../src/encounter';
import {API_URL} from '../../src/config'

jest.mock('../../src/cookie');

describe('Test the EncounterList View Details', () => {
	let encounterListInstance: ShallowWrapper<any, IEncounterListState, EncounterList>;

	beforeEach(() => {
		encounterListInstance = shallow(<EncounterList/>);
	})

	it('renders without crashing', () => {
		expect(encounterListInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(encounterListInstance).toMatchSnapshot();
	});

	it('should update the state variables when resetState function is called', () => {
		encounterListInstance.instance().resetState();

		expect(encounterListInstance.state().page).toEqual(0);
	});

	it('should make an GET request to retrieve encounters when getPaginatedEncounters function is called', () => {
		encounterListInstance.instance().getPaginatedEncounters(0);

		nock(API_URL)
		.get('/encounter/get/0/12')
		.reply(201, { status: 201, message: 'success', total: 1, content: [] as EncounterInterface.IEncounterState[] });
	});

	it('should return the total number of pages when getTotalPages function is called', () => {
		encounterListInstance.instance().setState({ totalEncounters: 24});
		let totalPages = encounterListInstance.instance().getTotalPages();

		// Starts from 0
		expect(totalPages).toEqual(1);
	});
});
