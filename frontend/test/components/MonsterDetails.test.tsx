import * as React from "react"
import { shallow, ShallowWrapper } from 'enzyme';
import {MonsterDetails, IMonsterDetailsState} from '../../src/renderer/components/platform/pages/view_catalog/MonsterDetails';
import * as Monster from '../../src/monster';

describe('Test the Monster View Details Per Monster', () => {
	let monsterDetailsInstance: ShallowWrapper<any, IMonsterDetailsState, MonsterDetails>;

	beforeEach(() => {
		// This mock object is in the same format with the backend would return
		// Backend currently doesn't return skills, senses, etc.
		let monsterExample = {
			Id: "",
			Name: "Hello",
			Type: Monster.MonsterType.Celestial,
			Alignment: Monster.Alignment.AnyGoodAlignment,
			Size: Monster.Size.Gargantuan,
			Race: Monster.MonsterRace.Devil,
			Environment: Monster.Environment.Underdark,
			DamageVulnerabilities: "Everything",
			DamageResistances: "None at all",
			DamageImmunities: "Nada",
			ConditionImmunities: "Nothing",
			ArmorClass: 15,
			HitPoints: 40,
			HitPointDistribution: "9d5 - 5",
			AbilityScores: null,
			SavingThrows: null,
			Skills: null,
			Senses: null,
			Languages: "Common and Draconic",
			ChallengeRating: 2.5,
		};
		monsterDetailsInstance = shallow(<MonsterDetails monster={monsterExample}/>);
	})

	it('renders without crashing', () => {
		expect(monsterDetailsInstance).toBeDefined();
	});

	it('renders correctly when the page is loaded', () => {
		expect(monsterDetailsInstance).toMatchSnapshot();
	});

	it('should return true if the IMonsterState object is empty', () => {
		let selectedMonster: Monster.IMonsterData;
		selectedMonster = {} as Monster.IMonsterData;
		let isEmpty = monsterDetailsInstance.instance().isEmptyObject(selectedMonster);

		expect(isEmpty).toEqual(true);
	});

});
