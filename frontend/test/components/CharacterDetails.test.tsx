import * as React from 'react';
import { mount, ReactWrapper, shallow } from 'enzyme';
const Joi = require('joi');
import { ValidationOptions } from 'joi';

import { ICharacterDetailsProps, ICharacterDetailsState, CharacterDetails } from '../../src/renderer/components/platform/pages/view_game_components/CharacterDetails';
import { CharacterRace, CharacterClass } from '../../src/character';

const payloadSchema = Joi.object({
	Id: Joi.number().greater(0).allow(0),
	Name: Joi.string().required().max(50).label("Name"),
	Level: Joi.number().integer().greater(0).label("Level"),
	Race: Joi.string().valid(Joi.ref('$RaceOptions')).label('Race'),
	Class: Joi.string().valid(Joi.ref('$ClassOptions')).label('Class'),
	MaxHealth: Joi.number().integer().greater(0).label('MaxHealth'),
	ArmorClass: Joi.number().integer().greater(0).label('ArmorClass'),
	Notes: Joi.string().max(1000).label("Notes"),
});
const validateOptions: ValidationOptions = {
	abortEarly: false,
	convert: true,
	allowUnknown: false,
	context: {
		RaceOptions: Object.keys(CharacterRace),
		ClassOptions: Object.keys(CharacterClass)
	}
};

