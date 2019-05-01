import * as React from "react"
import * as nock from 'nock';
import { shallow, ShallowWrapper } from 'enzyme';
import { EncounterList, IEncounterListState } from '../../src/renderer/components/platform/pages/view_game_components/EncounterList';

import {API_URL} from '../../src/config'
import { EncounterInstances } from "../../src/encounter_instances";

jest.mock('../../src/cookie');

describe('Test the EncounterList View Details', () => {
	let encounterListInstance: ShallowWrapper<any, IEncounterListState, EncounterList>;

	beforeEach( async (done) => {
		nock.disableNetConnect();
		nock(API_URL)
		.get('/encounter/get/0/12')
		.reply(200, {
			status: 201,
			messages: ['success'],
			total: 0,
			content: []
		});
		encounterListInstance = shallow(<EncounterList/>);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		expect(nock.isDone()).toEqual(true);
		done();
	})

	it('renders without crashing', () => {
		expect(encounterListInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(encounterListInstance).toMatchSnapshot();
	});

	it('should make an GET request to retrieve encounters when getPaginatedEncounters function is called', async (done) => {
		nock(API_URL)
		.get('/encounter/get/0/12')
		.reply(200, {
			status: 201,
			messages: ['success'],
			total: 12,
			content: EncounterInstances
		});

		encounterListInstance.instance().getPaginatedEncounters(0);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));

		expect(encounterListInstance.state().encountersInCurrentPage).toEqual(EncounterInstances)
		expect(encounterListInstance.state().totalEncounters).toEqual(12);
		expect(nock.isDone()).toEqual(true);
		done();
	});

	it('should make an GET request to retrieve encounters when updatePage function is called', async (done) => {
		nock(API_URL)
		.get('/encounter/get/0/12')
		.reply(200, {
			status: 201,
			messages: ['success'],
			total: 12,
			content: EncounterInstances
		});

		encounterListInstance.instance().updatePage(0);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));

		expect(encounterListInstance.state().encountersInCurrentPage).toEqual(EncounterInstances)
		expect(encounterListInstance.state().totalEncounters).toEqual(12);
		expect(nock.isDone()).toEqual(true);
		done();
	});

	it('should fail gracefully when getPaginatedEncounters function is called', async (done) => {
		nock(API_URL)
		.get('/encounter/get/0/12')
		.replyWithError('access denied');

		encounterListInstance.instance().getPaginatedEncounters(0);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));

		expect(encounterListInstance.state().encountersInCurrentPage).toEqual([])
		expect(encounterListInstance.state().totalEncounters).toEqual(0);
		expect(nock.isDone()).toEqual(true);
		done();
	});

	it('should make an DELETE request to delete encounter when deleteEncounter function is called', async (done) => {
		nock(API_URL)
		.delete('/encounter/1')
		.reply(200, {
			status: 201,
			messages: ['success']
		});
		nock(API_URL)
		.get('/encounter/get/0/12')
		.reply(200, {
			status: 201,
			messages: ['success'],
			total: 11,
			content: EncounterInstances.slice(1)
		});

		encounterListInstance.instance().deleteEncounter({ currentTarget: { value: '1'}} as React.MouseEvent<HTMLButtonElement>);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));

		expect(encounterListInstance.state().encountersInCurrentPage).toEqual(EncounterInstances.slice(1))
		expect(encounterListInstance.state().totalEncounters).toEqual(11);
		expect(nock.isDone()).toEqual(true);
		done();
	});

	it('should return the total number of pages when getTotalPages function is called', () => {
		encounterListInstance.instance().setState({ totalEncounters: 24});
		let totalPages = encounterListInstance.instance().getTotalPages();

		// Starts from 0
		expect(totalPages).toEqual(1);
	});
});
