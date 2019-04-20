import * as React from 'react';
import { mount, ReactWrapper, shallow } from 'enzyme';

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
			expect(monsterStatsInstance.find('input#AbilityScoresStrength').props().value).toEqual(123);
		});

		it('should have the correct number for Dexterity', () => {
			expect(monsterStatsInstance.find('input#AbilityScoresDexterity').props().value).toEqual(53);
		});

		it('should have the correct number for Constitution', () => {
			expect(monsterStatsInstance.find('input#AbilityScoresConstitution').props().value).toEqual(25);
		});

		it('should have the correct number for Intelligence', () => {
			expect(monsterStatsInstance.find('input#AbilityScoresIntelligence').props().value).toEqual(85);
		});

		it('should have the correct number for Wisdom', () => {
			expect(monsterStatsInstance.find('input#AbilityScoresWisdom').props().value).toEqual(43);
		});

		it('should have the correct number for Charisma', () => {
			expect(monsterStatsInstance.find('input#AbilityScoresCharisma').props().value).toEqual(32);
		});
	});

	describe('componentWillReceiveProps()', () => {
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

		it('renders new props', () => {
			monsterStatsInstance.setProps({
				initial: {
					Strength: 12,
					Dexterity: 36,
					Constitution: 5,
					Intelligence: 52,
					Wisdom: 71,
					Charisma: 14
				}
			})
			expect(monsterStatsInstance.find('input#AbilityScoresStrength').props().value).toEqual(12);
			expect(monsterStatsInstance.find('input#AbilityScoresDexterity').props().value).toEqual(36);
			expect(monsterStatsInstance.find('input#AbilityScoresConstitution').props().value).toEqual(5);
			expect(monsterStatsInstance.find('input#AbilityScoresIntelligence').props().value).toEqual(52);
			expect(monsterStatsInstance.find('input#AbilityScoresWisdom').props().value).toEqual(71);
			expect(monsterStatsInstance.find('input#AbilityScoresCharisma').props().value).toEqual(14);
		});

		it('renders without crashing with same props', () => {
			monsterStatsInstance.setProps({
				initial: {
					Strength: 123,
					Dexterity: 53,
					Constitution: 25,
					Intelligence: 85,
					Wisdom: 43,
					Charisma: 32
				}
			});
			expect(monsterStatsInstance.find('input#AbilityScoresStrength').props().value).toEqual(123);
			expect(monsterStatsInstance.find('input#AbilityScoresDexterity').props().value).toEqual(53);
			expect(monsterStatsInstance.find('input#AbilityScoresConstitution').props().value).toEqual(25);
			expect(monsterStatsInstance.find('input#AbilityScoresIntelligence').props().value).toEqual(85);
			expect(monsterStatsInstance.find('input#AbilityScoresWisdom').props().value).toEqual(43);
			expect(monsterStatsInstance.find('input#AbilityScoresCharisma').props().value).toEqual(32);
		});

		it('disables input if disable prop changes', () => {
			expect(monsterStatsInstance.find('input#AbilityScoresStrength').props().disabled).toEqual(false);
			expect(monsterStatsInstance.find('input#AbilityScoresDexterity').props().disabled).toEqual(false);
			expect(monsterStatsInstance.find('input#AbilityScoresConstitution').props().disabled).toEqual(false);
			expect(monsterStatsInstance.find('input#AbilityScoresIntelligence').props().disabled).toEqual(false);
			expect(monsterStatsInstance.find('input#AbilityScoresWisdom').props().disabled).toEqual(false);
			expect(monsterStatsInstance.find('input#AbilityScoresCharisma').props().disabled).toEqual(false);
			monsterStatsInstance.setProps({
				disabled: true
			})
			expect(monsterStatsInstance.find('input#AbilityScoresStrength').props().disabled).toEqual(true);
			expect(monsterStatsInstance.find('input#AbilityScoresDexterity').props().disabled).toEqual(true);
			expect(monsterStatsInstance.find('input#AbilityScoresConstitution').props().disabled).toEqual(true);
			expect(monsterStatsInstance.find('input#AbilityScoresIntelligence').props().disabled).toEqual(true);
			expect(monsterStatsInstance.find('input#AbilityScoresWisdom').props().disabled).toEqual(true);
			expect(monsterStatsInstance.find('input#AbilityScoresCharisma').props().disabled).toEqual(true);
		});
	});

	describe('Small snapshot', () => {
		it ('matches snapshot', () => {
			const payloadSchema = Joi.object({
				SavingThrows: Joi.object({
					Strength: Joi.number().integer().greater(0).allow(0).label('Strength'),
					Dexterity: Joi.number().integer().greater(0).allow(0).label('Dexterity'),
					Constitution: Joi.number().integer().greater(0).allow(0).label('Constitution'),
					Intelligence: Joi.number().integer().greater(0).allow(0).label('Intelligence'),
					Wisdom: Joi.number().integer().greater(0).allow(0).label('Wisdom'),
					Charisma: Joi.number().integer().greater(0).allow(0).label('Charisma')
				})
			});
			const shallowMonsterStatsInstance =
				shallow<MonsterStats, IMonsterStatsProps, IMonsterStatsState>(
					<MonsterStats
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						Parent='SavingThrows'
						initial={{}}/>
				);
			expect(shallowMonsterStatsInstance).toMatchSnapshot();
		});
	});

	describe('Provided Stat values', () => {

		beforeEach(() => {
			const payloadSchema = Joi.object({
				SavingThrows: Joi.object({
					Strength: Joi.number().integer().greater(0).allow(0).label('Strength'),
					Dexterity: Joi.number().integer().greater(0).allow(0).label('Dexterity'),
					Constitution: Joi.number().integer().greater(0).allow(0).label('Constitution'),
					Intelligence: Joi.number().integer().greater(0).allow(0).label('Intelligence'),
					Wisdom: Joi.number().integer().greater(0).allow(0).label('Wisdom'),
					Charisma: Joi.number().integer().greater(0).allow(0).label('Charisma')
				})
			});
			monsterStatsInstance =
				mount<MonsterStats, IMonsterStatsProps, IMonsterStatsState>(
					<MonsterStats
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						Parent='SavingThrows'
						initial={{
							Strength: 56,
							Dexterity: 0,
							Constitution: 76,
							Intelligence: 13,
							Wisdom: 54,
							Charisma: 10
						}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterStatsInstance).toBeDefined();
		});

		it('should have the correct number for Strength', () => {
			expect(monsterStatsInstance.find('input#SavingThrowsStrength').props().value).toEqual(56);
		});

		it('should have the correct number for Dexterity', () => {
			expect(monsterStatsInstance.find('input#SavingThrowsDexterity').props().value).toEqual(0);
		});

		it('should have the correct number for Constitution', () => {
			expect(monsterStatsInstance.find('input#SavingThrowsConstitution').props().value).toEqual(76);
		});

		it('should have the correct number for Intelligence', () => {
			expect(monsterStatsInstance.find('input#SavingThrowsIntelligence').props().value).toEqual(13);
		});

		it('should have the correct number for Wisdom', () => {
			expect(monsterStatsInstance.find('input#SavingThrowsWisdom').props().value).toEqual(54);
		});

		it('should have the correct number for Charisma', () => {
			expect(monsterStatsInstance.find('input#SavingThrowsCharisma').props().value).toEqual(10);
		});
	});

	describe('Happy Path Ability Score', () => {

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
			monsterStatsInstance.find('input#AbilityScoresStrength').simulate('change', { target: { value: 17 } });
			monsterStatsInstance.find('input#AbilityScoresDexterity').simulate('change', { target: { value: 15 } });
			monsterStatsInstance.find('input#AbilityScoresConstitution').simulate('change', { target: { value: 13 } });
			monsterStatsInstance.find('input#AbilityScoresIntelligence').simulate('change', { target: { value: 12 } });
			monsterStatsInstance.find('input#AbilityScoresWisdom').simulate('change', { target: { value: 16 } });
			monsterStatsInstance.find('input#AbilityScoresCharisma').simulate('change', { target: { value: 15 } });
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
			monsterStatsInstance.find('input#AbilityScoresStrength').simulate('change', { target: { value: '22' } })
			expect(monsterStatsInstance.state().Strength).toEqual(22);
		})

		it('should change only Dexterity when Dexterity is changed', () => {
			monsterStatsInstance.find('input#AbilityScoresDexterity').simulate('change', { target: { value: '74' } })
			expect(monsterStatsInstance.state().Dexterity).toEqual(74);
		})

		it('should change only Constitution when Constitution is changed', () => {
			monsterStatsInstance.find('input#AbilityScoresConstitution').simulate('change', { target: { value: '5' } })
			expect(monsterStatsInstance.state().Constitution).toEqual(5);
		})

		it('should change only Intelligence when Intelligence is changed', () => {
			monsterStatsInstance.find('input#AbilityScoresIntelligence').simulate('change', { target: { value: '91' } })
			expect(monsterStatsInstance.state().Intelligence).toEqual(91);
		})

		it('should change only Wisdom when Wisdom is changed', () => {
			monsterStatsInstance.find('input#AbilityScoresWisdom').simulate('change', { target: { value: '24' } })
			expect(monsterStatsInstance.state().Wisdom).toEqual(24);
		})

		it('should change only Charisma when Charisma is changed', () => {
			monsterStatsInstance.find('input#AbilityScoresCharisma').simulate('change', { target: { value: '100' } })
			expect(monsterStatsInstance.state().Charisma).toEqual(100);
		})

		// DEFAULTS
		it('should change Strength back to undefined when input is empty', () => {
			monsterStatsInstance.find('input#AbilityScoresStrength').simulate('change', { target: { value: '' } })
			expect(monsterStatsInstance.state().Strength).toEqual(undefined);
		})

		it('should change Dexterity back to undefined when input is empty', () => {
			monsterStatsInstance.find('input#AbilityScoresDexterity').simulate('change', { target: { value: '' } })
			expect(monsterStatsInstance.state().Dexterity).toEqual(undefined);
		})

		it('should change Constitution back to undefined when input is empty', () => {
			monsterStatsInstance.find('input#AbilityScoresConstitution').simulate('change', { target: { value: '' } })
			expect(monsterStatsInstance.state().Constitution).toEqual(undefined);
		})

		it('should change Intelligence back to undefined when input is empty', () => {
			monsterStatsInstance.find('input#AbilityScoresIntelligence').simulate('change', { target: { value: '' } })
			expect(monsterStatsInstance.state().Intelligence).toEqual(undefined);
		})

		it('should change Wisdom back to undefined when input is empty', () => {
			monsterStatsInstance.find('input#AbilityScoresWisdom').simulate('change', { target: { value: '' } })
			expect(monsterStatsInstance.state().Wisdom).toEqual(undefined);
		})

		it('should change Charisma back to undefined when input is empty', () => {
			monsterStatsInstance.find('input#AbilityScoresCharisma').simulate('change', { target: { value: '' } })
			expect(monsterStatsInstance.state().Charisma).toEqual(undefined);
		})

		// VALIDATION
		it('should validate Strength when Strength is changed', () => {
			monsterStatsInstance.find('input#AbilityScoresStrength').simulate('change', { target: { value: '-12'  } })
			expect(monsterStatsInstance.state().Strength).toEqual(-12);
			expect(monsterStatsInstance.find('FormHelperText#AbilityScoresStrength-helper-text').text()).toEqual('\"Strength\" must be greater than 0');
		})

		it('should validate Dexterity when Dexterity is changed', () => {
			monsterStatsInstance.find('input#AbilityScoresDexterity').simulate('change', { target: { value: '-16'  } })
			expect(monsterStatsInstance.state().Dexterity).toEqual(-16);
			expect(monsterStatsInstance.find('FormHelperText#AbilityScoresDexterity-helper-text').text()).toEqual('\"Dexterity\" must be greater than 0');
		})

		it('should validate Constitution when Constitution is changed', () => {
			monsterStatsInstance.find('input#AbilityScoresConstitution').simulate('change', { target: { value: '-6'  } })
			expect(monsterStatsInstance.state().Constitution).toEqual(-6);
			expect(monsterStatsInstance.find('FormHelperText#AbilityScoresConstitution-helper-text').text()).toEqual('\"Constitution\" must be greater than 0');
		})

		it('should validate Intelligence when Intelligence is changed', () => {
			monsterStatsInstance.find('input#AbilityScoresIntelligence').simulate('change', { target: { value: '-102'  } })
			expect(monsterStatsInstance.state().Intelligence).toEqual(-102);
			expect(monsterStatsInstance.find('FormHelperText#AbilityScoresIntelligence-helper-text').text()).toEqual('\"Intelligence\" must be greater than 0');
		})

		it('should validate Wisdom when Wisdom is changed', () => {
			monsterStatsInstance.find('input#AbilityScoresWisdom').simulate('change', { target: { value: '0'  } })
			expect(monsterStatsInstance.state().Wisdom).toEqual(0);
			expect(monsterStatsInstance.find('FormHelperText#AbilityScoresWisdom-helper-text').text()).toEqual('\"Wisdom\" must be greater than 0');
		})

		it('should validate Charisma when Charisma is changed', () => {
			monsterStatsInstance.find('input#AbilityScoresCharisma').simulate('change', { target: { value: '-9'  } })
			expect(monsterStatsInstance.state().Charisma).toEqual(-9);
			expect(monsterStatsInstance.find('FormHelperText#AbilityScoresCharisma-helper-text').text()).toEqual('\"Charisma\" must be greater than 0');
		})
	});

	describe('Happy Path Saving Throws', () => {

		beforeEach(() => {
			const payloadSchema = Joi.object({
				SavingThrows: Joi.object({
					Strength: Joi.number().integer().greater(0).allow(0).label('Strength'),
					Dexterity: Joi.number().integer().greater(0).allow(0).label('Dexterity'),
					Constitution: Joi.number().integer().greater(0).allow(0).label('Constitution'),
					Intelligence: Joi.number().integer().greater(0).allow(0).label('Intelligence'),
					Wisdom: Joi.number().integer().greater(0).allow(0).label('Wisdom'),
					Charisma: Joi.number().integer().greater(0).allow(0).label('Charisma')
				})
			});
			monsterStatsInstance =
				mount<MonsterStats, IMonsterStatsProps, IMonsterStatsState>(
					<MonsterStats
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						Parent='SavingThrows'
						initial={{}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterStatsInstance).toBeDefined();
		});

		it('should be able to update state', () => {
			monsterStatsInstance.find('input#SavingThrowsStrength').simulate('change', { target: { value: 23 } });
			monsterStatsInstance.find('input#SavingThrowsDexterity').simulate('change', { target: { value: 0 } });
			monsterStatsInstance.find('input#SavingThrowsConstitution').simulate('change', { target: { value: 1 } });
			monsterStatsInstance.find('input#SavingThrowsIntelligence').simulate('change', { target: { value: 100 } });
			monsterStatsInstance.find('input#SavingThrowsWisdom').simulate('change', { target: { value: 17 } });
			monsterStatsInstance.find('input#SavingThrowsCharisma').simulate('change', { target: { value: 0 } });
			expect(monsterStatsInstance.state()).toEqual({
				// data
				Strength: 23,
				Dexterity: 0,
				Constitution: 1,
				Intelligence: 100,
				Wisdom: 17,
				Charisma: 0,
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
			monsterStatsInstance.find('input#SavingThrowsStrength').simulate('change', { target: { value: '22' } })
			expect(monsterStatsInstance.state().Strength).toEqual(22);
		})

		it('should change only Dexterity when Dexterity is changed', () => {
			monsterStatsInstance.find('input#SavingThrowsDexterity').simulate('change', { target: { value: '0' } })
			expect(monsterStatsInstance.state().Dexterity).toEqual(0);
		})

		it('should change only Constitution when Constitution is changed', () => {
			monsterStatsInstance.find('input#SavingThrowsConstitution').simulate('change', { target: { value: '5' } })
			expect(monsterStatsInstance.state().Constitution).toEqual(5);
		})

		it('should change only Intelligence when Intelligence is changed', () => {
			monsterStatsInstance.find('input#SavingThrowsIntelligence').simulate('change', { target: { value: '0' } })
			expect(monsterStatsInstance.state().Intelligence).toEqual(0);
		})

		it('should change only Wisdom when Wisdom is changed', () => {
			monsterStatsInstance.find('input#SavingThrowsWisdom').simulate('change', { target: { value: '24' } })
			expect(monsterStatsInstance.state().Wisdom).toEqual(24);
		})

		it('should change only Charisma when Charisma is changed', () => {
			monsterStatsInstance.find('input#SavingThrowsCharisma').simulate('change', { target: { value: '100' } })
			expect(monsterStatsInstance.state().Charisma).toEqual(100);
		})

		// DEFAULTS
		it('should change Strength back to undefined when input is empty', () => {
			monsterStatsInstance.find('input#SavingThrowsStrength').simulate('change', { target: { value: '' } })
			expect(monsterStatsInstance.state().Strength).toEqual(undefined);
		})

		it('should change Dexterity back to undefined when input is empty', () => {
			monsterStatsInstance.find('input#SavingThrowsDexterity').simulate('change', { target: { value: '' } })
			expect(monsterStatsInstance.state().Dexterity).toEqual(undefined);
		})

		it('should change Constitution back to undefined when input is empty', () => {
			monsterStatsInstance.find('input#SavingThrowsConstitution').simulate('change', { target: { value: '' } })
			expect(monsterStatsInstance.state().Constitution).toEqual(undefined);
		})

		it('should change Intelligence back to undefined when input is empty', () => {
			monsterStatsInstance.find('input#SavingThrowsIntelligence').simulate('change', { target: { value: '' } })
			expect(monsterStatsInstance.state().Intelligence).toEqual(undefined);
		})

		it('should change Wisdom back to undefined when input is empty', () => {
			monsterStatsInstance.find('input#SavingThrowsWisdom').simulate('change', { target: { value: '' } })
			expect(monsterStatsInstance.state().Wisdom).toEqual(undefined);
		})

		it('should change Charisma back to undefined when input is empty', () => {
			monsterStatsInstance.find('input#SavingThrowsCharisma').simulate('change', { target: { value: '' } })
			expect(monsterStatsInstance.state().Charisma).toEqual(undefined);
		})

		// VALIDATION
		it('should validate Strength when Strength is changed', () => {
			monsterStatsInstance.find('input#SavingThrowsStrength').simulate('change', { target: { value: '-12'  } })
			expect(monsterStatsInstance.state().Strength).toEqual(-12);
			expect(monsterStatsInstance.find('FormHelperText#SavingThrowsStrength-helper-text').text()).toEqual('\"Strength\" must be greater than 0');
		})

		it('should validate Dexterity when Dexterity is changed', () => {
			monsterStatsInstance.find('input#SavingThrowsDexterity').simulate('change', { target: { value: '-16'  } })
			expect(monsterStatsInstance.state().Dexterity).toEqual(-16);
			expect(monsterStatsInstance.find('FormHelperText#SavingThrowsDexterity-helper-text').text()).toEqual('\"Dexterity\" must be greater than 0');
		})

		it('should validate Constitution when Constitution is changed', () => {
			monsterStatsInstance.find('input#SavingThrowsConstitution').simulate('change', { target: { value: '-6'  } })
			expect(monsterStatsInstance.state().Constitution).toEqual(-6);
			expect(monsterStatsInstance.find('FormHelperText#SavingThrowsConstitution-helper-text').text()).toEqual('\"Constitution\" must be greater than 0');
		})

		it('should validate Intelligence when Intelligence is changed', () => {
			monsterStatsInstance.find('input#SavingThrowsIntelligence').simulate('change', { target: { value: '-102'  } })
			expect(monsterStatsInstance.state().Intelligence).toEqual(-102);
			expect(monsterStatsInstance.find('FormHelperText#SavingThrowsIntelligence-helper-text').text()).toEqual('\"Intelligence\" must be greater than 0');
		})

		it('should validate Wisdom when Wisdom is changed', () => {
			monsterStatsInstance.find('input#SavingThrowsWisdom').simulate('change', { target: { value: '-1'  } })
			expect(monsterStatsInstance.state().Wisdom).toEqual(-1);
			expect(monsterStatsInstance.find('FormHelperText#SavingThrowsWisdom-helper-text').text()).toEqual('\"Wisdom\" must be greater than 0');
		})

		it('should validate Charisma when Charisma is changed', () => {
			monsterStatsInstance.find('input#SavingThrowsCharisma').simulate('change', { target: { value: '-9'  } })
			expect(monsterStatsInstance.state().Charisma).toEqual(-9);
			expect(monsterStatsInstance.find('FormHelperText#SavingThrowsCharisma-helper-text').text()).toEqual('\"Charisma\" must be greater than 0');
		})
	});
});