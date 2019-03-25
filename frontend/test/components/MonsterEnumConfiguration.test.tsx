import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';

import { MonsterType, Alignment, Size, MonsterRace, Environment } from "../../src/monster";
import { IMonsterEnumConfigurationProps, IMonsterEnumConfigurationState, MonsterEnumConfiguration } from '../../src/renderer/components/platform/pages/view_catalog/monster/MonsterEnumConfiguration';
const Joi = require('joi');
import { ValidationOptions } from 'joi';

const payloadSchema = Joi.object({
	Size: Joi.string().valid(Joi.ref('$SizeOptions')),
	Type: Joi.string().valid(Joi.ref('$TypeOptions')),
	Race: Joi.string().valid(Joi.ref('$RaceOptions')),
	Alignment: Joi.string().valid(Joi.ref('$AlignmentOptions')),
	Environment: Joi.string().valid(Joi.ref('$EnvironmentOptions')),
});
const validateOptions: ValidationOptions = {
	abortEarly: false,
	convert: true,
	allowUnknown: false,
	context: {
		SizeOptions: Object.keys(Size),
		TypeOptions: Object.keys(MonsterType),
		RaceOptions: Object.keys(MonsterRace),
		AlignmentOptions: Object.keys(Alignment),
		EnvironmentOptions: Object.keys(Environment)
	}
};

