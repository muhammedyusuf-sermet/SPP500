import * as React from 'react';
import { mount, ReactWrapper, shallow } from 'enzyme';

import { IMonsterSkillBonusesProps, IMonsterSkillBonusesState, MonsterSkillBonuses } from '../../src/renderer/components/platform/pages/view_catalog/monster/MonsterSkillBonuses';
const Joi = require('joi');
import { ValidationOptions } from 'joi';

const payloadSchema = Joi.object({
	Skills: Joi.object().pattern(
		Joi.symbol().valid([
			"Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight",
			"Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance",
			"Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival" ]),
		Joi.number().integer().greater(0).allow(0)
	).default({})
});
const validateOptions: ValidationOptions = {
	abortEarly: false,
	convert: true,
	allowUnknown: false,
	context: {

	}
};

////// Happy Path //////
describe('Monster SkillBonuses', () => {

	let monsterSkillBonusesInstance: ReactWrapper<IMonsterSkillBonusesProps, IMonsterSkillBonusesState, MonsterSkillBonuses>;

	describe('Provided Stat values', () => {

		beforeEach(() => {
			monsterSkillBonusesInstance =
				mount<MonsterSkillBonuses, IMonsterSkillBonusesProps, IMonsterSkillBonusesState>(
					<MonsterSkillBonuses
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{
							Athletics: 9,
							"Sleight of Hand": 2,
							"Animal Handling": 14,
							Acrobatics: 10,
							Stealth: 8,
							Arcana: 7,
							History: 7,
							Investigation: 6,
							Nature: 7,
							Religion: 8,
							Insight: 10,
							Medicine: 12,
							Perception: 15,
							Survival: 11,
							Deception: 10,
							Intimidation: 9,
							Performance: 7,
							Persuasion: 4,
						}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterSkillBonusesInstance).toBeDefined();
		});

		it('should have the correct number for Athletics', () => {
			expect(monsterSkillBonusesInstance.find('input#Athletics').props().value).toEqual(9);
		});

		it('should have the correct number for Sleight of Hand', () => {
			expect(monsterSkillBonusesInstance.find('input[id="Sleight of Hand"]').props().value).toEqual(2);
		});

		it('should have the correct number for Animal Handling', () => {
			expect(monsterSkillBonusesInstance.find('input[id="Animal Handling"]').props().value).toEqual(14);
		});

		it('should have the correct number for Acrobatics', () => {
			expect(monsterSkillBonusesInstance.find('input#Acrobatics').props().value).toEqual(10);
		});

		it('should have the correct number for Stealth', () => {
			expect(monsterSkillBonusesInstance.find('input#Stealth').props().value).toEqual(8);
		});

		it('should have the correct number for Arcana', () => {
			expect(monsterSkillBonusesInstance.find('input#Arcana').props().value).toEqual(7);
		});

		it('should have the correct number for History', () => {
			expect(monsterSkillBonusesInstance.find('input#History').props().value).toEqual(7);
		});

		it('should have the correct number for Investigation', () => {
			expect(monsterSkillBonusesInstance.find('input#Investigation').props().value).toEqual(6);
		});

		it('should have the correct number for Nature', () => {
			expect(monsterSkillBonusesInstance.find('input#Nature').props().value).toEqual(7);
		});

		it('should have the correct number for Religion', () => {
			expect(monsterSkillBonusesInstance.find('input#Religion').props().value).toEqual(8);
		});

		it('should have the correct number for Insight', () => {
			expect(monsterSkillBonusesInstance.find('input#Insight').props().value).toEqual(10);
		});

		it('should have the correct number for Medicine', () => {
			expect(monsterSkillBonusesInstance.find('input#Medicine').props().value).toEqual(12);
		});

		it('should have the correct number for Perception', () => {
			expect(monsterSkillBonusesInstance.find('input#Perception').props().value).toEqual(15);
		});

		it('should have the correct number for Survival', () => {
			expect(monsterSkillBonusesInstance.find('input#Survival').props().value).toEqual(11);
		});

		it('should have the correct number for Deception', () => {
			expect(monsterSkillBonusesInstance.find('input#Deception').props().value).toEqual(10);
		});

		it('should have the correct number for Intimidation', () => {
			expect(monsterSkillBonusesInstance.find('input#Intimidation').props().value).toEqual(9);
		});

		it('should have the correct number for Performance', () => {
			expect(monsterSkillBonusesInstance.find('input#Performance').props().value).toEqual(7);
		});

		it('should have the correct number for Persuasion', () => {
			expect(monsterSkillBonusesInstance.find('input#Persuasion').props().value).toEqual(4);
		});
	});

	describe('componentWillReceiveProps()', () => {
		beforeEach(() => {
			monsterSkillBonusesInstance =
				mount<MonsterSkillBonuses, IMonsterSkillBonusesProps, IMonsterSkillBonusesState>(
					<MonsterSkillBonuses
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{
							Athletics: 9,
							"Sleight of Hand": 2,
							"Animal Handling": 14,
							Acrobatics: 10,
							Stealth: 8,
							Arcana: 7,
							History: 7,
							Investigation: 6,
							Nature: 7,
							Religion: 8,
							Insight: 10,
							Medicine: 12,
							Perception: 15,
							Survival: 11,
							Deception: 10,
							Intimidation: 9,
							Performance: 7,
							Persuasion: 4,
						}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterSkillBonusesInstance).toBeDefined();
		});

		it('renders new props', () => {
			monsterSkillBonusesInstance.setProps({
				initial: {
					Athletics: 5,
					"Sleight of Hand": 12,
					"Animal Handling": 4,
					Acrobatics: 1,
					Stealth: 18,
					Arcana: 17,
					History: 17,
					Investigation: 36,
					Nature: 47,
					Religion: 82,
					Insight: 12,
					Medicine: 11,
					Perception: 18,
					Survival: 20,
					Deception: 30,
					Intimidation: 19,
					Performance: 37,
					Persuasion: 7,
				}
			})
			expect(monsterSkillBonusesInstance.find('input#Athletics').props().value).toEqual(5);
			expect(monsterSkillBonusesInstance.find('input[id="Sleight of Hand"]').props().value).toEqual(12);
			expect(monsterSkillBonusesInstance.find('input[id="Animal Handling"]').props().value).toEqual(4);
			expect(monsterSkillBonusesInstance.find('input#Acrobatics').props().value).toEqual(1);
			expect(monsterSkillBonusesInstance.find('input#Stealth').props().value).toEqual(18);
			expect(monsterSkillBonusesInstance.find('input#Arcana').props().value).toEqual(17);
			expect(monsterSkillBonusesInstance.find('input#History').props().value).toEqual(17);
			expect(monsterSkillBonusesInstance.find('input#Investigation').props().value).toEqual(36);
			expect(monsterSkillBonusesInstance.find('input#Nature').props().value).toEqual(47);
			expect(monsterSkillBonusesInstance.find('input#Religion').props().value).toEqual(82);
			expect(monsterSkillBonusesInstance.find('input#Insight').props().value).toEqual(12);
			expect(monsterSkillBonusesInstance.find('input#Medicine').props().value).toEqual(11);
			expect(monsterSkillBonusesInstance.find('input#Perception').props().value).toEqual(18);
			expect(monsterSkillBonusesInstance.find('input#Survival').props().value).toEqual(20);
			expect(monsterSkillBonusesInstance.find('input#Deception').props().value).toEqual(30);
			expect(monsterSkillBonusesInstance.find('input#Intimidation').props().value).toEqual(19);
			expect(monsterSkillBonusesInstance.find('input#Performance').props().value).toEqual(37);
			expect(monsterSkillBonusesInstance.find('input#Persuasion').props().value).toEqual(7);
		});

		it('renders without crashing with same props', () => {
			monsterSkillBonusesInstance.setProps({
				initial: {
					Athletics: 9,
					"Sleight of Hand": 2,
					"Animal Handling": 14,
					Acrobatics: 10,
					Stealth: 8,
					Arcana: 7,
					History: 7,
					Investigation: 6,
					Nature: 7,
					Religion: 8,
					Insight: 10,
					Medicine: 12,
					Perception: 15,
					Survival: 11,
					Deception: 10,
					Intimidation: 9,
					Performance: 7,
					Persuasion: 4,
				}
			});
			expect(monsterSkillBonusesInstance.find('input#Athletics').props().value).toEqual(9);
			expect(monsterSkillBonusesInstance.find('input[id="Sleight of Hand"]').props().value).toEqual(2);
			expect(monsterSkillBonusesInstance.find('input[id="Animal Handling"]').props().value).toEqual(14);
			expect(monsterSkillBonusesInstance.find('input#Acrobatics').props().value).toEqual(10);
			expect(monsterSkillBonusesInstance.find('input#Stealth').props().value).toEqual(8);
			expect(monsterSkillBonusesInstance.find('input#Arcana').props().value).toEqual(7);
			expect(monsterSkillBonusesInstance.find('input#History').props().value).toEqual(7);
			expect(monsterSkillBonusesInstance.find('input#Investigation').props().value).toEqual(6);
			expect(monsterSkillBonusesInstance.find('input#Nature').props().value).toEqual(7);
			expect(monsterSkillBonusesInstance.find('input#Religion').props().value).toEqual(8);
			expect(monsterSkillBonusesInstance.find('input#Insight').props().value).toEqual(10);
			expect(monsterSkillBonusesInstance.find('input#Medicine').props().value).toEqual(12);
			expect(monsterSkillBonusesInstance.find('input#Perception').props().value).toEqual(15);
			expect(monsterSkillBonusesInstance.find('input#Survival').props().value).toEqual(11);
			expect(monsterSkillBonusesInstance.find('input#Deception').props().value).toEqual(10);
			expect(monsterSkillBonusesInstance.find('input#Intimidation').props().value).toEqual(9);
			expect(monsterSkillBonusesInstance.find('input#Performance').props().value).toEqual(7);
			expect(monsterSkillBonusesInstance.find('input#Persuasion').props().value).toEqual(4);
		});

		it('disables input if disable prop changes', () => {
			expect(monsterSkillBonusesInstance.find('input#Athletics').props().disabled).toEqual(false);
			expect(monsterSkillBonusesInstance.find('input[id="Sleight of Hand"]').props().disabled).toEqual(false);
			expect(monsterSkillBonusesInstance.find('input[id="Animal Handling"]').props().disabled).toEqual(false);
			expect(monsterSkillBonusesInstance.find('input#Acrobatics').props().disabled).toEqual(false);
			expect(monsterSkillBonusesInstance.find('input#Stealth').props().disabled).toEqual(false);
			expect(monsterSkillBonusesInstance.find('input#Arcana').props().disabled).toEqual(false);
			expect(monsterSkillBonusesInstance.find('input#History').props().disabled).toEqual(false);
			expect(monsterSkillBonusesInstance.find('input#Investigation').props().disabled).toEqual(false);
			expect(monsterSkillBonusesInstance.find('input#Nature').props().disabled).toEqual(false);
			expect(monsterSkillBonusesInstance.find('input#Religion').props().disabled).toEqual(false);
			expect(monsterSkillBonusesInstance.find('input#Insight').props().disabled).toEqual(false);
			expect(monsterSkillBonusesInstance.find('input#Medicine').props().disabled).toEqual(false);
			expect(monsterSkillBonusesInstance.find('input#Perception').props().disabled).toEqual(false);
			expect(monsterSkillBonusesInstance.find('input#Survival').props().disabled).toEqual(false);
			expect(monsterSkillBonusesInstance.find('input#Deception').props().disabled).toEqual(false);
			expect(monsterSkillBonusesInstance.find('input#Intimidation').props().disabled).toEqual(false);
			expect(monsterSkillBonusesInstance.find('input#Performance').props().disabled).toEqual(false);
			expect(monsterSkillBonusesInstance.find('input#Persuasion').props().disabled).toEqual(false);
			monsterSkillBonusesInstance.setProps({
				disabled: true
			})
			expect(monsterSkillBonusesInstance.find('input#Athletics').props().disabled).toEqual(true);
			expect(monsterSkillBonusesInstance.find('input[id="Sleight of Hand"]').props().disabled).toEqual(true);
			expect(monsterSkillBonusesInstance.find('input[id="Animal Handling"]').props().disabled).toEqual(true);
			expect(monsterSkillBonusesInstance.find('input#Acrobatics').props().disabled).toEqual(true);
			expect(monsterSkillBonusesInstance.find('input#Stealth').props().disabled).toEqual(true);
			expect(monsterSkillBonusesInstance.find('input#Arcana').props().disabled).toEqual(true);
			expect(monsterSkillBonusesInstance.find('input#History').props().disabled).toEqual(true);
			expect(monsterSkillBonusesInstance.find('input#Investigation').props().disabled).toEqual(true);
			expect(monsterSkillBonusesInstance.find('input#Nature').props().disabled).toEqual(true);
			expect(monsterSkillBonusesInstance.find('input#Religion').props().disabled).toEqual(true);
			expect(monsterSkillBonusesInstance.find('input#Insight').props().disabled).toEqual(true);
			expect(monsterSkillBonusesInstance.find('input#Medicine').props().disabled).toEqual(true);
			expect(monsterSkillBonusesInstance.find('input#Perception').props().disabled).toEqual(true);
			expect(monsterSkillBonusesInstance.find('input#Survival').props().disabled).toEqual(true);
			expect(monsterSkillBonusesInstance.find('input#Deception').props().disabled).toEqual(true);
			expect(monsterSkillBonusesInstance.find('input#Intimidation').props().disabled).toEqual(true);
			expect(monsterSkillBonusesInstance.find('input#Performance').props().disabled).toEqual(true);
			expect(monsterSkillBonusesInstance.find('input#Persuasion').props().disabled).toEqual(true);
		});
	});

	describe('Small snapshot', () => {
		it ('matches snapshot', () => {
			const shallowMonsterSkillBonusesInstance =
				shallow<MonsterSkillBonuses, IMonsterSkillBonusesProps, IMonsterSkillBonusesState>(
					<MonsterSkillBonuses
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{}}/>
				);
			expect(shallowMonsterSkillBonusesInstance).toMatchSnapshot();
		});
	});

	describe('Happy Path', () => {

		beforeEach(() => {
			monsterSkillBonusesInstance =
				mount<MonsterSkillBonuses, IMonsterSkillBonusesProps, IMonsterSkillBonusesState>(
					<MonsterSkillBonuses
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterSkillBonusesInstance).toBeDefined();
		});

		it('should be able to update state', () => {
			monsterSkillBonusesInstance.find('input#Athletics').simulate('change', { target: { value: 9 } })
			monsterSkillBonusesInstance.find('input[id="Sleight of Hand"]').simulate('change', { target: { value: 2 } })
			monsterSkillBonusesInstance.find('input[id="Animal Handling"]').simulate('change', { target: { value: 14 } })
			monsterSkillBonusesInstance.find('input#Acrobatics').simulate('change', { target: { value: 10 } })
			monsterSkillBonusesInstance.find('input#Stealth').simulate('change', { target: { value: 8 } })
			monsterSkillBonusesInstance.find('input#Arcana').simulate('change', { target: { value: 7 } })
			monsterSkillBonusesInstance.find('input#History').simulate('change', { target: { value: 7 } })
			monsterSkillBonusesInstance.find('input#Investigation').simulate('change', { target: { value: 6 } })
			monsterSkillBonusesInstance.find('input#Nature').simulate('change', { target: { value: 7 } })
			monsterSkillBonusesInstance.find('input#Religion').simulate('change', { target: { value: 8 } })
			monsterSkillBonusesInstance.find('input#Insight').simulate('change', { target: { value: 10 } })
			monsterSkillBonusesInstance.find('input#Medicine').simulate('change', { target: { value: 12 } })
			monsterSkillBonusesInstance.find('input#Perception').simulate('change', { target: { value: 15 } })
			monsterSkillBonusesInstance.find('input#Survival').simulate('change', { target: { value: 11 } })
			monsterSkillBonusesInstance.find('input#Deception').simulate('change', { target: { value: 10 } })
			monsterSkillBonusesInstance.find('input#Intimidation').simulate('change', { target: { value: 9 } })
			monsterSkillBonusesInstance.find('input#Performance').simulate('change', { target: { value: 7 } })
			monsterSkillBonusesInstance.find('input#Persuasion').simulate('change', { target: { value: 4 } })
			expect(monsterSkillBonusesInstance.state()).toEqual({
				// data
				Athletics: 9,
				"Sleight of Hand": 2,
				"Animal Handling": 14,
				Acrobatics: 10,
				Stealth: 8,
				Arcana: 7,
				History: 7,
				Investigation: 6,
				Nature: 7,
				Religion: 8,
				Insight: 10,
				Medicine: 12,
				Perception: 15,
				Survival: 11,
				Deception: 10,
				Intimidation: 9,
				Performance: 7,
				Persuasion: 4,
				// errors
				AthleticsError: undefined,
				"Sleight of HandError": undefined,
				"Animal HandlingError": undefined,
				AcrobaticsError: undefined,
				StealthError: undefined,
				ArcanaError: undefined,
				HistoryError: undefined,
				InvestigationError: undefined,
				NatureError: undefined,
				ReligionError: undefined,
				InsightError: undefined,
				MedicineError: undefined,
				PerceptionError: undefined,
				SurvivalError: undefined,
				DeceptionError: undefined,
				IntimidationError: undefined,
				PerformanceError: undefined,
				PersuasionError: undefined,
			});
		});
		// STATE CHANGE
		it('should change only Athletics when Athletics is changed', () => {
			monsterSkillBonusesInstance.find('input#Athletics').simulate('change', { target: { value: '9' } })
			expect(monsterSkillBonusesInstance.state().Athletics).toEqual(9);
		})

		it('should change only Sleight of Hand when Sleight of Hand is changed', () => {
			monsterSkillBonusesInstance.find('input[id="Sleight of Hand"]').simulate('change', { target: { value: '2' } })
			expect(monsterSkillBonusesInstance.state()['Sleight of Hand']).toEqual(2);
		})

		it('should change only Animal Handling when Animal Handling is changed', () => {
			monsterSkillBonusesInstance.find('input[id="Animal Handling"]').simulate('change', { target: { value: '14' } })
			expect(monsterSkillBonusesInstance.state()['Animal Handling']).toEqual(14);
		})

		it('should change only Acrobatics when Acrobatics is changed', () => {
			monsterSkillBonusesInstance.find('input#Acrobatics').simulate('change', { target: { value: '10' } })
			expect(monsterSkillBonusesInstance.state().Acrobatics).toEqual(10);
		})

		it('should change only Stealth when Stealth is changed', () => {
			monsterSkillBonusesInstance.find('input#Stealth').simulate('change', { target: { value: '8' } })
			expect(monsterSkillBonusesInstance.state().Stealth).toEqual(8);
		})

		it('should change only Arcana when Arcana is changed', () => {
			monsterSkillBonusesInstance.find('input#Arcana').simulate('change', { target: { value: '7' } })
			expect(monsterSkillBonusesInstance.state().Arcana).toEqual(7);
		})

		it('should change only History when History is changed', () => {
			monsterSkillBonusesInstance.find('input#History').simulate('change', { target: { value: '7' } })
			expect(monsterSkillBonusesInstance.state().History).toEqual(7);
		})

		it('should change only Investigation when Investigation is changed', () => {
			monsterSkillBonusesInstance.find('input#Investigation').simulate('change', { target: { value: '6' } })
			expect(monsterSkillBonusesInstance.state().Investigation).toEqual(6);
		})

		it('should change only Nature when Nature is changed', () => {
			monsterSkillBonusesInstance.find('input#Nature').simulate('change', { target: { value: '7' } })
			expect(monsterSkillBonusesInstance.state().Nature).toEqual(7);
		})

		it('should change only Religion when Religion is changed', () => {
			monsterSkillBonusesInstance.find('input#Religion').simulate('change', { target: { value: '8' } })
			expect(monsterSkillBonusesInstance.state().Religion).toEqual(8);
		})

		it('should change only Insight when Insight is changed', () => {
			monsterSkillBonusesInstance.find('input#Insight').simulate('change', { target: { value: '10' } })
			expect(monsterSkillBonusesInstance.state().Insight).toEqual(10);
		})

		it('should change only Medicine when Medicine is changed', () => {
			monsterSkillBonusesInstance.find('input#Medicine').simulate('change', { target: { value: '12' } })
			expect(monsterSkillBonusesInstance.state().Medicine).toEqual(12);
		})

		it('should change only Perception when Perception is changed', () => {
			monsterSkillBonusesInstance.find('input#Perception').simulate('change', { target: { value: '15' } })
			expect(monsterSkillBonusesInstance.state().Perception).toEqual(15);
		})

		it('should change only Survival when Survival is changed', () => {
			monsterSkillBonusesInstance.find('input#Survival').simulate('change', { target: { value: '11' } })
			expect(monsterSkillBonusesInstance.state().Survival).toEqual(11);
		})

		it('should change only Deception when Deception is changed', () => {
			monsterSkillBonusesInstance.find('input#Deception').simulate('change', { target: { value: '10' } })
			expect(monsterSkillBonusesInstance.state().Deception).toEqual(10);
		})

		it('should change only Intimidation when Intimidation is changed', () => {
			monsterSkillBonusesInstance.find('input#Intimidation').simulate('change', { target: { value: '9' } })
			expect(monsterSkillBonusesInstance.state().Intimidation).toEqual(9);
		})

		it('should change only Performance when Performance is changed', () => {
			monsterSkillBonusesInstance.find('input#Performance').simulate('change', { target: { value: '7' } })
			expect(monsterSkillBonusesInstance.state().Performance).toEqual(7);
		})

		it('should change only Persuasion when Persuasion is changed', () => {
			monsterSkillBonusesInstance.find('input#Persuasion').simulate('change', { target: { value: '4' } })
			expect(monsterSkillBonusesInstance.state().Persuasion).toEqual(4);
		})
		// DEFAULTS
		it('should change Athletics back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('input#Athletics').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Athletics).toEqual(undefined);
		})

		it('should change Sleight of Hand back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('input[id="Sleight of Hand"]').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state()['Sleight of Hand']).toEqual(undefined);
		})

		it('should change Animal Handling back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('input[id="Animal Handling"]').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state()['Animal Handling']).toEqual(undefined);
		})

		it('should change Acrobatics back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('input#Acrobatics').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Acrobatics).toEqual(undefined);
		})

		it('should change Stealth back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('input#Stealth').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Stealth).toEqual(undefined);
		})

		it('should change Arcana back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('input#Arcana').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Arcana).toEqual(undefined);
		})

		it('should change History back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('input#History').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().History).toEqual(undefined);
		})

		it('should change Investigation back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('input#Investigation').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Investigation).toEqual(undefined);
		})

		it('should change Nature back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('input#Nature').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Nature).toEqual(undefined);
		})

		it('should change Religion back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('input#Religion').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Religion).toEqual(undefined);
		})

		it('should change Insight back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('input#Insight').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Insight).toEqual(undefined);
		})

		it('should change Medicine back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('input#Medicine').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Medicine).toEqual(undefined);
		})

		it('should change Perception back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('input#Perception').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Perception).toEqual(undefined);
		})

		it('should change Survival back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('input#Survival').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Survival).toEqual(undefined);
		})

		it('should change Deception back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('input#Deception').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Deception).toEqual(undefined);
		})

		it('should change Intimidation back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('input#Intimidation').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Intimidation).toEqual(undefined);
		})

		it('should change Performance back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('input#Performance').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Performance).toEqual(undefined);
		})

		it('should change Persuasion back to undefined when input is empty', () => {
			monsterSkillBonusesInstance.find('input#Persuasion').simulate('change', { target: { value: '' } })
			expect(monsterSkillBonusesInstance.state().Persuasion).toEqual(undefined);
		})

		// VALIDATION
		it('should validate Athletics when Athletics is changed', () => {
			monsterSkillBonusesInstance.find('input#Athletics').simulate('change', { target: { value: '-12'  } })
			expect(monsterSkillBonusesInstance.state().Athletics).toEqual(-12);
			expect(monsterSkillBonusesInstance.find('FormHelperText#Athletics-helper-text').text()).toEqual('\"Athletics\" must be greater than 0');
		})

		it('should validate Sleight of Hand when Sleight of Hand is changed', () => {
			monsterSkillBonusesInstance.find('input[id="Sleight of Hand"]').simulate('change', { target: { value: '-16'  } })
			expect(monsterSkillBonusesInstance.state()["Sleight of Hand"]).toEqual(-16);
			expect(monsterSkillBonusesInstance.find('FormHelperText[id="Sleight of Hand-helper-text"]').text()).toEqual('\"Sleight of Hand\" must be greater than 0');
		})

		it('should validate Animal Handling when Animal Handling is changed', () => {
			monsterSkillBonusesInstance.find('input[id="Animal Handling"]').simulate('change', { target: { value: '-6'  } })
			expect(monsterSkillBonusesInstance.state()["Animal Handling"]).toEqual(-6);
			expect(monsterSkillBonusesInstance.find('FormHelperText[id="Animal Handling-helper-text"]').text()).toEqual('\"Animal Handling\" must be greater than 0');
		})

		it('should validate Acrobatics when Acrobatics is changed', () => {
			monsterSkillBonusesInstance.find('input#Acrobatics').simulate('change', { target: { value: '-102'  } })
			expect(monsterSkillBonusesInstance.state().Acrobatics).toEqual(-102);
			expect(monsterSkillBonusesInstance.find('FormHelperText#Acrobatics-helper-text').text()).toEqual('\"Acrobatics\" must be greater than 0');
		})

		it('should validate Stealth when Stealth is changed', () => {
			monsterSkillBonusesInstance.find('input#Stealth').simulate('change', { target: { value: '-1'  } })
			expect(monsterSkillBonusesInstance.state().Stealth).toEqual(-1);
			expect(monsterSkillBonusesInstance.find('FormHelperText#Stealth-helper-text').text()).toEqual('\"Stealth\" must be greater than 0');
		})

		it('should validate Arcana when Arcana is changed', () => {
			monsterSkillBonusesInstance.find('input#Arcana').simulate('change', { target: { value: '-9'  } })
			expect(monsterSkillBonusesInstance.state().Arcana).toEqual(-9);
			expect(monsterSkillBonusesInstance.find('FormHelperText#Arcana-helper-text').text()).toEqual('\"Arcana\" must be greater than 0');
		})

		it('should validate History when History is changed', () => {
			monsterSkillBonusesInstance.find('input#History').simulate('change', { target: { value: '-12'  } })
			expect(monsterSkillBonusesInstance.state().History).toEqual(-12);
			expect(monsterSkillBonusesInstance.find('FormHelperText#History-helper-text').text()).toEqual('\"History\" must be greater than 0');
		})

		it('should validate Investigation when Investigation is changed', () => {
			monsterSkillBonusesInstance.find('input#Investigation').simulate('change', { target: { value: '-16'  } })
			expect(monsterSkillBonusesInstance.state().Investigation).toEqual(-16);
			expect(monsterSkillBonusesInstance.find('FormHelperText#Investigation-helper-text').text()).toEqual('\"Investigation\" must be greater than 0');
		})

		it('should validate Nature when Nature is changed', () => {
			monsterSkillBonusesInstance.find('input#Nature').simulate('change', { target: { value: '-6'  } })
			expect(monsterSkillBonusesInstance.state().Nature).toEqual(-6);
			expect(monsterSkillBonusesInstance.find('FormHelperText#Nature-helper-text').text()).toEqual('\"Nature\" must be greater than 0');
		})

		it('should validate Religion when Religion is changed', () => {
			monsterSkillBonusesInstance.find('input#Religion').simulate('change', { target: { value: '-102'  } })
			expect(monsterSkillBonusesInstance.state().Religion).toEqual(-102);
			expect(monsterSkillBonusesInstance.find('FormHelperText#Religion-helper-text').text()).toEqual('\"Religion\" must be greater than 0');
		})

		it('should validate Insight when Insight is changed', () => {
			monsterSkillBonusesInstance.find('input#Insight').simulate('change', { target: { value: '-1'  } })
			expect(monsterSkillBonusesInstance.state().Insight).toEqual(-1);
			expect(monsterSkillBonusesInstance.find('FormHelperText#Insight-helper-text').text()).toEqual('\"Insight\" must be greater than 0');
		})

		it('should validate Medicine when Medicine is changed', () => {
			monsterSkillBonusesInstance.find('input#Medicine').simulate('change', { target: { value: '-9'  } })
			expect(monsterSkillBonusesInstance.state().Medicine).toEqual(-9);
			expect(monsterSkillBonusesInstance.find('FormHelperText#Medicine-helper-text').text()).toEqual('\"Medicine\" must be greater than 0');
		})

		it('should validate Perception when Perception is changed', () => {
			monsterSkillBonusesInstance.find('input#Perception').simulate('change', { target: { value: '-12'  } })
			expect(monsterSkillBonusesInstance.state().Perception).toEqual(-12);
			expect(monsterSkillBonusesInstance.find('FormHelperText#Perception-helper-text').text()).toEqual('\"Perception\" must be greater than 0');
		})

		it('should validate Survival when Survival is changed', () => {
			monsterSkillBonusesInstance.find('input#Survival').simulate('change', { target: { value: '-16'  } })
			expect(monsterSkillBonusesInstance.state().Survival).toEqual(-16);
			expect(monsterSkillBonusesInstance.find('FormHelperText#Survival-helper-text').text()).toEqual('\"Survival\" must be greater than 0');
		})

		it('should validate Deception when Deception is changed', () => {
			monsterSkillBonusesInstance.find('input#Deception').simulate('change', { target: { value: '-6'  } })
			expect(monsterSkillBonusesInstance.state().Deception).toEqual(-6);
			expect(monsterSkillBonusesInstance.find('FormHelperText#Deception-helper-text').text()).toEqual('\"Deception\" must be greater than 0');
		})

		it('should validate Intimidation when Intimidation is changed', () => {
			monsterSkillBonusesInstance.find('input#Intimidation').simulate('change', { target: { value: '-102'  } })
			expect(monsterSkillBonusesInstance.state().Intimidation).toEqual(-102);
			expect(monsterSkillBonusesInstance.find('FormHelperText#Intimidation-helper-text').text()).toEqual('\"Intimidation\" must be greater than 0');
		})

		it('should validate Performance when Performance is changed', () => {
			monsterSkillBonusesInstance.find('input#Performance').simulate('change', { target: { value: '-1'  } })
			expect(monsterSkillBonusesInstance.state().Performance).toEqual(-1);
			expect(monsterSkillBonusesInstance.find('FormHelperText#Performance-helper-text').text()).toEqual('\"Performance\" must be greater than 0');
		})

		it('should validate Persuasion when Persuasion is changed', () => {
			monsterSkillBonusesInstance.find('input#Persuasion').simulate('change', { target: { value: '-9'  } })
			expect(monsterSkillBonusesInstance.state().Persuasion).toEqual(-9);
			expect(monsterSkillBonusesInstance.find('FormHelperText#Persuasion-helper-text').text()).toEqual('\"Persuasion\" must be greater than 0');
		})
	});
});