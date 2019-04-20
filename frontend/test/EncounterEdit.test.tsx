import * as React from 'react';
import * as nock from 'nock';
import { mount, ReactWrapper } from 'enzyme';

import { EncounterCRUD, IEncounterCRUDState, IEncounterCRUDProps, EncounterCRUDState } from "../src/renderer/components/EncounterCRUD";

import {API_URL} from '../src/config'
import { CookieManager as CookieManagerMock } from "../src/__mocks__/cookie";
import { CookieManager } from "../src/cookie";
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { IMonsterState } from '../src/monster';
import { IEncounterState } from '../src/encounter';

jest.mock('../src/cookie');

////// Happy Path //////

describe('Monster CRUD', () => {

	let EncounterCRUDInstance: ReactWrapper<IEncounterCRUDProps, IEncounterCRUDState, EncounterCRUD>;
	let scope: nock.Scope;

	const basicResponse = {
		status: 201,
		messages: ['success'],
		content: { Id: 0, Name: 'Basic Encounter', Description: 'Basic Desc', Monsters: [{"Id": 5}] }
	}

	describe('Redirect if submitted', () => {
		beforeEach(async (done) => {
			nock.disableNetConnect();
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);

			scope = nock(API_URL)
				.persist()
				.get('/monster/get/0/12')
				.reply(201,
					{ status:201,
					messages:['success'],
					content:[{"Id":1,"Name":"Aboleth","Size":"Large","Type":"Aberration","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":17,"HitPoints":135,"HitPointDistribution":"18d10","Speed":"10 ft., swim 40 ft.","Languages":"Deep Speech, telepathy 120 ft.","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"","ConditionImmunities":"","ChallengeRating":10},{"Id":2,"Name":"Acolyte","Size":"Medium","Type":"Humanoid","Race":"AnyRace","Environment":"Grassland","Alignment":"AnyAlignment","ArmorClass":10,"HitPoints":9,"HitPointDistribution":"2d8","Speed":"30 ft.","Languages":"any one language (usually Common)","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"","ConditionImmunities":"","ChallengeRating":0.25},{"Id":3,"Name":"Adult Black Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticEvil","ArmorClass":19,"HitPoints":195,"HitPointDistribution":"17d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"acid","ConditionImmunities":"","ChallengeRating":14},{"Id":4,"Name":"Adult Blue Dracolich","Size":"Huge","Type":"Undead","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":19,"HitPoints":225,"HitPointDistribution":"18d12","Speed":"40 ft., burrow 30 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"necrotic","DamageImmunities":"lightning, poison","ConditionImmunities":"charmed, exhaustion, frightened, paralyzed, poisoned","ChallengeRating":17},{"Id":5,"Name":"Adult Blue Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":19,"HitPoints":225,"HitPointDistribution":"18d12","Speed":"40 ft., burrow 30 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"lightning","ConditionImmunities":"","ChallengeRating":16},{"Id":6,"Name":"Adult Brass Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticGood","ArmorClass":18,"HitPoints":172,"HitPointDistribution":"15d12","Speed":"40 ft., burrow 40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"fire","ConditionImmunities":"","ChallengeRating":13},{"Id":7,"Name":"Adult Bronze Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulGood","ArmorClass":19,"HitPoints":212,"HitPointDistribution":"17d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"lightning","ConditionImmunities":"","ChallengeRating":15},{"Id":8,"Name":"Adult Copper Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticGood","ArmorClass":18,"HitPoints":184,"HitPointDistribution":"16d12","Speed":"40 ft., climb 40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"acid","ConditionImmunities":"","ChallengeRating":14},{"Id":9,"Name":"Adult Gold Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulGood","ArmorClass":19,"HitPoints":256,"HitPointDistribution":"19d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"fire","ConditionImmunities":"","ChallengeRating":17},{"Id":10,"Name":"Adult Green Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":19,"HitPoints":207,"HitPointDistribution":"18d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"poison","ConditionImmunities":"poisoned","ChallengeRating":15},{"Id":11,"Name":"Adult Red Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticEvil","ArmorClass":19,"HitPoints":256,"HitPointDistribution":"19d12","Speed":"40 ft., climb 40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"fire","ConditionImmunities":"","ChallengeRating":17},{"Id":12,"Name":"Adult Silver Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulGood","ArmorClass":19,"HitPoints":243,"HitPointDistribution":"18d12","Speed":"40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"cold","ConditionImmunities":"","ChallengeRating":16}],
					total:326
				},
				);

			nock(API_URL)
			.get('/encounter/0')
			.reply(200, basicResponse);
			EncounterCRUDInstance = mount<EncounterCRUD, IEncounterCRUDProps, IEncounterCRUDState>(
				<BrowserRouter>
					<Switch>
						<Route exact path='/home' render={() => (
							<EncounterCRUD Process={EncounterCRUDState.Edit} Id={0} />
						)} />
						<Route exact path='/' render={() => (
							<Redirect push to='/home' />
						)} />
					</Switch>
				</BrowserRouter>
				);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the EncounterCRUD to request the mosnter from the database.
			expect(nock.isDone()).toEqual(true);
			done();
		});

		afterEach( () => {
			nock.cleanAll();
			scope.persist(false);
		});

		it('renders without crashing', () => {
			expect(EncounterCRUDInstance).toBeDefined();
			expect(EncounterCRUDInstance.find(EncounterCRUD).state().encounter.name).toEqual('Basic Encounter');
		});

		it('should redirect', () => {
			expect(EncounterCRUDInstance.find(EncounterCRUD).state().encounter.name).toEqual('Basic Encounter');
			EncounterCRUDInstance.find("EncounterCRUD").setState({ redirectToHome: true });
			EncounterCRUDInstance.update();
			expect(EncounterCRUDInstance.find(EncounterCRUD).state().encounter.name).toEqual('');
		});

		it('should redirect and back button', () => {
			EncounterCRUDInstance.find("Button#BackButton").simulate('click');
			EncounterCRUDInstance.update();
			expect(EncounterCRUDInstance.find(EncounterCRUD).state().encounter.name).toEqual('');
		});
	});

	const originalEncounter: IEncounterState = {
		Id: '0',
		Name: "Encounter",
		Description: "Example Description",
		Monsters: [] as IMonsterState[],
	}


// 	describe('render encounter from database', () => {
// 		beforeEach(async (done) => {
// 			nock.disableNetConnect();
// 			CookieManagerMock.SetStringCookie("session_token", "testToken");
// 			// bind the normal user token function to the mock.
// 			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
// 			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
// 			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
// 			nock(API_URL)
// 			.get('/encounter/0')
// 			.reply(200, {
// 				status: 201,
// 				messages: ['success'],
// 				content: originalEncounter
// 			});
// 			EncounterCRUDInstance = mount<EncounterCRUD, IEncounterCRUDProps, IEncounterCRUDState>(<EncounterCRUD Process={EncounterCRUDState.Edit} Id={0} />);
// 			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			// expect the EncounterCRUD to request the mosnter from the database.
// 			expect(nock.isDone()).toEqual(true);
// 			done();
// 		});

// 		afterEach( () => {
// 			nock.cleanAll();
// 		});

// 		it('renders without crashing', () => {
// 			expect(EncounterCRUDInstance).toBeDefined();
// 			expect(EncounterCRUDInstance.state('Monster')).toEqual(originalEncounter);
// 		});

// 		it('when no changes it sends the monster back as it was', async (done) => {
// 			// BIG TODO: fix speed editing
// 			nock(API_URL)
// 			.post('/monster/edit', originalEncounter)
// 			.reply(201, { status: 201, messages: ['success'] });
// 			EncounterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			EncounterCRUDInstance.update();
// 			expect(EncounterCRUDInstance.find('#ModalMessage').text()).toEqual("Monster successfully updated.");
// 			expect(EncounterCRUDInstance.find('Modal#EncounterCRUDModal').prop('isActive')).toEqual(true);
// 			expect(nock.isDone()).toEqual(true);
// 			done();
// 		});
// 	});

	describe('Server request Path for get', () => {

		beforeEach( () => {
			nock.disableNetConnect();
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);

			scope = nock(API_URL)
				.persist()
				.get('/monster/get/0/12')
				.reply(201,
					{ status:201,
					messages:['success'],
					content:[{"Id":1,"Name":"Aboleth","Size":"Large","Type":"Aberration","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":17,"HitPoints":135,"HitPointDistribution":"18d10","Speed":"10 ft., swim 40 ft.","Languages":"Deep Speech, telepathy 120 ft.","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"","ConditionImmunities":"","ChallengeRating":10},{"Id":2,"Name":"Acolyte","Size":"Medium","Type":"Humanoid","Race":"AnyRace","Environment":"Grassland","Alignment":"AnyAlignment","ArmorClass":10,"HitPoints":9,"HitPointDistribution":"2d8","Speed":"30 ft.","Languages":"any one language (usually Common)","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"","ConditionImmunities":"","ChallengeRating":0.25},{"Id":3,"Name":"Adult Black Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticEvil","ArmorClass":19,"HitPoints":195,"HitPointDistribution":"17d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"acid","ConditionImmunities":"","ChallengeRating":14},{"Id":4,"Name":"Adult Blue Dracolich","Size":"Huge","Type":"Undead","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":19,"HitPoints":225,"HitPointDistribution":"18d12","Speed":"40 ft., burrow 30 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"necrotic","DamageImmunities":"lightning, poison","ConditionImmunities":"charmed, exhaustion, frightened, paralyzed, poisoned","ChallengeRating":17},{"Id":5,"Name":"Adult Blue Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":19,"HitPoints":225,"HitPointDistribution":"18d12","Speed":"40 ft., burrow 30 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"lightning","ConditionImmunities":"","ChallengeRating":16},{"Id":6,"Name":"Adult Brass Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticGood","ArmorClass":18,"HitPoints":172,"HitPointDistribution":"15d12","Speed":"40 ft., burrow 40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"fire","ConditionImmunities":"","ChallengeRating":13},{"Id":7,"Name":"Adult Bronze Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulGood","ArmorClass":19,"HitPoints":212,"HitPointDistribution":"17d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"lightning","ConditionImmunities":"","ChallengeRating":15},{"Id":8,"Name":"Adult Copper Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticGood","ArmorClass":18,"HitPoints":184,"HitPointDistribution":"16d12","Speed":"40 ft., climb 40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"acid","ConditionImmunities":"","ChallengeRating":14},{"Id":9,"Name":"Adult Gold Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulGood","ArmorClass":19,"HitPoints":256,"HitPointDistribution":"19d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"fire","ConditionImmunities":"","ChallengeRating":17},{"Id":10,"Name":"Adult Green Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":19,"HitPoints":207,"HitPointDistribution":"18d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"poison","ConditionImmunities":"poisoned","ChallengeRating":15},{"Id":11,"Name":"Adult Red Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticEvil","ArmorClass":19,"HitPoints":256,"HitPointDistribution":"19d12","Speed":"40 ft., climb 40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"fire","ConditionImmunities":"","ChallengeRating":17},{"Id":12,"Name":"Adult Silver Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulGood","ArmorClass":19,"HitPoints":243,"HitPointDistribution":"18d12","Speed":"40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"cold","ConditionImmunities":"","ChallengeRating":16}],
					total:326
				},
				);
		});

		afterEach( () => {
			nock.cleanAll();
			scope.persist(false);
		});

		it('should show error message when API route not found', async (done) => {
			nock(API_URL)
			.get('/encounter/0')
			.reply(404);
			EncounterCRUDInstance = mount<EncounterCRUD, IEncounterCRUDProps, IEncounterCRUDState>(<EncounterCRUD Process={EncounterCRUDState.Edit} Id={0} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the EncounterCRUD to request the mosnter from the database.
			EncounterCRUDInstance.update();
			expect(EncounterCRUDInstance.find('#ModalMessage').text()).toEqual("There was an error sending your request.");
			expect(EncounterCRUDInstance.find('Modal#encounterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you', async (done) => {
			nock(API_URL)
			.get('/encounter/0')
			.reply(200, { status: 400, messages: ["Encounter not found."]});
			EncounterCRUDInstance = mount<EncounterCRUD, IEncounterCRUDProps, IEncounterCRUDState>(<EncounterCRUD Process={EncounterCRUDState.Edit} Id={0} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the EncounterCRUD to request the mosnter from the database.
			EncounterCRUDInstance.update();
			expect(EncounterCRUDInstance.find('#ModalMessage').text()).toEqual("Error finding encounter: Encounter not found.");
			expect(EncounterCRUDInstance.find('Modal#encounterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you without any messages', async (done) => {
			nock(API_URL)
			.get('/encounter/0')
			.reply(200, { status: 401 });
			EncounterCRUDInstance = mount<EncounterCRUD, IEncounterCRUDProps, IEncounterCRUDState>(<EncounterCRUD Process={EncounterCRUDState.Edit} Id={0} />);
			// THREE IS REQUIRED, SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the EncounterCRUD to request the mosnter from the database.
			EncounterCRUDInstance.update();
			expect(EncounterCRUDInstance.find('#ModalMessage').text()).toEqual("There was an error retreiving the encounter. Please try again later.");
			expect(EncounterCRUDInstance.find('Modal#encounterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});
	});

// 	describe('Server request Path for submit', () => {

// 		beforeEach(async (done) => {
// 			nock.disableNetConnect();
// 			CookieManagerMock.SetStringCookie("session_token", "testToken");
// 			// bind the normal user token function to the mock.
// 			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
// 			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
// 			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
// 			nock(API_URL)
// 			.get('/monster/0')
// 			.reply(200, basicResponse);
// 			EncounterCRUDInstance = mount<EncounterCRUD, IEncounterCRUDProps, IEncounterCRUDState>(<EncounterCRUD Process={EncounterCRUDState.Edit} Id={0} />);
// 			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			// expect the EncounterCRUD to request the mosnter from the database.
// 			expect(nock.isDone()).toEqual(true);
// 			done();
// 		});

// 		afterEach( () => {
// 			nock.cleanAll();
// 		});

// 		it('renders without crashing', () => {
// 			expect(EncounterCRUDInstance).toBeDefined();
// 		});

// 		it('should be able to send monster name only to edit', async (done) => {
// 			EncounterCRUDInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
// 			nock(API_URL)
// 			.post('/monster/edit', {
// 				"Id": 0,
// 				"Name": "Hello",
// 				"AbilityScores": {},
// 				"SavingThrows": {},
// 				"Skills": {},
// 				"Senses": {}
// 			})
// 			.reply(201, { status: 201, messages: ['success'] });
// 			EncounterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			EncounterCRUDInstance.update();
// 			expect(EncounterCRUDInstance.find('#ModalMessage').text()).toEqual("Monster successfully updated.");
// 			expect(EncounterCRUDInstance.find('Modal#EncounterCRUDModal').prop('isActive')).toEqual(true);
// 			expect(nock.isDone()).toEqual(true);
// 			done();
// 		});

// 		it('should show error message when API route not found', async (done) => {
// 			EncounterCRUDInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
// 			nock(API_URL)
// 			.post('/monster/edit', {
// 				"Id": 0,
// 				"Name": "Hello",
// 				"AbilityScores": {},
// 				"SavingThrows": {},
// 				"Skills": {},
// 				"Senses": {}
// 			})
// 			.reply(404);
// 			EncounterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			EncounterCRUDInstance.update();
// 			expect(EncounterCRUDInstance.find('#ModalMessage').text()).toEqual("There was an error sending your request.");
// 			expect(EncounterCRUDInstance.find('Modal#EncounterCRUDModal').prop('isActive')).toEqual(true);
// 			expect(nock.isDone()).toEqual(true);
// 			done();
// 		});

// 		it('should show error message when server denies you', async (done) => {
// 			EncounterCRUDInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
// 			nock(API_URL)
// 			.post('/monster/edit', {
// 				"Id": 0,
// 				"Name": "Hello",
// 				"AbilityScores": {},
// 				"SavingThrows": {},
// 				"Skills": {},
// 				"Senses": {}
// 			})
// 			.reply(200, { status: 400, messages: ["Invalid monster object"]});
// 			EncounterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			EncounterCRUDInstance.update();
// 			expect(EncounterCRUDInstance.find('#ModalMessage').text()).toEqual("Invalid monster object");
// 			expect(EncounterCRUDInstance.find('Modal#EncounterCRUDModal').prop('isActive')).toEqual(true);
// 			expect(nock.isDone()).toEqual(true);
// 			done();
// 		});

// 		it('should show error message when server denies you without any messages', async (done) => {
// 			EncounterCRUDInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
// 			nock(API_URL)
// 			.post('/monster/edit', {
// 				"Id": 0,
// 				"Name": "Hello",
// 				"AbilityScores": {},
// 				"SavingThrows": {},
// 				"Skills": {},
// 				"Senses": {}
// 			})
// 			.reply(200, { status: 401 });
// 			EncounterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			EncounterCRUDInstance.update();
// 			expect(EncounterCRUDInstance.find('#ModalMessage').text()).toEqual("There was an error submitting your request. Please try again later.");
// 			expect(EncounterCRUDInstance.find('Modal#EncounterCRUDModal').prop('isActive')).toEqual(true);
// 			expect(nock.isDone()).toEqual(true);
// 			done();
// 		});

// 		it('should show payload error message when monster is not properly formed', async (done) => {
// 			EncounterCRUDInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
// 			EncounterCRUDInstance.find('input#AbilityScoresStrength').simulate('change', { target: { value: -1 } })
// 			EncounterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			EncounterCRUDInstance.update();
// 			expect(EncounterCRUDInstance.find('#ModalMessage').text()).toEqual("\"Strength\" must be greater than 0");
// 			expect(EncounterCRUDInstance.find('Modal#EncounterCRUDModal').prop('isActive')).toEqual(true);
// 			done();
// 		});

// 		it('should show payload error message when monster has an invalid skill', async (done) => {
// 			EncounterCRUDInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
// 			EncounterCRUDInstance.find('MonsterSkillBonuses').setState({ "InvalidSkillName": 100 })
// 			EncounterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			EncounterCRUDInstance.update();
// 			expect(EncounterCRUDInstance.find('#ModalMessage').text()).toEqual("\"InvalidSkillName\" is not allowed");
// 			expect(EncounterCRUDInstance.find('Modal#EncounterCRUDModal').prop('isActive')).toEqual(true);
// 			done();
// 		});

// 		it('should show payload error message when monster has an invalid Size', async (done) => {
// 			EncounterCRUDInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
// 			EncounterCRUDInstance.find('MonsterEnumConfiguration').setState({ Size: "InvalidSize" })
// 			EncounterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			await new Promise(resolve => setImmediate(resolve));
// 			EncounterCRUDInstance.update();
// 			expect(EncounterCRUDInstance.find('#ModalMessage').text()).toEqual("\"Size\" must be one of Tiny,Small,Medium,Large,Huge,Gargantuan");
// 			expect(EncounterCRUDInstance.find('Modal#EncounterCRUDModal').prop('isActive')).toEqual(true);
// 			done();
// 		});

// 	});

	describe('Happy Path', () => {

		beforeEach(async (done) => {
			nock.disableNetConnect();
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);

			scope = nock(API_URL)
				.persist()
				.get('/monster/get/0/12')
				.reply(201,
					{ status:201,
					messages:['success'],
					content:[{"Id":1,"Name":"Aboleth","Size":"Large","Type":"Aberration","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":17,"HitPoints":135,"HitPointDistribution":"18d10","Speed":"10 ft., swim 40 ft.","Languages":"Deep Speech, telepathy 120 ft.","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"","ConditionImmunities":"","ChallengeRating":10},{"Id":2,"Name":"Acolyte","Size":"Medium","Type":"Humanoid","Race":"AnyRace","Environment":"Grassland","Alignment":"AnyAlignment","ArmorClass":10,"HitPoints":9,"HitPointDistribution":"2d8","Speed":"30 ft.","Languages":"any one language (usually Common)","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"","ConditionImmunities":"","ChallengeRating":0.25},{"Id":3,"Name":"Adult Black Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticEvil","ArmorClass":19,"HitPoints":195,"HitPointDistribution":"17d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"acid","ConditionImmunities":"","ChallengeRating":14},{"Id":4,"Name":"Adult Blue Dracolich","Size":"Huge","Type":"Undead","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":19,"HitPoints":225,"HitPointDistribution":"18d12","Speed":"40 ft., burrow 30 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"necrotic","DamageImmunities":"lightning, poison","ConditionImmunities":"charmed, exhaustion, frightened, paralyzed, poisoned","ChallengeRating":17},{"Id":5,"Name":"Adult Blue Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":19,"HitPoints":225,"HitPointDistribution":"18d12","Speed":"40 ft., burrow 30 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"lightning","ConditionImmunities":"","ChallengeRating":16},{"Id":6,"Name":"Adult Brass Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticGood","ArmorClass":18,"HitPoints":172,"HitPointDistribution":"15d12","Speed":"40 ft., burrow 40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"fire","ConditionImmunities":"","ChallengeRating":13},{"Id":7,"Name":"Adult Bronze Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulGood","ArmorClass":19,"HitPoints":212,"HitPointDistribution":"17d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"lightning","ConditionImmunities":"","ChallengeRating":15},{"Id":8,"Name":"Adult Copper Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticGood","ArmorClass":18,"HitPoints":184,"HitPointDistribution":"16d12","Speed":"40 ft., climb 40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"acid","ConditionImmunities":"","ChallengeRating":14},{"Id":9,"Name":"Adult Gold Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulGood","ArmorClass":19,"HitPoints":256,"HitPointDistribution":"19d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"fire","ConditionImmunities":"","ChallengeRating":17},{"Id":10,"Name":"Adult Green Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulEvil","ArmorClass":19,"HitPoints":207,"HitPointDistribution":"18d12","Speed":"40 ft., fly 80 ft., swim 40 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"poison","ConditionImmunities":"poisoned","ChallengeRating":15},{"Id":11,"Name":"Adult Red Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"ChaoticEvil","ArmorClass":19,"HitPoints":256,"HitPointDistribution":"19d12","Speed":"40 ft., climb 40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"fire","ConditionImmunities":"","ChallengeRating":17},{"Id":12,"Name":"Adult Silver Dragon","Size":"Huge","Type":"Dragon","Race":"AnyRace","Environment":"Grassland","Alignment":"LawfulGood","ArmorClass":19,"HitPoints":243,"HitPointDistribution":"18d12","Speed":"40 ft., fly 80 ft.","Languages":"Common, Draconic","DamageVulnerabilities":"","DamageResistances":"","DamageImmunities":"cold","ConditionImmunities":"","ChallengeRating":16}],
					total:326
				},
				);

			nock(API_URL)
			.get('/encounter/0')
			.reply(200, {
				status: 201,
				messages: ['success'],
				content: originalEncounter
			});
			EncounterCRUDInstance = mount<EncounterCRUD, IEncounterCRUDProps, IEncounterCRUDState>(<EncounterCRUD Process={EncounterCRUDState.Edit} Id={0} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the EncounterCRUD to request the mosnter from the database.
			expect(nock.isDone()).toEqual(true);
			done();
		});

		afterEach( () => {
			nock.cleanAll();
			scope.persist(false);
		});

		it('should be able to edit all and send monster to server edit', async (done) => {
			EncounterCRUDInstance.find('Input#encounter_name').simulate('change', { target: { value: 'New Encounter' } });
			expect(EncounterCRUDInstance.state().encounter.name).toEqual('New Encounter');
			nock(API_URL)
			.post('/encounter/edit', {
				"Id": 0,
				"Name": "New Encounter",
				"Description": "Example Description",
				"Monsters": [] as IMonsterState[],
			})
			.reply(201, { status: 201, messages: ['success'] });
			EncounterCRUDInstance.instance().createEncounter({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			EncounterCRUDInstance.update();
			expect(EncounterCRUDInstance.find('#ModalMessage').text()).toEqual("Hooray, the encounter is successfully saved!");
			expect(EncounterCRUDInstance.find('Modal#encounterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		describe('should show and hide modal', () => {
			it('show modal', () => {
				EncounterCRUDInstance.instance().closeModal();
				EncounterCRUDInstance.update();
				expect(EncounterCRUDInstance.find('Modal#encounterCRUDModal').prop('isActive')).toEqual(false);
				EncounterCRUDInstance.instance().openModal('TestMessage');
				EncounterCRUDInstance.update();
				expect(EncounterCRUDInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				expect(EncounterCRUDInstance.find('Modal#encounterCRUDModal').prop('isActive')).toEqual(true);
			});

			it('close modal', () => {
				EncounterCRUDInstance.instance().openModal('TestMessage');
				EncounterCRUDInstance.update();
				expect(EncounterCRUDInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				expect(EncounterCRUDInstance.find('Modal#encounterCRUDModal').prop('isActive')).toEqual(true);
				EncounterCRUDInstance.instance().closeModal();
				EncounterCRUDInstance.update();
				expect(EncounterCRUDInstance.find('Modal#encounterCRUDModal').prop('isActive')).toEqual(false);
			});

			it('close modal by click', () => {
				EncounterCRUDInstance.instance().openModal('TestMessage');
				EncounterCRUDInstance.update();
				expect(EncounterCRUDInstance.find('#ModalMessage').text().length).toBeGreaterThan(0);
				expect(EncounterCRUDInstance.find('Modal#encounterCRUDModal').prop('isActive')).toEqual(true);
				let background = EncounterCRUDInstance.find('ModalBackground#modalBackground')
				background.simulate('click');
				EncounterCRUDInstance.update();
				expect(EncounterCRUDInstance.find('Modal#encounterCRUDModal').prop('isActive')).toEqual(false);
			});
		});
	})

})