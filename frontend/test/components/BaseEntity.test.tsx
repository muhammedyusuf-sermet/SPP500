import * as React from 'react';
import { mount, ReactWrapper, shallow } from 'enzyme';

import { IBaseEntityProps, IBaseEntityState, BaseEntity } from '../../src/renderer/components/platform/pages/run_encounter/entitiy/BaseEntity';

////// Happy Path //////
describe('Monster Defences', () => {

	let baseEntityInstance: ReactWrapper<IBaseEntityProps, IBaseEntityState, BaseEntity>;
	const view = jest.fn();
	const edit = jest.fn();

	describe('Provided Entity values', () => {

		beforeEach(() => {
			baseEntityInstance =
				mount<BaseEntity, IBaseEntityProps, IBaseEntityState>(
					<BaseEntity
						Id={0}
						Initiative={0}
						View={view}
						Edit={edit}
						Entity={{
							EntityType: 'Monster',
							Id: 0,
							Name: 'Test Name',
							ArmorClass: 124,
							HitPoints: 623,
						}} />
				);
		})

		it('renders without crashing', () => {
			expect(baseEntityInstance).toBeDefined();
		});

		it('should have the correct string for Name', () => {
			expect(baseEntityInstance.find('Typography#Name').text()).toEqual('Test Name');
		});

		it('should have the correct number for Initiative', () => {
			expect(baseEntityInstance.find('Typography#Initiative').text()).toEqual('Initative: 0');
		});

		it('should have the correct number for ArmorClass', () => {
			expect(baseEntityInstance.find('Typography#ArmorClass').text()).toEqual('AC: 124');
		});

		it('should have the correct number for HitPoints', () => {
			expect(baseEntityInstance.find('Typography#HitPoints').text()).toEqual('HP: 623/623');
		});

		it('should have the correct string for Conditions', () => {
			expect(baseEntityInstance.find('Typography#Conditions').text()).toEqual('');
		});
	});

	describe('componentWillReceiveProps()', () => {
		beforeEach(() => {
			baseEntityInstance =
				mount<BaseEntity, IBaseEntityProps, IBaseEntityState>(
					<BaseEntity
						Id={0}
						Initiative={0}
						View={view}
						Edit={edit}
						Entity={{
							EntityType: 'Monster',
							Id: 0,
							Name: 'Test Name',
							ArmorClass: 124,
							HitPoints: 623,
						}} />
				);
		})

		it('renders without crashing', () => {
			expect(baseEntityInstance).toBeDefined();
		});

		it('renders new props', () => {
			baseEntityInstance.setProps({
				Entity: {
					EntityType: 'Monster',
					Id: 2,
					Name: 'Test Name 2',
					ArmorClass: 100,
					HitPoints: 32,
				}
			})
			expect(baseEntityInstance.find('Typography#Name').text()).toEqual('Test Name 2');
			expect(baseEntityInstance.find('Typography#ArmorClass').text()).toEqual('AC: 100');
			expect(baseEntityInstance.find('Typography#HitPoints').text()).toEqual('HP: 32/32');
			expect(baseEntityInstance.find('Typography#Conditions').text()).toEqual('');
		});

		it('renders without crashing with same props', () => {
			baseEntityInstance.setProps({
				Entity: {
					EntityType: 'Monster',
					Id: 0,
					Name: 'Test Name',
					ArmorClass: 124,
					HitPoints: 623,
				}
			})
			expect(baseEntityInstance.find('Typography#Name').text()).toEqual('Test Name');
			expect(baseEntityInstance.find('Typography#ArmorClass').text()).toEqual('AC: 124');
			expect(baseEntityInstance.find('Typography#HitPoints').text()).toEqual('HP: 623/623');
			expect(baseEntityInstance.find('Typography#Conditions').text()).toEqual('');
		});
	});

	describe('Small snapshot', () => {
		it ('matches snapshot', () => {
			const shallowBaseEntityInstance =
				shallow<BaseEntity, IBaseEntityProps, IBaseEntityState>(
					<BaseEntity
						Id={0}
						Initiative={0}
						View={view}
						Edit={edit}
						Entity={{
							EntityType: 'Monster',
							Id: 0,
							Name: 'Test Name',
							ArmorClass: 124,
							HitPoints: 623,
						}} />
				);
			expect(shallowBaseEntityInstance).toMatchSnapshot();
		});
	});

	describe('Happy Path', () => {
		// TODO: Test View and Edit buttons to make sure they call the view and edit functions.
		beforeEach(() => {
			baseEntityInstance =
				mount<BaseEntity, IBaseEntityProps, IBaseEntityState>(
					<BaseEntity
						Id={0}
						Initiative={0}
						View={view}
						Edit={edit}
						Entity={{
							EntityType: 'Monster',
							Id: 0,
							Name: 'Test Name',
							ArmorClass: 124,
							HitPoints: 623,
						}} />
				);
		})

		it('renders without crashing', () => {
			expect(baseEntityInstance).toBeDefined();
		});

		it('should be able to update state', () => {
			baseEntityInstance.find('input#CurrentHitPoints').simulate('change', { target: { value: '43' } })
			baseEntityInstance.find('input#Blinded').simulate('change')
			baseEntityInstance.find('input#Charmed').simulate('change')
			baseEntityInstance.find('input#Deafened').simulate('change')
			baseEntityInstance.find('input#Frightened').simulate('change')
			baseEntityInstance.find('input#Grappled').simulate('change')
			baseEntityInstance.find('input#Incapacitated').simulate('change')
			baseEntityInstance.find('input#Invisible').simulate('change')
			baseEntityInstance.find('input#Paralyzed').simulate('change')
			baseEntityInstance.find('input#Petrified').simulate('change')
			baseEntityInstance.find('input#Poisoned').simulate('change')
			baseEntityInstance.find('input#Prone').simulate('change')
			baseEntityInstance.find('input#Restrained').simulate('change')
			baseEntityInstance.find('input#Stunned').simulate('change')
			baseEntityInstance.find('input#Unconscious').simulate('change')
			expect(baseEntityInstance.state()).toEqual({
				CurrentHitPoints: 43,
				Blinded: true,
				Charmed: true,
				Deafened: true,
				Frightened: true,
				Grappled: true,
				Incapacitated: true,
				Invisible: true,
				Paralyzed: true,
				Petrified: true,
				Poisoned: true,
				Prone: true,
				Restrained: true,
				Stunned: true,
				Unconscious: true,
			});
		});
		// STATE CHANGE
		it('should change only CurrentHitPoints when CurrentHitPoints is changed', () => {
			baseEntityInstance.find('input#CurrentHitPoints').simulate('change', { target: { value: '958' } })
			expect(baseEntityInstance.state()).toEqual({
				CurrentHitPoints: 958,
			});
		})

		it('should change only Blinded when Blinded is changed', () => {
			baseEntityInstance.find('input#Blinded').simulate('change')
			expect(baseEntityInstance.state()).toEqual({
				CurrentHitPoints: 623,
				Blinded: true
			});
		})

		it('should change only Charmed when Charmed is changed', () => {
			baseEntityInstance.find('input#Charmed').simulate('change')
			expect(baseEntityInstance.state()).toEqual({
				CurrentHitPoints: 623,
				Charmed: true
			});
		})

		it('should change only Deafened when Deafened is changed', () => {
			baseEntityInstance.find('input#Deafened').simulate('change')
			expect(baseEntityInstance.state()).toEqual({
				CurrentHitPoints: 623,
				Deafened: true
			});
		})

		it('should change only Frightened when Frightened is changed', () => {
			baseEntityInstance.find('input#Frightened').simulate('change')
			expect(baseEntityInstance.state()).toEqual({
				CurrentHitPoints: 623,
				Frightened: true
			});
		})

		it('should change only Grappled when Grappled is changed', () => {
			baseEntityInstance.find('input#Grappled').simulate('change')
			expect(baseEntityInstance.state()).toEqual({
				CurrentHitPoints: 623,
				Grappled: true
			});
		})

		it('should change only Incapacitated when Incapacitated is changed', () => {
			baseEntityInstance.find('input#Incapacitated').simulate('change')
			expect(baseEntityInstance.state()).toEqual({
				CurrentHitPoints: 623,
				Incapacitated: true
			});
		})

		it('should change only Invisible when Invisible is changed', () => {
			baseEntityInstance.find('input#Invisible').simulate('change')
			expect(baseEntityInstance.state()).toEqual({
				CurrentHitPoints: 623,
				Invisible: true
			});
		})

		it('should change only Paralyzed when Paralyzed is changed', () => {
			baseEntityInstance.find('input#Paralyzed').simulate('change')
			expect(baseEntityInstance.state()).toEqual({
				CurrentHitPoints: 623,
				Paralyzed: true
			});
		})

		it('should change only Petrified when Petrified is changed', () => {
			baseEntityInstance.find('input#Petrified').simulate('change')
			expect(baseEntityInstance.state()).toEqual({
				CurrentHitPoints: 623,
				Petrified: true
			});
		})

		it('should change only Poisoned when Poisoned is changed', () => {
			baseEntityInstance.find('input#Poisoned').simulate('change')
			expect(baseEntityInstance.state()).toEqual({
				CurrentHitPoints: 623,
				Poisoned: true
			});
		})

		it('should change only Prone when Prone is changed', () => {
			baseEntityInstance.find('input#Prone').simulate('change')
			expect(baseEntityInstance.state()).toEqual({
				CurrentHitPoints: 623,
				Prone: true
			});
		})

		it('should change only Restrained when Restrained is changed', () => {
			baseEntityInstance.find('input#Restrained').simulate('change')
			expect(baseEntityInstance.state()).toEqual({
				CurrentHitPoints: 623,
				Restrained: true
			});
		})

		it('should change only Stunned when Stunned is changed', () => {
			baseEntityInstance.find('input#Stunned').simulate('change')
			expect(baseEntityInstance.state()).toEqual({
				CurrentHitPoints: 623,
				Stunned: true
			});
		})

		it('should change only Unconscious when Unconscious is changed', () => {
			baseEntityInstance.find('input#Unconscious').simulate('change')
			expect(baseEntityInstance.state()).toEqual({
				CurrentHitPoints: 623,
				Unconscious: true
			});
		})
		// VALIDATION
		it('should change only CurrentHitPoints when CurrentHitPoints is changed', () => {
			baseEntityInstance.find('input#CurrentHitPoints').simulate('change', { target: { value: '--1' } })
			expect(baseEntityInstance.state()).toEqual({
				CurrentHitPoints: 0,
			});
		})
	});
});