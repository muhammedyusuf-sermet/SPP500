import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';

import { IMonsterSpeedBonusesProps, IMonsterSpeedBonusesState, MonsterSpeedBonuses } from '../../src/renderer/components/platform/pages/view_catalog/monster/MonsterSpeedBonuses';
// TODO: test for validation when the speed component actually uses it.
//const Joi = require('joi');
//import { ValidationOptions } from 'joi';

/*const payloadSchema = Joi.object({
	Speed: Joi.object().pattern(
		Joi.symbol().valid(["SpeedLand", "SpeedSwim"]),
		Joi.number().integer().greater(0).allow(0)
	).default({})
});
const validateOptions: ValidationOptions = {
	abortEarly: false,
	convert: true,
	allowUnknown: false,
	context: {

	}
};*/

////// Happy Path //////
describe('Monster SpeedBonuses', () => {

	let monsterSpeedBonusesInstance: ReactWrapper<IMonsterSpeedBonusesProps, IMonsterSpeedBonusesState, MonsterSpeedBonuses>;

	describe('Provided Stat values', () => {

		beforeEach(() => {
			monsterSpeedBonusesInstance =
				mount<MonsterSpeedBonuses, IMonsterSpeedBonusesProps, IMonsterSpeedBonusesState>(
					<MonsterSpeedBonuses
						disabled={false}
						//PayloadSchema={payloadSchema}
						//ValidationOptions={validateOptions}
						initial={{
							"SpeedLand": 20,
							"SpeedSwim": 40,
						}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterSpeedBonusesInstance).toBeDefined();
		});

		it('should have the correct number for SpeedLand', () => {
			expect(monsterSpeedBonusesInstance.find('Input#SpeedLand').props().value).toEqual(20);
		});

		it('should have the correct number for SpeedSwim', () => {
			expect(monsterSpeedBonusesInstance.find('Input#SpeedSwim').props().value).toEqual(40);
		});
	});

	describe('Happy Path', () => {

		beforeEach(() => {
			monsterSpeedBonusesInstance =
				mount<MonsterSpeedBonuses, IMonsterSpeedBonusesProps, IMonsterSpeedBonusesState>(
					<MonsterSpeedBonuses
						disabled={false}
						//PayloadSchema={payloadSchema}
						//ValidationOptions={validateOptions}
						initial={{}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterSpeedBonusesInstance).toBeDefined();
		});

		it('should be able to update state', () => {
			monsterSpeedBonusesInstance.find('Input#SpeedLand').simulate('change', { target: { value: 30 } })
			monsterSpeedBonusesInstance.find('Input#SpeedSwim').simulate('change', { target: { value: 45 } })
			expect(monsterSpeedBonusesInstance.state()).toEqual({
				// data
				SpeedLand: 30,
				SpeedSwim: 45,
				// errors
				SpeedLandError: undefined,
				SpeedSwimError: undefined,
			});
		});
		// STATE CHANGE
		it('should change only SpeedLand when SpeedLand is changed', () => {
			monsterSpeedBonusesInstance.find('Input#SpeedLand').simulate('change', { target: { value: '15' } })
			expect(monsterSpeedBonusesInstance.state().SpeedLand).toEqual(15);
		})

		it('should change only SpeedSwim when SpeedSwim is changed', () => {
			monsterSpeedBonusesInstance.find('Input#SpeedSwim').simulate('change', { target: { value: '25' } })
			expect(monsterSpeedBonusesInstance.state().SpeedSwim).toEqual(25);
		})

		// DEFAULTS
		it('should change SpeedLand back to undefined when input is empty', () => {
			monsterSpeedBonusesInstance.find('Input#SpeedLand').simulate('change', { target: { value: '' } })
			expect(monsterSpeedBonusesInstance.state().SpeedLand).toEqual(undefined);
		})

		it('should change SpeedSwim back to undefined when input is empty', () => {
			monsterSpeedBonusesInstance.find('Input#SpeedSwim').simulate('change', { target: { value: '' } })
			expect(monsterSpeedBonusesInstance.state().SpeedSwim).toEqual(undefined);
		})

		// TODO: test validation when its actually implemented
		// VALIDATION
		/*it('should validate SpeedLand when SpeedLand is changed', () => {
			monsterSpeedBonusesInstance.find('Input#SpeedLand').simulate('change', { target: { value: '-1'  } })
			expect(monsterSpeedBonusesInstance.state().SpeedLand).toEqual(-1);
			expect(monsterSpeedBonusesInstance.find('Help#SpeedLand').text()).toEqual('\"SpeedLand\" must be greater than 0');
		})

		it('should validate SpeedSwim when SpeedSwim is changed', () => {
			monsterSpeedBonusesInstance.find('Input#SpeedSwim').simulate('change', { target: { value: '-9'  } })
			expect(monsterSpeedBonusesInstance.state().SpeedSwim).toEqual(-9);
			expect(monsterSpeedBonusesInstance.find('Help#SpeedSwim').text()).toEqual('\"SpeedSwim\" must be greater than 0');
		})*/
	});
});