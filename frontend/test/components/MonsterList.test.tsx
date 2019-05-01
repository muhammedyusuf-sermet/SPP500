import * as React from "react"
import * as nock from 'nock';
import { shallow, ShallowWrapper } from 'enzyme';
import {MonsterList, IMonsterListState} from '../../src/renderer/components/platform/pages/view_catalog/MonsterList';

import {API_URL} from '../../src/config'
import { MonsterInstances } from "../../src/monster_instances";

jest.mock('../../src/cookie');

describe('Test the Monster View Details', () => {
	let monsterListInstance: ShallowWrapper<any, IMonsterListState, MonsterList>;

	beforeEach( async (done) => {
		nock.disableNetConnect();
		nock(API_URL)
		.get('/monster/get/0/12')
		.reply(200, {
			status: 201,
			messages: ['success'],
			total: 0,
			content: []
		});
		monsterListInstance = shallow(<MonsterList/>);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		expect(nock.isDone()).toEqual(true);
		done();
	})

	it('renders without crashing', () => {
		expect(monsterListInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(monsterListInstance).toMatchSnapshot();
	});

	it('should make an GET request to retrieve encounters when getPaginatedMonsters function is called', async (done) => {
		nock(API_URL)
		.get('/monster/get/0/12')
		.reply(200, {
			status: 201,
			messages: ['success'],
			total: 12,
			content: MonsterInstances
		});

		monsterListInstance.instance().getPaginatedMonsters(0);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));

		expect(monsterListInstance.state().monstersInCurrentPage).toEqual(MonsterInstances)
		expect(monsterListInstance.state().totalMonsters).toEqual(12);
		expect(nock.isDone()).toEqual(true);
		done();
	});

	it('should make an GET request to retrieve encounters when updatePage function is called', async (done) => {
		nock(API_URL)
		.get('/monster/get/0/12')
		.reply(200, {
			status: 201,
			messages: ['success'],
			total: 12,
			content: MonsterInstances
		});

		monsterListInstance.instance().updatePage(0);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));

		expect(monsterListInstance.state().monstersInCurrentPage).toEqual(MonsterInstances)
		expect(monsterListInstance.state().totalMonsters).toEqual(12);
		expect(nock.isDone()).toEqual(true);
		done();
	});

	it('should fail gracefully when getPaginatedMonsters function is called', async (done) => {
		nock(API_URL)
		.get('/monster/get/0/12')
		.replyWithError('access denied');

		monsterListInstance.instance().getPaginatedMonsters(0);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));

		expect(monsterListInstance.state().monstersInCurrentPage).toEqual([])
		expect(monsterListInstance.state().totalMonsters).toEqual(0);
		expect(nock.isDone()).toEqual(true);
		done();
	});

	it('should make an DELETE request to delete monster when deleteMonster function is called', async (done) => {
		nock(API_URL)
		.delete('/monster/1')
		.reply(200, {
			status: 201,
			messages: ['success']
		});
		nock(API_URL)
		.get('/monster/get/0/12')
		.reply(200, {
			status: 201,
			messages: ['success'],
			total: 11,
			content: MonsterInstances.slice(1)
		});

		monsterListInstance.instance().deleteMonster({ currentTarget: { value: '1'}} as React.MouseEvent<HTMLButtonElement>);
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));
		await new Promise(resolve => setImmediate(resolve));

		expect(monsterListInstance.state().monstersInCurrentPage).toEqual(MonsterInstances.slice(1))
		expect(monsterListInstance.state().totalMonsters).toEqual(11);
		expect(nock.isDone()).toEqual(true);
		done();
	});

	it('should return the total number of pages when getTotalPages function is called', () => {
		monsterListInstance.instance().setState({ totalMonsters: 24});
		let totalPages = monsterListInstance.instance().getTotalPages();

		// Starts from 0
		expect(totalPages).toEqual(1);
	});
});