////// Happy Path //////
describe('Monster Creation', () => {

	let monsterEnumConfigurationInstance: ReactWrapper<IMonsterEnumConfigurationProps, IMonsterEnumConfigurationState, MonsterEnumConfiguration>;

	describe('Provided Enum Configuration values', () => {

		beforeEach(() => {
			monsterEnumConfigurationInstance =
				mount<MonsterEnumConfiguration, IMonsterEnumConfigurationProps, IMonsterEnumConfigurationState>(
					<MonsterEnumConfiguration
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						Size={Size.Gargantuan}
						Type={MonsterType.Elemental}
						Race={MonsterRace.Dwarf}
						Alignment={Alignment.AnyEvilAlignment}
						Environment={Environment.Coastal}/>
				);
		})

		it('renders without crashing', () => {
			expect(monsterEnumConfigurationInstance).toBeDefined();
		});

		it('should have the selected Type', () => {
			expect(monsterEnumConfigurationInstance.find('select#Type').props().value).toEqual('Elemental');
		});

		it('should have the selected Size', () => {
			expect(monsterEnumConfigurationInstance.find('select#Size').props().value).toEqual('Gargantuan');
		});

		it('should have the selected Race', () => {
			expect(monsterEnumConfigurationInstance.find('select#Race').props().value).toEqual('Dwarf');
		});

		it('should have the selected Environment', () => {
			expect(monsterEnumConfigurationInstance.find('select#Environment').props().value).toEqual('Coastal');
		});

		it('should have the selected Alignment', () => {
			expect(monsterEnumConfigurationInstance.find('select#Alignment').props().value).toEqual('AnyEvilAlignment');
		});
	});

	describe('Happy Path', () => {

		beforeEach(() => {
			monsterEnumConfigurationInstance =
				mount<MonsterEnumConfiguration, IMonsterEnumConfigurationProps, IMonsterEnumConfigurationState>(
					<MonsterEnumConfiguration
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}/>
				);
		})

		it('renders without crashing', () => {
			expect(monsterEnumConfigurationInstance).toBeDefined();
		});

		it('should be able to update state', () => {
			monsterEnumConfigurationInstance.find('select#Type').simulate('change', { target: { value: "Celestial" } })
			monsterEnumConfigurationInstance.find('select#Size').simulate('change', { target: { value: "Gargantuan" } })
			monsterEnumConfigurationInstance.find('select#Race').simulate('change', { target: { value: "Devil" } })
			monsterEnumConfigurationInstance.find('select#Environment').simulate('change', { target: { value: "Underdark" } })
			monsterEnumConfigurationInstance.find('select#Alignment').simulate('change', { target: { value: "AnyGoodAlignment" } })
			expect(monsterEnumConfigurationInstance.state()).toEqual({
				// data
				Size: 'Gargantuan',
				Type: 'Celestial',
				Race: 'Devil',
				Alignment: 'AnyGoodAlignment',
				Environment: 'Underdark',
				// errors
				SizeError: undefined,
				TypeError: undefined,
				RaceError: undefined,
				AlignmentError: undefined,
				EnvironmentError: undefined
			});
		});
		// STATE CHANGE
		it('should change only types when type is changed', () => {
			monsterEnumConfigurationInstance.find('select#Type').simulate('change', { target: { value: "Undead" } })
			expect(monsterEnumConfigurationInstance.state().Type).toEqual(MonsterType.Undead);
		})

		it('should change only alignment when alignment is changed', () => {
			monsterEnumConfigurationInstance.find('select#Alignment').simulate('change', { target: { value: "AnyNonEvilAlignment" } })
			expect(monsterEnumConfigurationInstance.state().Alignment).toEqual(Alignment.AnyNonEvilAlignment);
		})

		it('should change only size when size is changed', () => {
			monsterEnumConfigurationInstance.find('select#Size').simulate('change', { target: { value: "Large" } })
			expect(monsterEnumConfigurationInstance.state().Size).toEqual(Size.Large);
		})

		it('should change only races when race is changed', () => {
			monsterEnumConfigurationInstance.find('select#Race').simulate('change', { target: { value: "Goblinoid" } })
			expect(monsterEnumConfigurationInstance.state().Race).toEqual(MonsterRace.Goblinoid);
		})

		it('should change only environments when environment is changed', () => {
			monsterEnumConfigurationInstance.find('select#Environment').simulate('change', { target: { value: "Coastal" } })
			expect(monsterEnumConfigurationInstance.state().Environment).toEqual(Environment.Coastal);
		})
		// DEFAULTS
		it('should change Type back to undefined when Default', () => {
			monsterEnumConfigurationInstance.find('select#Type').simulate('change', { target: { value: "Default" } })
			expect(monsterEnumConfigurationInstance.state().Type).toEqual(undefined);
		})

		it('should change Alignment back to undefined when Default', () => {
			monsterEnumConfigurationInstance.find('select#Alignment').simulate('change', { target: { value: "Default" } })
			expect(monsterEnumConfigurationInstance.state().Alignment).toEqual(undefined);
		})

		it('should change Size back to undefined when Default', () => {
			monsterEnumConfigurationInstance.find('select#Size').simulate('change', { target: { value: "Default" } })
			expect(monsterEnumConfigurationInstance.state().Size).toEqual(undefined);
		})

		it('should change Race back to undefined when Default', () => {
			monsterEnumConfigurationInstance.find('select#Race').simulate('change', { target: { value: "Default" } })
			expect(monsterEnumConfigurationInstance.state().Race).toEqual(undefined);
		})

		it('should change Environment back to undefined when Default', () => {
			monsterEnumConfigurationInstance.find('select#Environment').simulate('change', { target: { value: "Default" } })
			expect(monsterEnumConfigurationInstance.state().Environment).toEqual(undefined);
		})
		// VALIDATION
		it('should validate types when type is changed', () => {
			monsterEnumConfigurationInstance.find('select#Type').simulate('change', { target: { value: "Invalid" } })
			expect(monsterEnumConfigurationInstance.state().Type).toEqual(undefined);
			expect(monsterEnumConfigurationInstance.state().TypeError).toEqual('\"value\" must be one of [context:TypeOptions]');
		})

		it('should validate alignment when alignment is changed', () => {
			monsterEnumConfigurationInstance.find('select#Alignment').simulate('change', { target: { value: "Invalid" } })
			expect(monsterEnumConfigurationInstance.state().Alignment).toEqual(undefined);
			expect(monsterEnumConfigurationInstance.state().AlignmentError).toEqual('\"value\" must be one of [context:AlignmentOptions]');
		})

		it('should validate size when size is changed', () => {
			monsterEnumConfigurationInstance.find('select#Size').simulate('change', { target: { value: "Invalid" } })
			expect(monsterEnumConfigurationInstance.state().Size).toEqual(undefined);
			expect(monsterEnumConfigurationInstance.state().SizeError).toEqual('\"value\" must be one of [context:SizeOptions]');
		})

		it('should validate races when race is changed', () => {
			monsterEnumConfigurationInstance.find('select#Race').simulate('change', { target: { value: "Invalid" } })
			expect(monsterEnumConfigurationInstance.state().Race).toEqual(undefined);
			expect(monsterEnumConfigurationInstance.state().RaceError).toEqual('\"value\" must be one of [context:RaceOptions]');
		})

		it('should validate environments when environment is changed', () => {
			monsterEnumConfigurationInstance.find('select#Environment').simulate('change', { target: { value: "Invalid" } })
			expect(monsterEnumConfigurationInstance.state().Environment).toEqual(undefined);
			expect(monsterEnumConfigurationInstance.state().EnvironmentError).toEqual('\"value\" must be one of [context:EnvironmentOptions]');
		})
	});
});