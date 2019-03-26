import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';

import { IMonsterResistancesProps, IMonsterResistancesState, MonsterResistances } from '../../src/renderer/components/platform/pages/view_catalog/monster/MonsterResistances';
const Joi = require('joi');
import { ValidationOptions } from 'joi';

const payloadSchema = Joi.object({
	DamageVulnerabilities: Joi.string().allow('').max(200).label('DamageVulnerabilities'),
	DamageResistances: Joi.string().allow('').max(200).label('DamageResistances'),
	DamageImmunities: Joi.string().allow('').max(200).label('DamageImmunities'),
	ConditionImmunities: Joi.string().allow('').max(200).label('ConditionImmunities'),
});
const validateOptions: ValidationOptions = {
	abortEarly: false,
	convert: true,
	allowUnknown: false,
	context: {

	}
};

////// Happy Path //////
describe('Monster Resistances', () => {

	let monsterResistancesInstance: ReactWrapper<IMonsterResistancesProps, IMonsterResistancesState, MonsterResistances>;

	describe('Provided Resistance values', () => {

		beforeEach(() => {
			monsterResistancesInstance =
				mount<MonsterResistances, IMonsterResistancesProps, IMonsterResistancesState>(
					<MonsterResistances
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						DamageResistances={'This is test damage resistance'}
						DamageImmunities={'This is test damage immunity'}
						DamageVulnerabilities={'This is test damage vulnerabilities'}
						ConditionImmunities={'This is test condition immunities'} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterResistancesInstance).toBeDefined();
		});

		it('should have the correct string for DamageResistances', () => {
			expect(monsterResistancesInstance.find('Input#DamageResistances').props().value).toEqual('This is test damage resistance');
		});

		it('should have the correct string for DamageImmunities', () => {
			expect(monsterResistancesInstance.find('Input#DamageImmunities').props().value).toEqual('This is test damage immunity');
		});

		it('should have the correct string for DamageVulnerabilities', () => {
			expect(monsterResistancesInstance.find('Input#DamageVulnerabilities').props().value).toEqual('This is test damage vulnerabilities');
		});

		it('should have the correct string for ConditionImmunities', () => {
			expect(monsterResistancesInstance.find('Input#ConditionImmunities').props().value).toEqual('This is test condition immunities');
		});
	});

	describe('Happy Path', () => {

		beforeEach(() => {
			monsterResistancesInstance =
				mount<MonsterResistances, IMonsterResistancesProps, IMonsterResistancesState>(
					<MonsterResistances
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}/>
				);
		})

		it('renders without crashing', () => {
			expect(monsterResistancesInstance).toBeDefined();
		});

		it('should be able to update state', () => {
			monsterResistancesInstance.find('Input#DamageVulnerabilities').simulate('change', { target: { value: 'Everything' } })
			monsterResistancesInstance.find('Input#DamageResistances').simulate('change', { target: { value: 'None at all' } })
			monsterResistancesInstance.find('Input#DamageImmunities').simulate('change', { target: { value: 'Nada' } })
			monsterResistancesInstance.find('Input#ConditionImmunities').simulate('change', { target: { value: 'Nothing' } })
			expect(monsterResistancesInstance.state()).toEqual({
				// data
				DamageVulnerabilities: 'Everything',
				DamageResistances: 'None at all',
				DamageImmunities: 'Nada',
				ConditionImmunities: 'Nothing',
				// errors
				DamageVulnerabilitiesError: undefined,
				DamageResistancesError: undefined,
				DamageImmunitiesError: undefined,
				ConditionImmunitiesError: undefined
			});
		});
		// STATE CHANGE
		it('should change only DamageVulnerabilities when DamageVulnerabilities is changed', () => {
			monsterResistancesInstance.find('Input#DamageVulnerabilities').simulate('change', { target: { value: 'Everything' } })
			expect(monsterResistancesInstance.state().DamageVulnerabilities).toEqual('Everything');
		})

		it('should change only DamageResistances when DamageResistances is changed', () => {
			monsterResistancesInstance.find('Input#DamageResistances').simulate('change', { target: { value: 'None at all' } })
			expect(monsterResistancesInstance.state().DamageResistances).toEqual('None at all');
		})

		it('should change only DamageImmunities when DamageImmunities is changed', () => {
			monsterResistancesInstance.find('Input#DamageImmunities').simulate('change', { target: { value: 'Nada' } })
			expect(monsterResistancesInstance.state().DamageImmunities).toEqual('Nada');
		})

		it('should change only ConditionImmunities when ConditionImmunities is changed', () => {
			monsterResistancesInstance.find('Input#ConditionImmunities').simulate('change', { target: { value: 'Nothing' } })
			expect(monsterResistancesInstance.state().ConditionImmunities).toEqual('Nothing');
		})
		// DEFAULTS
		it('should change Type back to undefined when input is empty', () => {
			monsterResistancesInstance.find('Input#DamageVulnerabilities').simulate('change', { target: { value: '' } })
			expect(monsterResistancesInstance.state().DamageVulnerabilities).toEqual(undefined);
		})

		it('should change Alignment back to undefined when input is empty', () => {
			monsterResistancesInstance.find('Input#DamageResistances').simulate('change', { target: { value: '' } })
			expect(monsterResistancesInstance.state().DamageResistances).toEqual(undefined);
		})

		it('should change Size back to undefined when input is empty', () => {
			monsterResistancesInstance.find('Input#DamageImmunities').simulate('change', { target: { value: '' } })
			expect(monsterResistancesInstance.state().DamageImmunities).toEqual(undefined);
		})

		it('should change Race back to undefined when input is empty', () => {
			monsterResistancesInstance.find('Input#ConditionImmunities').simulate('change', { target: { value: '' } })
			expect(monsterResistancesInstance.state().ConditionImmunities).toEqual(undefined);
		})
		// VALIDATION
		const moreThan200: string = "More than 200 chars\
			01234567890123456789012345678901234567890123456789\
			01234567890123456789012345678901234567890123456789\
			01234567890123456789012345678901234567890123456789\
			01234567890123456789012345678901234567890123456789"

		it('should validate DamageVulnerabilities when DamageVulnerabilities is changed', () => {
			monsterResistancesInstance.find('Input#DamageVulnerabilities').simulate('change', { target: { value: moreThan200  } })
			expect(monsterResistancesInstance.state().DamageVulnerabilities).toEqual(moreThan200);
			expect(monsterResistancesInstance.find('Help#DamageVulnerabilities').text()).toEqual('\"DamageVulnerabilities\" length must be less than or equal to 200 characters long');
		})

		it('should validate DamageResistances when DamageResistances is changed', () => {
			monsterResistancesInstance.find('Input#DamageResistances').simulate('change', { target: { value: moreThan200 } })
			expect(monsterResistancesInstance.state().DamageResistances).toEqual(moreThan200);
			expect(monsterResistancesInstance.find('Help#DamageResistances').text()).toEqual('\"DamageResistances\" length must be less than or equal to 200 characters long');
		})

		it('should validate DamageImmunities when DamageImmunities is changed', () => {
			monsterResistancesInstance.find('Input#DamageImmunities').simulate('change', { target: { value: moreThan200 } })
			expect(monsterResistancesInstance.state().DamageImmunities).toEqual(moreThan200);
			expect(monsterResistancesInstance.find('Help#DamageImmunities').text()).toEqual('\"DamageImmunities\" length must be less than or equal to 200 characters long');
		})

		it('should validate ConditionImmunities when ConditionImmunities is changed', () => {
			monsterResistancesInstance.find('Input#ConditionImmunities').simulate('change', { target: { value: moreThan200 } })
			expect(monsterResistancesInstance.state().ConditionImmunities).toEqual(moreThan200);
			expect(monsterResistancesInstance.find('Help#ConditionImmunities').text()).toEqual('\"ConditionImmunities\" length must be less than or equal to 200 characters long');
		})
	});
});