////// Happy Path //////
describe('Character Details', () => {

	let monsterEnumConfigurationInstance: ReactWrapper<ICharacterDetailsProps, ICharacterDetailsState, CharacterDetails>;

	describe('Provided Character Details values', () => {

		beforeEach(() => {
			monsterEnumConfigurationInstance =
				mount<CharacterDetails, ICharacterDetailsProps, ICharacterDetailsState>(
					<CharacterDetails
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{
							Name: 'Hello',
							Level: 3,
							Race: CharacterRace.Dragonborn,
							Class: CharacterClass.Cleric,
							MaxHealth: 35,
							ArmorClass: 17,
							Notes: 'Very ugly and ignorant'
						}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterEnumConfigurationInstance).toBeDefined();
		});

		it('should have the correct Name', () => {
			expect(monsterEnumConfigurationInstance.find('input#Name').props().value).toEqual('Hello');
		});

		it('should have the correct Level', () => {
			expect(monsterEnumConfigurationInstance.find('input#Level').props().value).toEqual(3);
		});

		it('should have the selected Race', () => {
			expect(monsterEnumConfigurationInstance.find('select#Race').props().value).toEqual('Dragonborn');
		});

		it('should have the selected Class', () => {
			expect(monsterEnumConfigurationInstance.find('select#Class').props().value).toEqual('Cleric');
		});

		it('should have the correct MaxHealth', () => {
			expect(monsterEnumConfigurationInstance.find('input#MaxHealth').props().value).toEqual(35);
		});

		it('should have the correct ArmorClass', () => {
			expect(monsterEnumConfigurationInstance.find('input#ArmorClass').props().value).toEqual(17);
		});

		it('should have the correct Notes', () => {
			expect(monsterEnumConfigurationInstance.find('textarea#Notes').props().value).toEqual('Very ugly and ignorant');
		});
	});

	describe('componentWillReceiveProps()', () => {
		beforeEach(() => {
			monsterEnumConfigurationInstance =
				mount<CharacterDetails, ICharacterDetailsProps, ICharacterDetailsState>(
					<CharacterDetails
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{
							Name: 'Hello',
							Level: 3,
							Race: CharacterRace.Dragonborn,
							Class: CharacterClass.Cleric,
							MaxHealth: 35,
							ArmorClass: 17,
							Notes: 'Very ugly and ignorant'
						}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterEnumConfigurationInstance).toBeDefined();
		});

		it('renders new props', () => {
			monsterEnumConfigurationInstance.setProps({
				initial: {
					Name: 'NewName',
					Level: 5,
					Race: CharacterRace.Elf,
					Class: CharacterClass.Sorcerer,
					MaxHealth: 50,
					ArmorClass: 12,
					Notes: 'Very cool and insane'
				}
			})
			expect(monsterEnumConfigurationInstance.find('input#Name').props().value).toEqual('NewName');
			expect(monsterEnumConfigurationInstance.find('input#Level').props().value).toEqual(5);
			expect(monsterEnumConfigurationInstance.find('select#Race').props().value).toEqual('Elf');
			expect(monsterEnumConfigurationInstance.find('select#Class').props().value).toEqual('Sorcerer');
			expect(monsterEnumConfigurationInstance.find('input#MaxHealth').props().value).toEqual(50);
			expect(monsterEnumConfigurationInstance.find('input#ArmorClass').props().value).toEqual(12);
			expect(monsterEnumConfigurationInstance.find('textarea#Notes').props().value).toEqual('Very cool and insane');
		});

		it('renders without crashing with same props', () => {
			monsterEnumConfigurationInstance.setProps({
				initial: {
					Name: 'Hello',
					Level: 3,
					Race: CharacterRace.Dragonborn,
					Class: CharacterClass.Cleric,
					MaxHealth: 35,
					ArmorClass: 17,
					Notes: 'Very ugly and ignorant'
				}
			});
			expect(monsterEnumConfigurationInstance.find('input#Name').props().value).toEqual('Hello');
			expect(monsterEnumConfigurationInstance.find('input#Level').props().value).toEqual(3);
			expect(monsterEnumConfigurationInstance.find('select#Race').props().value).toEqual('Dragonborn');
			expect(monsterEnumConfigurationInstance.find('select#Class').props().value).toEqual('Cleric');
			expect(monsterEnumConfigurationInstance.find('input#MaxHealth').props().value).toEqual(35);
			expect(monsterEnumConfigurationInstance.find('input#ArmorClass').props().value).toEqual(17);
			expect(monsterEnumConfigurationInstance.find('textarea#Notes').props().value).toEqual('Very ugly and ignorant');
		});

		it('disables input if disable prop changes', () => {
			expect(monsterEnumConfigurationInstance.find('input#Name').props().disabled).toEqual(false)
			expect(monsterEnumConfigurationInstance.find('input#Level').props().disabled).toEqual(false)
			expect(monsterEnumConfigurationInstance.find('select#Race').props().disabled).toEqual(false)
			expect(monsterEnumConfigurationInstance.find('select#Class').props().disabled).toEqual(false)
			expect(monsterEnumConfigurationInstance.find('input#MaxHealth').props().disabled).toEqual(false)
			expect(monsterEnumConfigurationInstance.find('input#ArmorClass').props().disabled).toEqual(false)
			expect(monsterEnumConfigurationInstance.find('textarea#Notes').props().disabled).toEqual(false)
			monsterEnumConfigurationInstance.setProps({
				disabled: true
			});
			expect(monsterEnumConfigurationInstance.find('input#Name').props().disabled).toEqual(true)
			expect(monsterEnumConfigurationInstance.find('input#Level').props().disabled).toEqual(true)
			expect(monsterEnumConfigurationInstance.find('select#Race').props().disabled).toEqual(true)
			expect(monsterEnumConfigurationInstance.find('select#Class').props().disabled).toEqual(true)
			expect(monsterEnumConfigurationInstance.find('input#MaxHealth').props().disabled).toEqual(true)
			expect(monsterEnumConfigurationInstance.find('input#ArmorClass').props().disabled).toEqual(true)
			expect(monsterEnumConfigurationInstance.find('textarea#Notes').props().disabled).toEqual(true)
		});

		it('Does not render twice when the props are the same.', () => {
			const prevState = monsterEnumConfigurationInstance.state();
			monsterEnumConfigurationInstance.instance().componentWillReceiveProps({
				disabled: false,
				PayloadSchema: payloadSchema,
				ValidationOptions: validateOptions,
				initial: {
					Name: 'Hello',
					Level: 3,
					Race: CharacterRace.Dragonborn,
					Class: CharacterClass.Cleric,
					MaxHealth: 35,
					ArmorClass: 17,
					Notes: 'Very ugly and ignorant'
				}
			});
			// check not just the value but the literal object
			// we want to make sure the component doesn't render
			// when the props don't change
			expect(monsterEnumConfigurationInstance.state()).toBe(prevState)
		});

		it('Rerender when only initial changes.', () => {
			monsterEnumConfigurationInstance.instance().componentWillReceiveProps({
				disabled: false,
				PayloadSchema: payloadSchema,
				ValidationOptions: validateOptions,
				initial: {
					Name: 'NewName',
					Level: 5,
					Race: CharacterRace.Elf,
					Class: CharacterClass.Sorcerer,
					MaxHealth: 50,
					ArmorClass: 12,
					Notes: 'Very cool and insane'
				}
			});
			monsterEnumConfigurationInstance.update()
			expect(monsterEnumConfigurationInstance.find('input#Name').props().value).toEqual('NewName');
			expect(monsterEnumConfigurationInstance.find('input#Level').props().value).toEqual(5);
			expect(monsterEnumConfigurationInstance.find('select#Race').props().value).toEqual('Elf');
			expect(monsterEnumConfigurationInstance.find('select#Class').props().value).toEqual('Sorcerer');
			expect(monsterEnumConfigurationInstance.find('input#MaxHealth').props().value).toEqual(50);
			expect(monsterEnumConfigurationInstance.find('input#ArmorClass').props().value).toEqual(12);
			expect(monsterEnumConfigurationInstance.find('textarea#Notes').props().value).toEqual('Very cool and insane');
		});
	});

	describe('Small snapshot', () => {
		it ('matches snapshot', () => {
			const shallowCharacterDetailsInstance =
				shallow<CharacterDetails, ICharacterDetailsProps, ICharacterDetailsState>(
					<CharacterDetails
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{}}/>
				);
			expect(shallowCharacterDetailsInstance).toMatchSnapshot();
		});
	});

	describe('Happy Path', () => {

		beforeEach(() => {
			monsterEnumConfigurationInstance =
				mount<CharacterDetails, ICharacterDetailsProps, ICharacterDetailsState>(
					<CharacterDetails
						disabled={false}
						PayloadSchema={payloadSchema}
						ValidationOptions={validateOptions}
						initial={{}} />
				);
		})

		it('renders without crashing', () => {
			expect(monsterEnumConfigurationInstance).toBeDefined();
		});

		it('should be able to update state', () => {
			monsterEnumConfigurationInstance.find('input#Name').simulate('change', { target: { value: 'Hello' }})
			monsterEnumConfigurationInstance.find('input#Level').simulate('change', { target: { value: 4 }})
			monsterEnumConfigurationInstance.find('select#Race').simulate('change', { target: { value: 'HalfElf' }})
			monsterEnumConfigurationInstance.find('select#Class').simulate('change', { target: { value: 'Wizard' }})
			monsterEnumConfigurationInstance.find('input#MaxHealth').simulate('change', { target: { value: 25 }})
			monsterEnumConfigurationInstance.find('input#ArmorClass').simulate('change', { target: { value: 7 }})
			monsterEnumConfigurationInstance.find('textarea#Notes').simulate('change', { target: { value: 'Gray' }})
			expect(monsterEnumConfigurationInstance.state()).toEqual({
				// data
				Name: 'Hello',
				Level: 4,
				Race: 'HalfElf',
				Class: 'Wizard',
				MaxHealth: 25,
				ArmorClass: 7,
				Notes: 'Gray',
				// errors
				NameError: undefined,
				LevelError: undefined,
				RaceError: undefined,
				ClassError: undefined,
				MaxHealthError: undefined,
				ArmorClassError: undefined,
				NotesError: undefined,
			});
		});

		it('should be able to get only data', () => {
			monsterEnumConfigurationInstance.find('input#Name').simulate('change', { target: { value: 'Hello' }})
			// level is not set
			monsterEnumConfigurationInstance.find('select#Race').simulate('change', { target: { value: 'HalfElf' }})
			// class is not set
			monsterEnumConfigurationInstance.find('input#MaxHealth').simulate('change', { target: { value: 25 }})
			monsterEnumConfigurationInstance.find('input#ArmorClass').simulate('change', { target: { value: 7 }})
			monsterEnumConfigurationInstance.find('textarea#Notes').simulate('change', { target: { value: 'Gray' }})
			// expect only data that was set
			expect(monsterEnumConfigurationInstance.instance().GetData()).toEqual({
				// data
				Name: 'Hello',
				Race: 'HalfElf',
				MaxHealth: 25,
				ArmorClass: 7,
				Notes: 'Gray',
			});
		});
		// STATE CHANGE
		it('should change only Name when Name is changed', () => {
			monsterEnumConfigurationInstance.find('input#Name').simulate('change', { target: { value: 'Hello' }})
			expect(monsterEnumConfigurationInstance.state().Name).toEqual('Hello');
		})

		it('should change only Level when Level is changed', () => {
			monsterEnumConfigurationInstance.find('input#Level').simulate('change', { target: { value: 4 }})
			expect(monsterEnumConfigurationInstance.state().Level).toEqual(4);
		})

		it('should change only Race when Race is changed', () => {
			monsterEnumConfigurationInstance.find('select#Race').simulate('change', { target: { value: 'HalfElf' }})
			expect(monsterEnumConfigurationInstance.state().Race).toEqual('HalfElf');
		})

		it('should change only Class when Class is changed', () => {
			monsterEnumConfigurationInstance.find('select#Class').simulate('change', { target: { value: 'Wizard' }})
			expect(monsterEnumConfigurationInstance.state().Class).toEqual('Wizard');
		})

		it('should change only MaxHealth when MaxHealth is changed', () => {
			monsterEnumConfigurationInstance.find('input#MaxHealth').simulate('change', { target: { value: 45 }})
			expect(monsterEnumConfigurationInstance.state().MaxHealth).toEqual(45);
		})

		it('should change only ArmorClass when ArmorClass is changed', () => {
			monsterEnumConfigurationInstance.find('input#ArmorClass').simulate('change', { target: { value: 6 }})
			expect(monsterEnumConfigurationInstance.state().ArmorClass).toEqual(6);
		})

		it('should change only Notes when Notes is changed', () => {
			monsterEnumConfigurationInstance.find('textarea#Notes').simulate('change', { target: { value: 'A long list of attributes' }})
			expect(monsterEnumConfigurationInstance.state().Notes).toEqual('A long list of attributes');
		})
		// DEFAULTS
		it('should reset Name when input is set to empty', () => {
			monsterEnumConfigurationInstance.find('input#Name').simulate('change', { target: { value: '' }})
			expect(monsterEnumConfigurationInstance.state().Name).toBeUndefined()
		})

		it('should reset Level when input is set to empty', () => {
			monsterEnumConfigurationInstance.find('input#Level').simulate('change', { target: { value: '' }})
			expect(monsterEnumConfigurationInstance.state().Level).toBeUndefined()
		})

		it('should reset Race when input is set to empty', () => {
			monsterEnumConfigurationInstance.find('select#Race').simulate('change', { target: { value: '' }})
			expect(monsterEnumConfigurationInstance.state().Race).toBeUndefined()
		})

		it('should reset Class when input is set to empty', () => {
			monsterEnumConfigurationInstance.find('select#Class').simulate('change', { target: { value: '' }})
			expect(monsterEnumConfigurationInstance.state().Class).toBeUndefined()
		})

		it('should reset MaxHealth when input is set to empty', () => {
			monsterEnumConfigurationInstance.find('input#MaxHealth').simulate('change', { target: { value: '' }})
			expect(monsterEnumConfigurationInstance.state().MaxHealth).toBeUndefined()
		})

		it('should reset ArmorClass when input is set to empty', () => {
			monsterEnumConfigurationInstance.find('input#ArmorClass').simulate('change', { target: { value: '' }})
			expect(monsterEnumConfigurationInstance.state().ArmorClass).toBeUndefined()
		})

		it('should reset Notes when input is set to empty', () => {
			monsterEnumConfigurationInstance.find('textarea#Notes').simulate('change', { target: { value: '' }})
			expect(monsterEnumConfigurationInstance.state().Notes).toBeUndefined()
		})
		// VALIDATION
		const longerThan50='NameTooLong01234567890123456789012345678901234567890123456789'

		it('should validate input when Name is changed', () => {
			monsterEnumConfigurationInstance.find('input#Name').simulate('change', { target: { value: longerThan50 }})
			expect(monsterEnumConfigurationInstance.state().Name).toEqual(longerThan50)
			expect(monsterEnumConfigurationInstance.state().NameError).toEqual('"Name" length must be less than or equal to 50 characters long')
		})

		it('should validate input when Level is changed', () => {
			monsterEnumConfigurationInstance.find('input#Level').simulate('change', { target: { value: -1 }})
			expect(monsterEnumConfigurationInstance.state().Level).toEqual(-1)
			expect(monsterEnumConfigurationInstance.state().LevelError).toEqual('"Level" must be greater than 0')
		})

		it('should validate input when Race is changed', () => {
			monsterEnumConfigurationInstance.find('select#Race').simulate('change', { target: { value: 'InvalidRace' }})
			expect(monsterEnumConfigurationInstance.state().Race).toBeUndefined()
			expect(monsterEnumConfigurationInstance.state().RaceError).toEqual('"Race" must be one of [context:RaceOptions]')
		})

		it('should validate input when Class is changed', () => {
			monsterEnumConfigurationInstance.find('select#Class').simulate('change', { target: { value: 'InvalidClass' }})
			expect(monsterEnumConfigurationInstance.state().Class).toBeUndefined()
			expect(monsterEnumConfigurationInstance.state().ClassError).toEqual('"Class" must be one of [context:ClassOptions]')
		})

		it('should validate input when MaxHealth is changed', () => {
			monsterEnumConfigurationInstance.find('input#MaxHealth').simulate('change', { target: { value: -1 }})
			expect(monsterEnumConfigurationInstance.state().MaxHealth).toEqual(-1)
			expect(monsterEnumConfigurationInstance.state().MaxHealthError).toEqual('"MaxHealth" must be greater than 0')
		})

		it('should validate input when ArmorClass is changed', () => {
			monsterEnumConfigurationInstance.find('input#ArmorClass').simulate('change', { target: { value: -1 }})
			expect(monsterEnumConfigurationInstance.state().ArmorClass).toEqual(-1)
			expect(monsterEnumConfigurationInstance.state().ArmorClassError).toEqual('"ArmorClass" must be greater than 0')
		})

		const longerThan1000 = "NotesLongerThan1000\
			0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789\
			0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789\
			0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789\
			0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789\
			0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789\
			0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789\
			0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789\
			0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789\
			0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789\
			0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"

		it('should validate input when Notes is changed', () => {
			monsterEnumConfigurationInstance.find('textarea#Notes').simulate('change', { target: { value: longerThan1000 }})
			expect(monsterEnumConfigurationInstance.state().Notes).toEqual(longerThan1000)
			expect(monsterEnumConfigurationInstance.state().NotesError).toEqual('"Notes" length must be less than or equal to 1000 characters long')
		})
	});
});