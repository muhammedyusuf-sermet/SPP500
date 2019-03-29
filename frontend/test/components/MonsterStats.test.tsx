import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';

import { IMonsterStatsProps, IMonsterStatsState, MonsterStats } from '../../src/renderer/components/platform/pages/view_catalog/monster/MonsterStats';
const Joi = require('joi');
import { ValidationOptions } from 'joi';

const validateOptions: ValidationOptions = {
	abortEarly: false,
	convert: true,
	allowUnknown: false,
	context: {

	}
};

////// Happy Path //////
describe('Monster Stats', () => {

	let monsterStatsInstance: ReactWrapper<IMonsterStatsProps, IMonsterStatsState, MonsterStats>;

	describe('Provided Stat values', () => {

		beforeEach(() => {
			const payloadSchema = Joi.object({
				AbilityScores: Joi.object({
					Strength: Joi.number().integer().greater(0).label('Strength'),
					Dexterity: Joi.number().integer().greater(0).label('Dexterity'),
					Constitution: Joi.number().integer().greater(0).label('Constitution'),
					Intelligence: Joi.number().integer().greater(0).label('Intelligence'),
					Wisdom: Joi.number().integer().greater(0).label('Wisdom'),
					Charisma: Joi.number().integer().greater(0).label('Charisma')
				})
			});
			monsterStatsInstance =
				mount<MonsterStats, IMonsterStatsProps, IMonsterStatsState>(
					<MonsterStats
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						Parent='AbilityScores'
						initial={{
							Strength: 123,
							Dexterity: 53,
							Constitution: 25,
							Intelligence: 85,
							Wisdom: 43,
							Charisma: 32
						}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterStatsInstance).toBeDefined();
		});

		it('should have the correct number for Strength', () => {
			expect(monsterStatsInstance.find('Input#AbilityScoresStrength').props().value).toEqual(123);
		});

		it('should have the correct number for Dexterity', () => {
			expect(monsterStatsInstance.find('Input#AbilityScoresDexterity').props().value).toEqual(53);
		});

		it('should have the correct number for Constitution', () => {
			expect(monsterStatsInstance.find('Input#AbilityScoresConstitution').props().value).toEqual(25);
		});

		it('should have the correct number for Intelligence', () => {
			expect(monsterStatsInstance.find('Input#AbilityScoresIntelligence').props().value).toEqual(85);
		});

		it('should have the correct number for Wisdom', () => {
			expect(monsterStatsInstance.find('Input#AbilityScoresWisdom').props().value).toEqual(43);
		});

		it('should have the correct number for Charisma', () => {
			expect(monsterStatsInstance.find('Input#AbilityScoresCharisma').props().value).toEqual(32);
		});
	});

	describe('Happy Path', () => {

		beforeEach(() => {
			const payloadSchema = Joi.object({
				AbilityScores: Joi.object({
					Strength: Joi.number().integer().greater(0).label('Strength'),
					Dexterity: Joi.number().integer().greater(0).label('Dexterity'),
					Constitution: Joi.number().integer().greater(0).label('Constitution'),
					Intelligence: Joi.number().integer().greater(0).label('Intelligence'),
					Wisdom: Joi.number().integer().greater(0).label('Wisdom'),
					Charisma: Joi.number().integer().greater(0).label('Charisma')
				})
			});
			monsterStatsInstance =
				mount<MonsterStats, IMonsterStatsProps, IMonsterStatsState>(
					<MonsterStats
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						Parent='AbilityScores'
						initial={{}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterStatsInstance).toBeDefined();
		});

		it('should be able to update state', () => {
			monsterStatsInstance.find('Input#AbilityScoresStrength').simulate('change', { target: { value: 17 } });
			monsterStatsInstance.find('Input#AbilityScoresDexterity').simulate('change', { target: { value: 15 } });
			monsterStatsInstance.find('Input#AbilityScoresConstitution').simulate('change', { target: { value: 13 } });
			monsterStatsInstance.find('Input#AbilityScoresIntelligence').simulate('change', { target: { value: 12 } });
			monsterStatsInstance.find('Input#AbilityScoresWisdom').simulate('change', { target: { value: 16 } });
			monsterStatsInstance.find('Input#AbilityScoresCharisma').simulate('change', { target: { value: 15 } });
			expect(monsterStatsInstance.state()).toEqual({
				// data
				Strength: 17,
				Dexterity: 15,
				Constitution: 13,
				Intelligence: 12,
				Wisdom: 16,
				Charisma: 15,
				// errors
				StrengthError: undefined,
				DexterityError: undefined,
				ConstitutionError: undefined,
				IntelligenceError: undefined,
				WisdomError: undefined,
				CharismaError: undefined,
			});
		});
		// STATE CHANGE
		it('should change only Strength when Strength is changed', () => {
			monsterStatsInstance.find('Input#AbilityScoresStrength').simulate('change', { target: { value: '22' } })
			expect(monsterStatsInstance.state().Strength).toEqual(22);
		})

		it('should change only Dexterity when Dexterity is changed', () => {
			monsterStatsInstance.find('Input#AbilityScoresDexterity').simulate('change', { target: { value: '74' } })
			expect(monsterStatsInstance.state().Dexterity).toEqual(74);
		})

		it('should change only Constitution when Constitution is changed', () => {
			monsterStatsInstance.find('Input#AbilityScoresConstitution').simulate('change', { target: { value: '5' } })
			expect(monsterStatsInstance.state().Constitution).toEqual(5);
		})

		it('should change only Intelligence when Intelligence is changed', () => {
			monsterStatsInstance.find('Input#AbilityScoresIntelligence').simulate('change', { target: { value: '91' } })
			expect(monsterStatsInstance.state().Intelligence).toEqual(91);
		})

		it('should change only Wisdom when Wisdom is changed', () => {
			monsterStatsInstance.find('Input#AbilityScoresWisdom').simulate('change', { target: { value: '24' } })
			expect(monsterStatsInstance.state().Wisdom).toEqual(24);
		})

		it('should change only Charisma when Charisma is changed', () => {
			monsterStatsInstance.find('Input#AbilityScoresCharisma').simulate('change', { target: { value: '100' } })
			expect(monsterStatsInstance.state().Charisma).toEqual(100);
		})

		// DEFAULTS
		it('should change Strength back to undefined when input is empty', () => {
			monsterStatsInstance.find('Input#AbilityScoresStrength').simulate('change', { target: { value: '' } })
			expect(monsterStatsInstance.state().Strength).toEqual(undefined);
		})

		it('should change Dexterity back to undefined when input is empty', () => {
			monsterStatsInstance.find('Input#AbilityScoresDexterity').simulate('change', { target: { value: '' } })
			expect(monsterStatsInstance.state().Dexterity).toEqual(undefined);
		})

		it('should change Constitution back to undefined when input is empty', () => {
			monsterStatsInstance.find('Input#AbilityScoresConstitution').simulate('change', { target: { value: '' } })
			expect(monsterStatsInstance.state().Constitution).toEqual(undefined);
		})

		it('should change Intelligence back to undefined when input is empty', () => {
			monsterStatsInstance.find('Input#AbilityScoresIntelligence').simulate('change', { target: { value: '' } })
			expect(monsterStatsInstance.state().Intelligence).toEqual(undefined);
		})

		it('should change Wisdom back to undefined when input is empty', () => {
			monsterStatsInstance.find('Input#AbilityScoresWisdom').simulate('change', { target: { value: '' } })
			expect(monsterStatsInstance.state().Wisdom).toEqual(undefined);
		})

		it('should change Charisma back to undefined when input is empty', () => {
			monsterStatsInstance.find('Input#AbilityScoresCharisma').simulate('change', { target: { value: '' } })
			expect(monsterStatsInstance.state().Charisma).toEqual(undefined);
		})

		// VALIDATION
		it('should validate Strength when Strength is changed', () => {
			monsterStatsInstance.find('Input#AbilityScoresStrength').simulate('change', { target: { value: '-12'  } })
			expect(monsterStatsInstance.state().Strength).toEqual(-12);
			expect(monsterStatsInstance.find('Help#AbilityScoresStrength').text()).toEqual('\"Strength\" must be greater than 0');
		})

		it('should validate Dexterity when Dexterity is changed', () => {
			monsterStatsInstance.find('Input#AbilityScoresDexterity').simulate('change', { target: { value: '-16'  } })
			expect(monsterStatsInstance.state().Dexterity).toEqual(-16);
			expect(monsterStatsInstance.find('Help#AbilityScoresDexterity').text()).toEqual('\"Dexterity\" must be greater than 0');
		})

		it('should validate Constitution when Constitution is changed', () => {
			monsterStatsInstance.find('Input#AbilityScoresConstitution').simulate('change', { target: { value: '-6'  } })
			expect(monsterStatsInstance.state().Constitution).toEqual(-6);
			expect(monsterStatsInstance.find('Help#AbilityScoresConstitution').text()).toEqual('\"Constitution\" must be greater than 0');
		})

		it('should validate Intelligence when Intelligence is changed', () => {
			monsterStatsInstance.find('Input#AbilityScoresIntelligence').simulate('change', { target: { value: '-102'  } })
			expect(monsterStatsInstance.state().Intelligence).toEqual(-102);
			expect(monsterStatsInstance.find('Help#AbilityScoresIntelligence').text()).toEqual('\"Intelligence\" must be greater than 0');
		})

		it('should validate Wisdom when Wisdom is changed', () => {
			monsterStatsInstance.find('Input#AbilityScoresWisdom').simulate('change', { target: { value: '0'  } })
			expect(monsterStatsInstance.state().Wisdom).toEqual(0);
			expect(monsterStatsInstance.find('Help#AbilityScoresWisdom').text()).toEqual('\"Wisdom\" must be greater than 0');
		})

		it('should validate Charisma when Charisma is changed', () => {
			monsterStatsInstance.find('Input#AbilityScoresCharisma').simulate('change', { target: { value: '-9'  } })
			expect(monsterStatsInstance.state().Charisma).toEqual(-9);
			expect(monsterStatsInstance.find('Help#AbilityScoresCharisma').text()).toEqual('\"Charisma\" must be greater than 0');
		})
	});
});