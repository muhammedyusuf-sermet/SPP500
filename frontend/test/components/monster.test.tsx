import * as React from "react"
import { shallow, ShallowWrapper } from 'enzyme';
import {Monster, IMonsterState} from '../../src/renderer/components/platform/pages/view_catalog/Monster';
import * as MonsterInterface from '../../src/monster';

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
		let selectedMonster: MonsterInterface.IMonster;
		selectedMonster = {} as MonsterInterface.IMonster;
		monsterInstance.instance().view(selectedMonster);

		expect(monsterInstance.state('viewMonster')).toEqual(true);
		expect(monsterInstance.state('selectedMonster')).toEqual(selectedMonster);
	});

	it('should update the state variables when Edit button is clicked for a monster', () => {
		let selectedMonster: MonsterInterface.IMonster;
		selectedMonster = {} as MonsterInterface.IMonster;
		monsterInstance.instance().edit(selectedMonster);

		expect(monsterInstance.state('editMonster')).toEqual(true);
		expect(monsterInstance.state('selectedMonster')).toEqual(selectedMonster);
	});

	it('should update the state variables when resetState function is called', () => {
		monsterInstance.instance().resetState();

		expect(monsterInstance.state('viewMonster')).toEqual(false);
		expect(monsterInstance.state('editMonster')).toEqual(false);
		expect(monsterInstance.state('selectedMonster')).toEqual({} as MonsterInterface.IMonster);
	});
});
