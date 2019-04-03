import * as React from "react"
import * as nock from 'nock';
import { shallow, ShallowWrapper } from 'enzyme';
import {Monster, IMonsterState} from '../../src/renderer/components/platform/pages/view_catalog/Monster';
import * as MonsterInterface from '../../src/monster';
import {API_URL} from '../../src/config'

jest.mock('../../src/cookie');

describe('Test the Monster View Details', () => {
	let monsterInstance: ShallowWrapper<any, IMonsterState, Monster>;

	beforeEach(() => {
		monsterInstance = shallow(<Monster/>);
	})

	it('renders without crashing', () => {
		expect(monsterInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(monsterInstance).toMatchSnapshot();
	});

	it('should update the state variables when View button is clicked for a monster', () => {
		let selectedMonster: MonsterInterface.IMonsterState;
		selectedMonster = {} as MonsterInterface.IMonsterState;
		monsterInstance.instance().view(selectedMonster);

		expect(monsterInstance.state('viewMonster')).toEqual(true);
		expect(monsterInstance.state('selectedMonster')).toEqual(selectedMonster);
	});

	it('should update the state variables when Edit button is clicked for a monster', () => {
		let selectedMonster: MonsterInterface.IMonsterState;
		selectedMonster = {} as MonsterInterface.IMonsterState;
		monsterInstance.instance().edit(selectedMonster);

		expect(monsterInstance.state('editMonster')).toEqual(true);
		expect(monsterInstance.state('selectedMonster')).toEqual(selectedMonster);
	});

	it('should update the state variables when resetState function is called', () => {
		monsterInstance.instance().resetState();

		expect(monsterInstance.state('viewMonster')).toEqual(false);
		expect(monsterInstance.state('editMonster')).toEqual(false);
		expect(monsterInstance.state('selectedMonster')).toEqual({} as MonsterInterface.IMonsterState);
	});

	it('should make an GET request to retrieve Monsters when getPaginatedMonsters function is called', () => {
		monsterInstance.instance().getPaginatedMonsters(0);

		nock(API_URL)
		.get('/monster/get/0/12')
		.reply(201, { status: 201, message: 'success', total: 1, content: [] as MonsterInterface.IMonsterState[] });
	});

	it('should return the total number of pages when getTotalPages function is called', () => {
		monsterInstance.instance().setState({ totalMonsters: 24});
		let totalPages = monsterInstance.instance().getTotalPages();

		// Starts from 0
		expect(totalPages).toEqual(1);
	});
});
