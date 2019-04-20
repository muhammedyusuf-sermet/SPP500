import * as React from 'react';
import { mount, ReactWrapper, shallow } from 'enzyme';

import { IMonsterSenseBonusesProps, IMonsterSenseBonusesState, MonsterSenseBonuses } from '../../src/renderer/components/platform/pages/view_catalog/monster/MonsterSenseBonuses';
const Joi = require('joi');
import { ValidationOptions } from 'joi';

const payloadSchema = Joi.object({
	Senses: Joi.object().pattern(
		Joi.symbol().valid([
			"Blind", "Blindsight", "Darkvision", "Tremorsense", "Truesight",
			"Passive Perception", "Passive Investigation", "Passive Insight" ]),
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
describe('Monster SenseBonuses', () => {

	let monsterSenseBonusesInstance: ReactWrapper<IMonsterSenseBonusesProps, IMonsterSenseBonusesState, MonsterSenseBonuses>;

	describe('Provided Stat values', () => {

		beforeEach(() => {
			monsterSenseBonusesInstance =
				mount<MonsterSenseBonuses, IMonsterSenseBonusesProps, IMonsterSenseBonusesState>(
					<MonsterSenseBonuses
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{
							Blind: 30,
							Blindsight: 30,
							Darkvision: 10,
							Tremorsense: 15,
							Truesight: 60,
							"Passive Perception": 13,
							"Passive Investigation": 14,
							"Passive Insight": 16,
						}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterSenseBonusesInstance).toBeDefined();
		});

		it('should have the correct number for Blind', () => {
			expect(monsterSenseBonusesInstance.find('input#Blind').props().value).toEqual(30);
		});

		it('should have the correct number for Blindsight', () => {
			expect(monsterSenseBonusesInstance.find('input#Blindsight').props().value).toEqual(30);
		});

		it('should have the correct number for Darkvision', () => {
			expect(monsterSenseBonusesInstance.find('input#Darkvision').props().value).toEqual(10);
		});

		it('should have the correct number for Tremorsense', () => {
			expect(monsterSenseBonusesInstance.find('input#Tremorsense').props().value).toEqual(15);
		});

		it('should have the correct number for Truesight', () => {
			expect(monsterSenseBonusesInstance.find('input#Truesight').props().value).toEqual(60);
		});

		it('should have the correct number for Passive Perception', () => {
			expect(monsterSenseBonusesInstance.find('input[id="Passive Perception"]').props().value).toEqual(13);
		});

		it('should have the correct number for Passive Investigation', () => {
			expect(monsterSenseBonusesInstance.find('input[id="Passive Investigation"]').props().value).toEqual(14);
		});

		it('should have the correct number for Passive Insight', () => {
			expect(monsterSenseBonusesInstance.find('input[id="Passive Insight"]').props().value).toEqual(16);
		});
	});

	describe('componentWillReceiveProps()', () => {
		beforeEach(() => {
			monsterSenseBonusesInstance =
				mount<MonsterSenseBonuses, IMonsterSenseBonusesProps, IMonsterSenseBonusesState>(
					<MonsterSenseBonuses
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{
							Blind: 30,
							Blindsight: 30,
							Darkvision: 10,
							Tremorsense: 15,
							Truesight: 60,
							"Passive Perception": 13,
							"Passive Investigation": 14,
							"Passive Insight": 16,
						}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterSenseBonusesInstance).toBeDefined();
		});

		it('renders new props', () => {
			monsterSenseBonusesInstance.setProps({
				initial: {
					Blind: 21,
					Blindsight: 56,
					Darkvision: 14,
					Tremorsense: 30,
					Truesight: 50,
					"Passive Perception": 45,
					"Passive Investigation": 67,
					"Passive Insight": 5,
				}
			})
			expect(monsterSenseBonusesInstance.find('input#Blind').props().value).toEqual(21);
			expect(monsterSenseBonusesInstance.find('input#Blindsight').props().value).toEqual(56);
			expect(monsterSenseBonusesInstance.find('input#Darkvision').props().value).toEqual(14);
			expect(monsterSenseBonusesInstance.find('input#Tremorsense').props().value).toEqual(30);
			expect(monsterSenseBonusesInstance.find('input#Truesight').props().value).toEqual(50);
			expect(monsterSenseBonusesInstance.find('input[id="Passive Perception"]').props().value).toEqual(45);
			expect(monsterSenseBonusesInstance.find('input[id="Passive Investigation"]').props().value).toEqual(67);
			expect(monsterSenseBonusesInstance.find('input[id="Passive Insight"]').props().value).toEqual(5);
		});

		it('renders without crashing with same props', () => {
			monsterSenseBonusesInstance.setProps({
				initial: {
					Blind: 30,
					Blindsight: 30,
					Darkvision: 10,
					Tremorsense: 15,
					Truesight: 60,
					"Passive Perception": 13,
					"Passive Investigation": 14,
					"Passive Insight": 16,
				}
			});
			expect(monsterSenseBonusesInstance.find('input#Blind').props().value).toEqual(30);
			expect(monsterSenseBonusesInstance.find('input#Blindsight').props().value).toEqual(30);
			expect(monsterSenseBonusesInstance.find('input#Darkvision').props().value).toEqual(10);
			expect(monsterSenseBonusesInstance.find('input#Tremorsense').props().value).toEqual(15);
			expect(monsterSenseBonusesInstance.find('input#Truesight').props().value).toEqual(60);
			expect(monsterSenseBonusesInstance.find('input[id="Passive Perception"]').props().value).toEqual(13);
			expect(monsterSenseBonusesInstance.find('input[id="Passive Investigation"]').props().value).toEqual(14);
			expect(monsterSenseBonusesInstance.find('input[id="Passive Insight"]').props().value).toEqual(16);
		});

		it('disables input if disable prop changes', () => {
			expect(monsterSenseBonusesInstance.find('input#Blind').props().disabled).toEqual(false);
			expect(monsterSenseBonusesInstance.find('input#Blindsight').props().disabled).toEqual(false);
			expect(monsterSenseBonusesInstance.find('input#Darkvision').props().disabled).toEqual(false);
			expect(monsterSenseBonusesInstance.find('input#Tremorsense').props().disabled).toEqual(false);
			expect(monsterSenseBonusesInstance.find('input#Truesight').props().disabled).toEqual(false);
			expect(monsterSenseBonusesInstance.find('input[id="Passive Perception"]').props().disabled).toEqual(false);
			expect(monsterSenseBonusesInstance.find('input[id="Passive Investigation"]').props().disabled).toEqual(false);
			expect(monsterSenseBonusesInstance.find('input[id="Passive Insight"]').props().disabled).toEqual(false);
			monsterSenseBonusesInstance.setProps({
				disabled: true
			})
			expect(monsterSenseBonusesInstance.find('input#Blind').props().disabled).toEqual(true);
			expect(monsterSenseBonusesInstance.find('input#Blindsight').props().disabled).toEqual(true);
			expect(monsterSenseBonusesInstance.find('input#Darkvision').props().disabled).toEqual(true);
			expect(monsterSenseBonusesInstance.find('input#Tremorsense').props().disabled).toEqual(true);
			expect(monsterSenseBonusesInstance.find('input#Truesight').props().disabled).toEqual(true);
			expect(monsterSenseBonusesInstance.find('input[id="Passive Perception"]').props().disabled).toEqual(true);
			expect(monsterSenseBonusesInstance.find('input[id="Passive Investigation"]').props().disabled).toEqual(true);
			expect(monsterSenseBonusesInstance.find('input[id="Passive Insight"]').props().disabled).toEqual(true);
		});
	});

	describe('Small snapshot', () => {
		it ('matches snapshot', () => {
			const shallowMonsterSenseBonusesInstance =
				shallow<MonsterSenseBonuses, IMonsterSenseBonusesProps, IMonsterSenseBonusesState>(
					<MonsterSenseBonuses
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{}}/>
				);
			expect(shallowMonsterSenseBonusesInstance).toMatchSnapshot();
		});
	});

	describe('Happy Path', () => {

		beforeEach(() => {
			monsterSenseBonusesInstance =
				mount<MonsterSenseBonuses, IMonsterSenseBonusesProps, IMonsterSenseBonusesState>(
					<MonsterSenseBonuses
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterSenseBonusesInstance).toBeDefined();
		});

		it('should be able to update state', () => {
			monsterSenseBonusesInstance.find('input#Blind').simulate('change', { target: { value: 9 } })
			monsterSenseBonusesInstance.find('input#Blindsight').simulate('change', { target: { value: 10 } })
			monsterSenseBonusesInstance.find('input#Darkvision').simulate('change', { target: { value: 8 } })
			monsterSenseBonusesInstance.find('input#Tremorsense').simulate('change', { target: { value: 7 } })
			monsterSenseBonusesInstance.find('input#Truesight').simulate('change', { target: { value: 7 } })
			monsterSenseBonusesInstance.find('input[id="Passive Perception"]').simulate('change', { target: { value: 2 } })
			monsterSenseBonusesInstance.find('input[id="Passive Investigation"]').simulate('change', { target: { value: 14 } })
			monsterSenseBonusesInstance.find('input[id="Passive Insight"]').simulate('change', { target: { value: 30 } })
			expect(monsterSenseBonusesInstance.state()).toEqual({
				// data
				Blind: 9,
				Blindsight: 10,
				Darkvision: 8,
				Tremorsense: 7,
				Truesight: 7,
				"Passive Perception": 2,
				"Passive Investigation": 14,
				"Passive Insight": 30,
				// errors
				BlindError: undefined,
				BlindsightError: undefined,
				DarkvisionError: undefined,
				TremorsenseError: undefined,
				TruesightError: undefined,
				"Passive PerceptionError": undefined,
				"Passive InvestigationError": undefined,
				"Passive InsightError": undefined,
			});
		});
		// STATE CHANGE
		it('should change only Blind when Blind is changed', () => {
			monsterSenseBonusesInstance.find('input#Blind').simulate('change', { target: { value: '9' } })
			expect(monsterSenseBonusesInstance.state().Blind).toEqual(9);
		})

		it('should change only Blindsight when Blindsight is changed', () => {
			monsterSenseBonusesInstance.find('input#Blindsight').simulate('change', { target: { value: '10' } })
			expect(monsterSenseBonusesInstance.state().Blindsight).toEqual(10);
		})

		it('should change only Darkvision when Darkvision is changed', () => {
			monsterSenseBonusesInstance.find('input#Darkvision').simulate('change', { target: { value: '0' } })
			expect(monsterSenseBonusesInstance.state().Darkvision).toEqual(0);
		})

		it('should change only Tremorsense when Tremorsense is changed', () => {
			monsterSenseBonusesInstance.find('input#Tremorsense').simulate('change', { target: { value: '7' } })
			expect(monsterSenseBonusesInstance.state().Tremorsense).toEqual(7);
		})

		it('should change only Truesight when Truesight is changed', () => {
			monsterSenseBonusesInstance.find('input#Truesight').simulate('change', { target: { value: '7' } })
			expect(monsterSenseBonusesInstance.state().Truesight).toEqual(7);
		})

		it('should change only Passive Perception when Passive Perception is changed', () => {
			monsterSenseBonusesInstance.find('input[id="Passive Perception"]').simulate('change', { target: { value: '2' } })
			expect(monsterSenseBonusesInstance.state()['Passive Perception']).toEqual(2);
		})

		it('should change only Passive Investigation when Passive Investigation is changed', () => {
			monsterSenseBonusesInstance.find('input[id="Passive Investigation"]').simulate('change', { target: { value: '14' } })
			expect(monsterSenseBonusesInstance.state()['Passive Investigation']).toEqual(14);
		})

		it('should change only Passive Insight when Passive Insight is changed', () => {
			monsterSenseBonusesInstance.find('input[id="Passive Insight"]').simulate('change', { target: { value: '20' } })
			expect(monsterSenseBonusesInstance.state()['Passive Insight']).toEqual(20);
		})

		// DEFAULTS
		it('should change Blind back to undefined when input is empty', () => {
			monsterSenseBonusesInstance.find('input#Blind').simulate('change', { target: { value: '' } })
			expect(monsterSenseBonusesInstance.state().Blind).toEqual(undefined);
		})

		it('should change Blindsight back to undefined when input is empty', () => {
			monsterSenseBonusesInstance.find('input#Blindsight').simulate('change', { target: { value: '' } })
			expect(monsterSenseBonusesInstance.state().Blindsight).toEqual(undefined);
		})

		it('should change Darkvision back to undefined when input is empty', () => {
			monsterSenseBonusesInstance.find('input#Darkvision').simulate('change', { target: { value: '' } })
			expect(monsterSenseBonusesInstance.state().Darkvision).toEqual(undefined);
		})

		it('should change Tremorsense back to undefined when input is empty', () => {
			monsterSenseBonusesInstance.find('input#Tremorsense').simulate('change', { target: { value: '' } })
			expect(monsterSenseBonusesInstance.state().Tremorsense).toEqual(undefined);
		})

		it('should change Passive Perception back to undefined when input is empty', () => {
			monsterSenseBonusesInstance.find('input[id="Passive Perception"]').simulate('change', { target: { value: '' } })
			expect(monsterSenseBonusesInstance.state()['Passive Perception']).toEqual(undefined);
		})

		it('should change Passive Investigation back to undefined when input is empty', () => {
			monsterSenseBonusesInstance.find('input[id="Passive Investigation"]').simulate('change', { target: { value: '' } })
			expect(monsterSenseBonusesInstance.state()['Passive Investigation']).toEqual(undefined);
		})

		it('should change Passive Insight back to undefined when input is empty', () => {
			monsterSenseBonusesInstance.find('input[id="Passive Insight"]').simulate('change', { target: { value: '' } })
			expect(monsterSenseBonusesInstance.state()['Passive Insight']).toEqual(undefined);
		})

		// VALIDATION
		it('should validate Blind when Blind is changed', () => {
			monsterSenseBonusesInstance.find('input#Blind').simulate('change', { target: { value: '-12'  } })
			expect(monsterSenseBonusesInstance.state().Blind).toEqual(-12);
			expect(monsterSenseBonusesInstance.find('FormHelperText#Blind-helper-text').text()).toEqual('\"Blind\" must be greater than 0');
		})

		it('should validate Blindsight when Blindsight is changed', () => {
			monsterSenseBonusesInstance.find('input#Blindsight').simulate('change', { target: { value: '-102'  } })
			expect(monsterSenseBonusesInstance.state().Blindsight).toEqual(-102);
			expect(monsterSenseBonusesInstance.find('FormHelperText#Blindsight-helper-text').text()).toEqual('\"Blindsight\" must be greater than 0');
		})

		it('should validate Darkvision when Darkvision is changed', () => {
			monsterSenseBonusesInstance.find('input#Darkvision').simulate('change', { target: { value: '-1'  } })
			expect(monsterSenseBonusesInstance.state().Darkvision).toEqual(-1);
			expect(monsterSenseBonusesInstance.find('FormHelperText#Darkvision-helper-text').text()).toEqual('\"Darkvision\" must be greater than 0');
		})

		it('should validate Tremorsense when Tremorsense is changed', () => {
			monsterSenseBonusesInstance.find('input#Tremorsense').simulate('change', { target: { value: '-9'  } })
			expect(monsterSenseBonusesInstance.state().Tremorsense).toEqual(-9);
			expect(monsterSenseBonusesInstance.find('FormHelperText#Tremorsense-helper-text').text()).toEqual('\"Tremorsense\" must be greater than 0');
		})

		it('should validate Truesight when Truesight is changed', () => {
			monsterSenseBonusesInstance.find('input#Truesight').simulate('change', { target: { value: '-12'  } })
			expect(monsterSenseBonusesInstance.state().Truesight).toEqual(-12);
			expect(monsterSenseBonusesInstance.find('FormHelperText#Truesight-helper-text').text()).toEqual('\"Truesight\" must be greater than 0');
		})

		it('should validate Passive Perception when Passive Perception is changed', () => {
			monsterSenseBonusesInstance.find('input[id="Passive Perception"]').simulate('change', { target: { value: '-16'  } })
			expect(monsterSenseBonusesInstance.state()["Passive Perception"]).toEqual(-16);
			expect(monsterSenseBonusesInstance.find('FormHelperText[id="Passive Perception-helper-text"]').text()).toEqual('\"Passive Perception\" must be greater than 0');
		})

		it('should validate Passive Investigation when Passive Investigation is changed', () => {
			monsterSenseBonusesInstance.find('input[id="Passive Investigation"]').simulate('change', { target: { value: '-6'  } })
			expect(monsterSenseBonusesInstance.state()["Passive Investigation"]).toEqual(-6);
			expect(monsterSenseBonusesInstance.find('FormHelperText[id="Passive Investigation-helper-text"]').text()).toEqual('\"Passive Investigation\" must be greater than 0');
		})

		it('should validate Passive Insight when Passive Insight is changed', () => {
			monsterSenseBonusesInstance.find('input[id="Passive Insight"]').simulate('change', { target: { value: '-1'  } })
			expect(monsterSenseBonusesInstance.state()["Passive Insight"]).toEqual(-1);
			expect(monsterSenseBonusesInstance.find('FormHelperText[id="Passive Insight-helper-text"]').text()).toEqual('\"Passive Insight\" must be greater than 0');
		})
	});
});