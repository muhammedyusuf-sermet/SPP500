import * as React from 'react';
import { mount, ReactWrapper, shallow } from 'enzyme';

import { IMonsterLanguagesProps, IMonsterLanguagesState, MonsterLanguages } from '../../src/renderer/components/platform/pages/view_catalog/monster/MonsterLanguages';
const Joi = require('joi');
import { ValidationOptions } from 'joi';

const payloadSchema = Joi.object({
	Languages: Joi.string().allow('').max(100).label('Languages'),
});
const validateOptions: ValidationOptions = {
	abortEarly: false,
	convert: true,
	allowUnknown: false,
	context: {

	}
};

////// Happy Path //////
describe('Monster Languages', () => {

	let monsterLanguagesInstance: ReactWrapper<IMonsterLanguagesProps, IMonsterLanguagesState, MonsterLanguages>;

	describe('Provided Resistance values', () => {

		beforeEach(() => {
			monsterLanguagesInstance =
				mount<MonsterLanguages, IMonsterLanguagesProps, IMonsterLanguagesState>(
					<MonsterLanguages
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{
							Languages: 'This is test language',
						}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterLanguagesInstance).toBeDefined();
		});

		it('should have the correct string for Languages', () => {
			expect(monsterLanguagesInstance.find('Input#Languages').props().value).toEqual('This is test language');
		});
	});

	describe('componentWillReceiveProps()', () => {
		beforeEach(() => {
			monsterLanguagesInstance =
				mount<MonsterLanguages, IMonsterLanguagesProps, IMonsterLanguagesState>(
					<MonsterLanguages
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{
							Languages: 'This is test language',
						}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterLanguagesInstance).toBeDefined();
		});

		it('renders new props', () => {
			monsterLanguagesInstance.setProps({
				initial: {
					Languages: 'This is test new language',
				}
			})
			expect(monsterLanguagesInstance.find('Input#Languages').props().value).toEqual('This is test new language');
		});

		it('renders without crashing with same props', () => {
			monsterLanguagesInstance.setProps({
				initial: {
					Languages: 'This is test language',
				}
			});
			expect(monsterLanguagesInstance.find('Input#Languages').props().value).toEqual('This is test language');
		});

		it('disables input if disable prop changes', () => {
			expect(monsterLanguagesInstance.find('Input#Languages').props().disabled).toEqual(false);
			monsterLanguagesInstance.setProps({
				disabled: true
			})
			expect(monsterLanguagesInstance.find('Input#Languages').props().disabled).toEqual(true);
		});
	});

	describe('Small snapshot', () => {
		it ('matches snapshot', () => {
			const shallowMonsterLanguagesInstance =
				shallow<MonsterLanguages, IMonsterLanguagesProps, IMonsterLanguagesState>(
					<MonsterLanguages
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{}}/>
				);
			expect(shallowMonsterLanguagesInstance).toMatchSnapshot();
		});
	});

	describe('Happy Path', () => {

		beforeEach(() => {
			monsterLanguagesInstance =
				mount<MonsterLanguages, IMonsterLanguagesProps, IMonsterLanguagesState>(
					<MonsterLanguages
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterLanguagesInstance).toBeDefined();
		});

		it('should be able to update state', () => {
			monsterLanguagesInstance.find('Input#Languages').simulate('change', { target: { value: 'Everything' } })
			expect(monsterLanguagesInstance.state()).toEqual({
				// data
				Languages: 'Everything',
				// errors
				LanguagesError: undefined,
			});
		});
		// STATE CHANGE
		it('should change only Languages when Languages is changed', () => {
			monsterLanguagesInstance.find('Input#Languages').simulate('change', { target: { value: 'Everything' } })
			expect(monsterLanguagesInstance.state().Languages).toEqual('Everything');
		})

		// DEFAULTS
		it('should change Type back to undefined when input is empty', () => {
			monsterLanguagesInstance.find('Input#Languages').simulate('change', { target: { value: '' } })
			expect(monsterLanguagesInstance.state().Languages).toEqual(undefined);
		})

		// VALIDATION
		const moreThan100: string = "More than 100 chars\
			01234567890123456789012345678901234567890123456789\
			01234567890123456789012345678901234567890123456789"

		it('should validate Languages when Languages is changed', () => {
			monsterLanguagesInstance.find('Input#Languages').simulate('change', { target: { value: moreThan100  } })
			expect(monsterLanguagesInstance.state().Languages).toEqual(moreThan100);
			expect(monsterLanguagesInstance.find('Help#Languages').text()).toEqual('\"Languages\" length must be less than or equal to 100 characters long');
		})
	});
});