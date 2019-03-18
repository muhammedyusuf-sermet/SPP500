import * as React from "react"
import { shallow, ShallowWrapper } from 'enzyme';
import {MonsterDetails, IMonsterDetailsState} from '../../src/renderer/components/platform/pages/view_catalog/MonsterDetails';
import * as Monster from '../../src/monster';

describe('Test the Monster View Details Per Monster', () => {
	let monsterDetailsInstance: ShallowWrapper<any, IMonsterDetailsState, MonsterDetails>;

	beforeEach(() => {
		let monsterExample: Monster.IMonsterState;
		monsterExample = {
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
			AbilityScores: {
				Strength: 17,
				Dexterity: 15,
				Constitution: 13,
				Intelligence: 12,
				Wisdom: 16,
				Charisma: 15
			},
			SavingThrows: {
				Strength: -3,
				Dexterity: 0,
				Constitution: -1,
				Intelligence: -2,
				Wisdom: 8,
				Charisma: 9
			},
			Skills: {
				Athletics: 9,
				Acrobatics: 10,
				SleightOfHand: 9,
				Stealth: 8,
				Arcana: 7,
				History: 7,
				Investigation: 6,
				Nature: 7,
				Religion: 8,
				AnimalHandling: 9,
				Insight: 10,
				Medicine: 12,
				Perception: 15,
				Survival: 11,
				Deception: 10,
				Intimidation: 9,
				Performance: 7,
				Persuasion: 4,
			},
			Senses: {
				Blindsight: 30,
				Darkvision: 10,
				Tremorsense: 15,
				Truesight: 60,
				PassivePerception: 13,
				PassiveInvestigation: 14,
				PassiveInsight: 16,
			},
			Languages: "Common and Draconic",
			ChallengeRating: 2.5,
			//abilities: [],
			//actions: [],
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
		let selectedMonster: Monster.IMonsterState;
		selectedMonster = {} as Monster.IMonsterState;
		let isEmpty = monsterDetailsInstance.instance().isEmptyObject(selectedMonster);

		expect(isEmpty).toEqual(true);
	});

});
