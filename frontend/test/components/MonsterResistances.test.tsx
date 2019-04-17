import * as React from 'react';
import { mount, ReactWrapper, shallow } from 'enzyme';

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
						initial={{
							DamageResistances: 'This is test damage resistance',
							DamageImmunities: 'This is test damage immunity',
							DamageVulnerabilities: 'This is test damage vulnerabilities',
							ConditionImmunities: 'This is test condition immunities'
						}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterResistancesInstance).toBeDefined();
		});

		it('should have the correct string for DamageResistances', () => {
			expect(monsterResistancesInstance.find('input#DamageResistances').props().value).toEqual('This is test damage resistance');
		});

		it('should have the correct string for DamageImmunities', () => {
			expect(monsterResistancesInstance.find('input#DamageImmunities').props().value).toEqual('This is test damage immunity');
		});

		it('should have the correct string for DamageVulnerabilities', () => {
			expect(monsterResistancesInstance.find('input#DamageVulnerabilities').props().value).toEqual('This is test damage vulnerabilities');
		});

		it('should have the correct string for ConditionImmunities', () => {
			expect(monsterResistancesInstance.find('input#ConditionImmunities').props().value).toEqual('This is test condition immunities');
		});
	});

	describe('componentWillReceiveProps()', () => {
		beforeEach(() => {
			monsterResistancesInstance =
				mount<MonsterResistances, IMonsterResistancesProps, IMonsterResistancesState>(
					<MonsterResistances
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{
							DamageResistances: 'This is test damage resistance',
							DamageImmunities: 'This is test damage immunity',
							DamageVulnerabilities: 'This is test damage vulnerabilities',
							ConditionImmunities: 'This is test condition immunities'
						}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterResistancesInstance).toBeDefined();
		});

		it('renders new props', () => {
			monsterResistancesInstance.setProps({
				initial: {
					DamageResistances: 'This is test new damage resistance',
					DamageImmunities: 'This is test new damage immunity',
					DamageVulnerabilities: 'This is test new damage vulnerabilities',
					ConditionImmunities: 'This is test new condition immunities'
				}
			})
			expect(monsterResistancesInstance.find('input#DamageResistances').props().value).toEqual('This is test new damage resistance');
			expect(monsterResistancesInstance.find('input#DamageImmunities').props().value).toEqual('This is test new damage immunity');
			expect(monsterResistancesInstance.find('input#DamageVulnerabilities').props().value).toEqual('This is test new damage vulnerabilities');
			expect(monsterResistancesInstance.find('input#ConditionImmunities').props().value).toEqual('This is test new condition immunities');
		});

		it('renders without crashing with same props', () => {
			monsterResistancesInstance.setProps({
				initial: {
					DamageResistances: 'This is test damage resistance',
					DamageImmunities: 'This is test damage immunity',
					DamageVulnerabilities: 'This is test damage vulnerabilities',
					ConditionImmunities: 'This is test condition immunities'
				}
			});
			expect(monsterResistancesInstance.find('input#DamageResistances').props().value).toEqual('This is test damage resistance');
			expect(monsterResistancesInstance.find('input#DamageImmunities').props().value).toEqual('This is test damage immunity');
			expect(monsterResistancesInstance.find('input#DamageVulnerabilities').props().value).toEqual('This is test damage vulnerabilities');
			expect(monsterResistancesInstance.find('input#ConditionImmunities').props().value).toEqual('This is test condition immunities');
		});
	});

	describe('Small snapshot', () => {
		it ('matches snapshot', () => {
			const shallowMonsterResistancesInstance =
				shallow<MonsterResistances, IMonsterResistancesProps, IMonsterResistancesState>(
					<MonsterResistances
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{}}/>
				);
			expect(shallowMonsterResistancesInstance).toMatchSnapshot();
		});
	});

	describe('Happy Path', () => {

		beforeEach(() => {
			monsterResistancesInstance =
				mount<MonsterResistances, IMonsterResistancesProps, IMonsterResistancesState>(
					<MonsterResistances
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterResistancesInstance).toBeDefined();
		});

		it('should be able to update state', () => {
			monsterResistancesInstance.find('input#DamageVulnerabilities').simulate('change', { target: { value: 'Everything' } })
			monsterResistancesInstance.find('input#DamageResistances').simulate('change', { target: { value: 'None at all' } })
			monsterResistancesInstance.find('input#DamageImmunities').simulate('change', { target: { value: 'Nada' } })
			monsterResistancesInstance.find('input#ConditionImmunities').simulate('change', { target: { value: 'Nothing' } })
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
			monsterResistancesInstance.find('input#DamageVulnerabilities').simulate('change', { target: { value: 'Everything' } })
			expect(monsterResistancesInstance.state().DamageVulnerabilities).toEqual('Everything');
		})

		it('should change only DamageResistances when DamageResistances is changed', () => {
			monsterResistancesInstance.find('input#DamageResistances').simulate('change', { target: { value: 'None at all' } })
			expect(monsterResistancesInstance.state().DamageResistances).toEqual('None at all');
		})

		it('should change only DamageImmunities when DamageImmunities is changed', () => {
			monsterResistancesInstance.find('input#DamageImmunities').simulate('change', { target: { value: 'Nada' } })
			expect(monsterResistancesInstance.state().DamageImmunities).toEqual('Nada');
		})

		it('should change only ConditionImmunities when ConditionImmunities is changed', () => {
			monsterResistancesInstance.find('input#ConditionImmunities').simulate('change', { target: { value: 'Nothing' } })
			expect(monsterResistancesInstance.state().ConditionImmunities).toEqual('Nothing');
		})
		// DEFAULTS
		it('should change Type back to undefined when input is empty', () => {
			monsterResistancesInstance.find('input#DamageVulnerabilities').simulate('change', { target: { value: '' } })
			expect(monsterResistancesInstance.state().DamageVulnerabilities).toEqual(undefined);
		})

		it('should change Alignment back to undefined when input is empty', () => {
			monsterResistancesInstance.find('input#DamageResistances').simulate('change', { target: { value: '' } })
			expect(monsterResistancesInstance.state().DamageResistances).toEqual(undefined);
		})

		it('should change Size back to undefined when input is empty', () => {
			monsterResistancesInstance.find('input#DamageImmunities').simulate('change', { target: { value: '' } })
			expect(monsterResistancesInstance.state().DamageImmunities).toEqual(undefined);
		})

		it('should change Race back to undefined when input is empty', () => {
			monsterResistancesInstance.find('input#ConditionImmunities').simulate('change', { target: { value: '' } })
			expect(monsterResistancesInstance.state().ConditionImmunities).toEqual(undefined);
		})
		// VALIDATION
		const moreThan200: string = "More than 200 chars\
			01234567890123456789012345678901234567890123456789\
			01234567890123456789012345678901234567890123456789\
			01234567890123456789012345678901234567890123456789\
			01234567890123456789012345678901234567890123456789"

		it('should validate DamageVulnerabilities when DamageVulnerabilities is changed', () => {
			monsterResistancesInstance.find('input#DamageVulnerabilities').simulate('change', { target: { value: moreThan200 } })
			expect(monsterResistancesInstance.state().DamageVulnerabilities).toEqual(moreThan200);
			expect(monsterResistancesInstance.find('FormHelperText#DamageVulnerabilities-helper-text').text()).toEqual('\"DamageVulnerabilities\" length must be less than or equal to 200 characters long');
		})

		it('should validate DamageResistances when DamageResistances is changed', () => {
			monsterResistancesInstance.find('input#DamageResistances').simulate('change', { target: { value: moreThan200 } })
			expect(monsterResistancesInstance.state().DamageResistances).toEqual(moreThan200);
			expect(monsterResistancesInstance.find('FormHelperText#DamageResistances-helper-text').text()).toEqual('\"DamageResistances\" length must be less than or equal to 200 characters long');
		})

		it('should validate DamageImmunities when DamageImmunities is changed', () => {
			monsterResistancesInstance.find('input#DamageImmunities').simulate('change', { target: { value: moreThan200 } })
			expect(monsterResistancesInstance.state().DamageImmunities).toEqual(moreThan200);
			expect(monsterResistancesInstance.find('FormHelperText#DamageImmunities-helper-text').text()).toEqual('\"DamageImmunities\" length must be less than or equal to 200 characters long');
		})

		it('should validate ConditionImmunities when ConditionImmunities is changed', () => {
			monsterResistancesInstance.find('input#ConditionImmunities').simulate('change', { target: { value: moreThan200 } })
			expect(monsterResistancesInstance.state().ConditionImmunities).toEqual(moreThan200);
			expect(monsterResistancesInstance.find('FormHelperText#ConditionImmunities-helper-text').text()).toEqual('\"ConditionImmunities\" length must be less than or equal to 200 characters long');
		})
	});
});