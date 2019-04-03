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
			nock.disableNetConnect();
			nock(API_URL)
				.get('/monster/get/0/12')
				.reply(201,
					{ status:201,
					messages:['success'],
					content:[{"Id":1,"Name":"Aboleth","Size":"Large","Type":"Aberration","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":17,"HitPoints":135,"HitPointDistribution":"18d10","Speed":"10 ft., swim 40 ft.","Languages":"Deep Speech, telepathy 120 ft.","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"","ConditionImmunities":"","ChallengeRating":10},{"Id":2,"Name":"Acolyte","Size":"Medium","Type":"Humanoid","Race":"AnyRace","Environment":"Grassland","Alignment":"AnyAlignment","ArmorClass":10,"HitPoints":9,"HitPointDistribution":"2d8","Speed":"30 ft.","Languages":"any one language (usually Common)","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"","ConditionImmunities":"","ChallengeRating":0.25},{"Id":3,"Name":"Adult Black Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticEvil","ArmorClass":19,"HitPoints":195,"HitPointDistribution":"17d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"acid","ConditionImmunities":"","ChallengeRating":14},{"Id":4,"Name":"Adult Blue Dracolich","Size":"Huge","Type":"Undead","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":19,"HitPoints":225,"HitPointDistribution":"18d12","Speed":"40 ft., burrow 30 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"necrotic","DamageImmunities":"lightning, poison","ConditionImmunities":"charmed, exhaustion, frightened, paralyzed, poisoned","ChallengeRating":17},{"Id":5,"Name":"Adult Blue Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":19,"HitPoints":225,"HitPointDistribution":"18d12","Speed":"40 ft., burrow 30 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"lightning","ConditionImmunities":"","ChallengeRating":16},{"Id":6,"Name":"Adult Brass Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticGood","ArmorClass":18,"HitPoints":172,"HitPointDistribution":"15d12","Speed":"40 ft., burrow 40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"fire","ConditionImmunities":"","ChallengeRating":13},{"Id":7,"Name":"Adult Bronze Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulGood","ArmorClass":19,"HitPoints":212,"HitPointDistribution":"17d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"lightning","ConditionImmunities":"","ChallengeRating":15},{"Id":8,"Name":"Adult Copper Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticGood","ArmorClass":18,"HitPoints":184,"HitPointDistribution":"16d12","Speed":"40 ft., climb 40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"acid","ConditionImmunities":"","ChallengeRating":14},{"Id":9,"Name":"Adult Gold Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulGood","ArmorClass":19,"HitPoints":256,"HitPointDistribution":"19d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"fire","ConditionImmunities":"","ChallengeRating":17},{"Id":10,"Name":"Adult Green Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":19,"HitPoints":207,"HitPointDistribution":"18d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"poison","ConditionImmunities":"poisoned","ChallengeRating":15},{"Id":11,"Name":"Adult Red Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticEvil","ArmorClass":19,"HitPoints":256,"HitPointDistribution":"19d12","Speed":"40 ft., climb 40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"fire","ConditionImmunities":"","ChallengeRating":17},{"Id":12,"Name":"Adult Silver Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulGood","ArmorClass":19,"HitPoints":243,"HitPointDistribution":"18d12","Speed":"40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"cold","ConditionImmunities":"","ChallengeRating":16}],
					total:326
				},
				).log(console.log);
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

		describe('interacts with the DB data accordingly', () => {

			
			it('should allow monster checkboxes respond to change event and update the state', async () => {
				
				//const response = await encounterCreationInstance.state(0, 12);

				//expect(getApiCall(0, 12)).toEqual([1]);

				let encounterCreationInstance = await shallow(<EncounterCreation />)
				
				var checkboxMonster = encounterCreationInstance.update().find(Checkbox);

				console.log(checkboxMonster.length);
				console.log(checkboxMonster.text());

				console.log("hello!");
				// Check a monster, doesn't matter which one
				console.log( encounterCreationInstance.state('monstersInCurrentPage'));

				
				//checkboxMonster.at(0).simulate('change',{ target: { checked: true }, persist: () => {} });

				//expect(encounterCreationInstance.state('checkedMonsters')).not.toEqual(new Map()); 
				
			});
		})

		describe('next and back buttons work', () => {
			beforeEach(() => {
				nock.disableNetConnect();
				nock(API_URL)
					.get('/monster/get/0/12')
					.reply(201,
						{ status:201,
						messages:['success'],
						content:[{"Id":1,"Name":"Aboleth","Size":"Large","Type":"Aberration","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":17,"HitPoints":135,"HitPointDistribution":"18d10","Speed":"10 ft., swim 40 ft.","Languages":"Deep Speech, telepathy 120 ft.","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"","ConditionImmunities":"","ChallengeRating":10},{"Id":2,"Name":"Acolyte","Size":"Medium","Type":"Humanoid","Race":"AnyRace","Environment":"Grassland","Alignment":"AnyAlignment","ArmorClass":10,"HitPoints":9,"HitPointDistribution":"2d8","Speed":"30 ft.","Languages":"any one language (usually Common)","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"","ConditionImmunities":"","ChallengeRating":0.25},{"Id":3,"Name":"Adult Black Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticEvil","ArmorClass":19,"HitPoints":195,"HitPointDistribution":"17d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"acid","ConditionImmunities":"","ChallengeRating":14},{"Id":4,"Name":"Adult Blue Dracolich","Size":"Huge","Type":"Undead","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":19,"HitPoints":225,"HitPointDistribution":"18d12","Speed":"40 ft., burrow 30 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"necrotic","DamageImmunities":"lightning, poison","ConditionImmunities":"charmed, exhaustion, frightened, paralyzed, poisoned","ChallengeRating":17},{"Id":5,"Name":"Adult Blue Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":19,"HitPoints":225,"HitPointDistribution":"18d12","Speed":"40 ft., burrow 30 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"lightning","ConditionImmunities":"","ChallengeRating":16},{"Id":6,"Name":"Adult Brass Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticGood","ArmorClass":18,"HitPoints":172,"HitPointDistribution":"15d12","Speed":"40 ft., burrow 40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"fire","ConditionImmunities":"","ChallengeRating":13},{"Id":7,"Name":"Adult Bronze Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulGood","ArmorClass":19,"HitPoints":212,"HitPointDistribution":"17d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"lightning","ConditionImmunities":"","ChallengeRating":15},{"Id":8,"Name":"Adult Copper Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticGood","ArmorClass":18,"HitPoints":184,"HitPointDistribution":"16d12","Speed":"40 ft., climb 40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"acid","ConditionImmunities":"","ChallengeRating":14},{"Id":9,"Name":"Adult Gold Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulGood","ArmorClass":19,"HitPoints":256,"HitPointDistribution":"19d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"fire","ConditionImmunities":"","ChallengeRating":17},{"Id":10,"Name":"Adult Green Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":19,"HitPoints":207,"HitPointDistribution":"18d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"poison","ConditionImmunities":"poisoned","ChallengeRating":15},{"Id":11,"Name":"Adult Red Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticEvil","ArmorClass":19,"HitPoints":256,"HitPointDistribution":"19d12","Speed":"40 ft., climb 40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"fire","ConditionImmunities":"","ChallengeRating":17},{"Id":12,"Name":"Adult Silver Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulGood","ArmorClass":19,"HitPoints":243,"HitPointDistribution":"18d12","Speed":"40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"cold","ConditionImmunities":"","ChallengeRating":16}],
						total:326
					},
					).log(console.log);
				});
					

			it('should allow switching between pages', async () => {
				var nextButton = encounterCreationInstance.find('#nextPageButton');
				var prevButton = encounterCreationInstance.find('#previousPageButton');

				nextButton.simulate('click');

				nock(API_URL)
						.get('/monster/get/1/12')
						.reply(201,
							{ status:201,
							messages:['success'],
							content:[{"Id":1,"Name":"Aboleth","Size":"Large","Type":"Aberration","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":17,"HitPoints":135,"HitPointDistribution":"18d10","Speed":"10 ft., swim 40 ft.","Languages":"Deep Speech, telepathy 120 ft.","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"","ConditionImmunities":"","ChallengeRating":10},{"Id":2,"Name":"Acolyte","Size":"Medium","Type":"Humanoid","Race":"AnyRace","Environment":"Grassland","Alignment":"AnyAlignment","ArmorClass":10,"HitPoints":9,"HitPointDistribution":"2d8","Speed":"30 ft.","Languages":"any one language (usually Common)","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"","ConditionImmunities":"","ChallengeRating":0.25},{"Id":3,"Name":"Adult Black Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticEvil","ArmorClass":19,"HitPoints":195,"HitPointDistribution":"17d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"acid","ConditionImmunities":"","ChallengeRating":14},{"Id":4,"Name":"Adult Blue Dracolich","Size":"Huge","Type":"Undead","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":19,"HitPoints":225,"HitPointDistribution":"18d12","Speed":"40 ft., burrow 30 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"necrotic","DamageImmunities":"lightning, poison","ConditionImmunities":"charmed, exhaustion, frightened, paralyzed, poisoned","ChallengeRating":17},{"Id":5,"Name":"Adult Blue Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":19,"HitPoints":225,"HitPointDistribution":"18d12","Speed":"40 ft., burrow 30 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"lightning","ConditionImmunities":"","ChallengeRating":16},{"Id":6,"Name":"Adult Brass Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticGood","ArmorClass":18,"HitPoints":172,"HitPointDistribution":"15d12","Speed":"40 ft., burrow 40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"fire","ConditionImmunities":"","ChallengeRating":13},{"Id":7,"Name":"Adult Bronze Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulGood","ArmorClass":19,"HitPoints":212,"HitPointDistribution":"17d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"lightning","ConditionImmunities":"","ChallengeRating":15},{"Id":8,"Name":"Adult Copper Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticGood","ArmorClass":18,"HitPoints":184,"HitPointDistribution":"16d12","Speed":"40 ft., climb 40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"acid","ConditionImmunities":"","ChallengeRating":14},{"Id":9,"Name":"Adult Gold Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulGood","ArmorClass":19,"HitPoints":256,"HitPointDistribution":"19d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"fire","ConditionImmunities":"","ChallengeRating":17},{"Id":10,"Name":"Adult Green Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":19,"HitPoints":207,"HitPointDistribution":"18d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"poison","ConditionImmunities":"poisoned","ChallengeRating":15},{"Id":11,"Name":"Adult Red Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticEvil","ArmorClass":19,"HitPoints":256,"HitPointDistribution":"19d12","Speed":"40 ft., climb 40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"fire","ConditionImmunities":"","ChallengeRating":17},{"Id":12,"Name":"Adult Silver Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulGood","ArmorClass":19,"HitPoints":243,"HitPointDistribution":"18d12","Speed":"40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"cold","ConditionImmunities":"","ChallengeRating":16}],
							total:326
						},
						).log(console.log);
				prevButton.simulate('click');

			});

		})

		describe('makes a server request to save the encounter', () => {

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
				//expect(encounterCreationInstance.find('#encounterCreationModal').prop('isActive')).toEqual(true);
				
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