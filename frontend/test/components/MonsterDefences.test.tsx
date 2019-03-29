import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';

import { IMonsterDefencesProps, IMonsterDefencesState, MonsterDefences } from '../../src/renderer/components/platform/pages/view_catalog/monster/MonsterDefences';
const Joi = require('joi');
import { ValidationOptions } from 'joi';

const payloadSchema = Joi.object({
	ArmorClass: Joi.number().integer().greater(0).label('ArmorClass'),
	HitPoints: Joi.number().integer().greater(0).label('HitPoints'),
	// (rolls 'd' dice [+ - * /] operation) one or more times then rolls 'd' dice
	HitPointDistribution: Joi.string().max(20).regex(/^((\d+d\d+)[\+\-\*\/])*(\d+d\d+)([\+\-\*\/]\d+)?$/, '#d# OR (#d# operator (#d# or number)) NO spaces').label('HitPointDistribution'),
});
const validateOptions: ValidationOptions = {
	abortEarly: false,
	convert: true,
	allowUnknown: false,
	context: {

	}
};

////// Happy Path //////
describe('Monster Defences', () => {

	let monsterDefencesInstance: ReactWrapper<IMonsterDefencesProps, IMonsterDefencesState, MonsterDefences>;

	describe('Provided Resistance values', () => {

		beforeEach(() => {
			monsterDefencesInstance =
				mount<MonsterDefences, IMonsterDefencesProps, IMonsterDefencesState>(
					<MonsterDefences
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{
							ArmorClass: 124,
							HitPoints: 623,
							HitPointDistribution: '5d12+34'
						}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterDefencesInstance).toBeDefined();
		});

		it('should have the correct number for ArmorClass', () => {
			expect(monsterDefencesInstance.find('Input#ArmorClass').props().value).toEqual(124);
		});

		it('should have the correct number for HitPoints', () => {
			expect(monsterDefencesInstance.find('Input#HitPoints').props().value).toEqual(623);
		});

		it('should have the correct string for HitPointDistribution', () => {
			expect(monsterDefencesInstance.find('Input#HitPointDistribution').props().value).toEqual('5d12+34');
		});
	});

	describe('Happy Path', () => {

		beforeEach(() => {
			monsterDefencesInstance =
				mount<MonsterDefences, IMonsterDefencesProps, IMonsterDefencesState>(
					<MonsterDefences
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{}}/>
				);
		})

		it('renders without crashing', () => {
			expect(monsterDefencesInstance).toBeDefined();
		});

		it('should be able to update state', () => {
			monsterDefencesInstance.find('Input#ArmorClass').simulate('change', { target: { value: '43' } })
			monsterDefencesInstance.find('Input#HitPoints').simulate('change', { target: { value: '564' } })
			monsterDefencesInstance.find('Input#HitPointDistribution').simulate('change', { target: { value: '3d6+92' } })
			expect(monsterDefencesInstance.state()).toEqual({
				// data
				ArmorClass: 43,
				HitPoints: 564,
				HitPointDistribution: '3d6+92',
				// errors
				ArmorClassError: undefined,
				HitPointsError: undefined,
				HitPointDistributionError: undefined,
			});
		});
		// STATE CHANGE
		it('should change only ArmorClass when ArmorClass is changed', () => {
			monsterDefencesInstance.find('Input#ArmorClass').simulate('change', { target: { value: '958' } })
			expect(monsterDefencesInstance.state().ArmorClass).toEqual(958);
		})

		it('should change only HitPoints when HitPoints is changed', () => {
			monsterDefencesInstance.find('Input#HitPoints').simulate('change', { target: { value: '372' } })
			expect(monsterDefencesInstance.state().HitPoints).toEqual(372);
		})

		it('should change only HitPointDistribution when HitPointDistribution is changed', () => {
			monsterDefencesInstance.find('Input#HitPointDistribution').simulate('change', { target: { value: '2d8+73' } })
			expect(monsterDefencesInstance.state().HitPointDistribution).toEqual('2d8+73');
		})
		// DEFAULTS
		it('should change Type back to undefined when input is empty', () => {
			monsterDefencesInstance.find('Input#ArmorClass').simulate('change', { target: { value: '' } })
			expect(monsterDefencesInstance.state().ArmorClass).toEqual(undefined);
		})

		it('should change Alignment back to undefined when input is empty', () => {
			monsterDefencesInstance.find('Input#HitPoints').simulate('change', { target: { value: '' } })
			expect(monsterDefencesInstance.state().HitPoints).toEqual(undefined);
		})

		it('should change Size back to undefined when input is empty', () => {
			monsterDefencesInstance.find('Input#HitPointDistribution').simulate('change', { target: { value: '' } })
			expect(monsterDefencesInstance.state().HitPointDistribution).toEqual(undefined);
		})
		// VALIDATION
		const moreThan20: string = "1000d1000+1000d1000+1000d1000"

		it('should validate ArmorClass when ArmorClass is changed', () => {
			monsterDefencesInstance.find('Input#ArmorClass').simulate('change', { target: { value: '-12'  } })
			expect(monsterDefencesInstance.state().ArmorClass).toEqual(-12);
			expect(monsterDefencesInstance.find('Help#ArmorClass').text()).toEqual('\"ArmorClass\" must be greater than 0');
		})

		it('should validate HitPoints when HitPoints is changed', () => {
			monsterDefencesInstance.find('Input#HitPoints').simulate('change', { target: { value: '-23' } })
			expect(monsterDefencesInstance.state().HitPoints).toEqual(-23);
			expect(monsterDefencesInstance.find('Help#HitPoints').text()).toEqual('\"HitPoints\" must be greater than 0');
		})

		it('should validate HitPointDistribution when HitPointDistribution is changed length', () => {
			monsterDefencesInstance.find('Input#HitPointDistribution').simulate('change', { target: { value: moreThan20 } })
			expect(monsterDefencesInstance.state().HitPointDistribution).toEqual(moreThan20);
			expect(monsterDefencesInstance.find('Help#HitPointDistribution').text()).toEqual('\"HitPointDistribution\" length must be less than or equal to 20 characters long');
		})

		it('should validate HitPointDistribution when HitPointDistribution is changed pattern', () => {
			monsterDefencesInstance.find('Input#HitPointDistribution').simulate('change', { target: { value: 'InvalidPattern' } })
			expect(monsterDefencesInstance.state().HitPointDistribution).toEqual('InvalidPattern');
			expect(monsterDefencesInstance.find('Help#HitPointDistribution').text()).toEqual('\"HitPointDistribution\" with value \"InvalidPattern\" fails to match the #d# OR (#d# operator (#d# or number)) NO spaces pattern');
		})
	});
});