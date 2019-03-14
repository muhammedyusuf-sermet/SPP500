import * as React from "react"
import { shallow, ShallowWrapper } from 'enzyme';
import { EncounterCreation, IEncounterCreationState } from "../src/renderer/components/EncounterCreation";
import { Checkbox } from 'bloomer';

import * as nock from 'nock';
import {API_URL} from '../src/config'

jest.mock('../src/cookie');

describe('Encounter Creation', () => {

	let encounterCreationInstance: ShallowWrapper<any, IEncounterCreationState, EncounterCreation>;

	describe('Happy Path', () => {

		beforeEach(() => {
			encounterCreationInstance = shallow (<EncounterCreation/>);
		})

		it('renders without crashing', () => {
			expect(encounterCreationInstance).toBeDefined();
		});

		it('renders correctly when the page is loaded', () => {
			expect(encounterCreationInstance).toMatchSnapshot();
		});

		it('should allow text boxes respond to change event and update the state', () => {
			var nameBox = encounterCreationInstance.find('#encounter_name');
			var descriptionBox = encounterCreationInstance.find('#encounter_description');

			nameBox.simulate('change', {target: {name: 'name', value: 'test_name'}});
			descriptionBox.simulate('change', {target: {name: 'description', value: 'test_description'}});

			expect(encounterCreationInstance.state('encounter')).toEqual({
				name: 'test_name',
				description: 'test_description'
			});
		});

		it('should redirect to main page when Cancel button is clicked', () => {
			var cancelButton = encounterCreationInstance.find('#cancel');

			cancelButton.simulate('click', {preventDefault: () => {}});

			expect(encounterCreationInstance.state('redirectToHome')).toEqual(true);
		});

		it('should allow monster checkboxes respond to change event and update the state', () => {
			var checkboxMonster = encounterCreationInstance.find(Checkbox);

			// Check a monster, doesn't matter which one
			checkboxMonster.at(0).simulate('change',{ target: { checked: true }, persist: () => {} });

			expect(encounterCreationInstance.state('checkedMonsters')).not.toEqual(new Map()); 
		});

		describe('makes a server request to save te encounter', () => {

			beforeEach(() => {
				nock.disableNetConnect();
				nock(API_URL)
				.post('/encounter/create', {
						Name: "test_name",
						Description: "test_description",
						Monsters   : ["test_monster1"]
					})
				.reply(201,
					{ status: 201, messages: 'success' },
				);
			});

			it('successfully saves the encounter', () => {
				// Since monsters aren't required, this test does not select any monster for the encounter
				var nameBox = encounterCreationInstance.find('#encounter_name');
				var descriptionBox = encounterCreationInstance.find('#encounter_description');
				var createEncounterForm = encounterCreationInstance.find('form');

				nameBox.simulate('change', {target: {name: 'name', value: 'test_name'}});
				descriptionBox.simulate('change', {target: {name: 'description', value: 'test_description'}});

				nock(API_URL)
					.post('/encounter/create', {
							Name: "test_name",
							Description: "test_description",
							Monsters   : ["test_monster1"]
						})
					.reply(201, {
						body: [{ status: 201, messages: 'success' }],
					});
				createEncounterForm.simulate('submit', {preventDefault: () => {}});
			});
		});

		describe('should show and hide modal', () => {
			it('show modal', () => {
				encounterCreationInstance.instance().closeModal();
				expect(encounterCreationInstance.find('#encounterCreationModal').prop('isActive')).toEqual(false);
				encounterCreationInstance.instance().openModal('TestMessage');
				expect(encounterCreationInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				expect(encounterCreationInstance.find('#encounterCreationModal').prop('isActive')).toEqual(true);
			})

			it('close modal', () => {
				encounterCreationInstance.instance().openModal('TestMessage');
				expect(encounterCreationInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				expect(encounterCreationInstance.find('#encounterCreationModal').prop('isActive')).toEqual(true);
				encounterCreationInstance.instance().closeModal();
				expect(encounterCreationInstance.find('#encounterCreationModal').prop('isActive')).toEqual(false);
			})

			it('close modal by click', () => {
				encounterCreationInstance.instance().openModal('TestMessage');
				expect(encounterCreationInstance.find('#ModalMessage').text().length).toBeGreaterThan(0);
				expect(encounterCreationInstance.find('#encounterCreationModal').prop('isActive')).toEqual(true);
				let background = encounterCreationInstance.find('#modalBackground')
				background.simulate('click');
				expect(encounterCreationInstance.find('#encounterCreationModal').prop('isActive')).toEqual(false);
			})
		});

	});

});