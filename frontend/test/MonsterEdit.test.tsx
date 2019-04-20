import * as React from 'react';
import * as nock from 'nock';
import { mount, ReactWrapper } from 'enzyme';

import { MonsterCRUD, IMonsterCRUDState, IMonsterCRUDProps, MonsterCRUDState, IMonsterGetOneResponse } from "../src/renderer/components/MonsterCRUD";

import {API_URL} from '../src/config'
import { CookieManager as CookieManagerMock } from "../src/__mocks__/cookie";
import { CookieManager } from "../src/cookie";
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { IMonsterState } from '../src/monster';

jest.mock('../src/cookie');

////// Happy Path //////

describe('Monster CRUD', () => {

	let monsterCRUDInstance: ReactWrapper<IMonsterCRUDProps, IMonsterCRUDState, MonsterCRUD>;

	const basicResponse: IMonsterGetOneResponse = {
		status: 201,
		messages: ['success'],
		content: {
			Id: 0,
			Name: 'Basic Monster',
			AbilityScores:{},
			SavingThrows:{},
			Skills:{},
			Senses:{}
		}
	}

	describe('Redirect if submitted', () => {
		beforeEach(async (done) => {
			nock.disableNetConnect();
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
			nock(API_URL)
			.get('/monster/0')
			.reply(200, basicResponse);
			monsterCRUDInstance = mount<MonsterCRUD, IMonsterCRUDProps, IMonsterCRUDState>(
				<BrowserRouter>
					<Switch>
						<Route exact path='/home' render={() => (
							<MonsterCRUD Process={MonsterCRUDState.Edit} Id={0} />
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
			// expect the MonsterCRUD to request the mosnter from the database.
			expect(nock.isDone()).toEqual(true);
			done();
		});

		afterEach( () => {
			nock.cleanAll();
		});

		it('renders without crashing', () => {
			expect(monsterCRUDInstance).toBeDefined();
			expect(monsterCRUDInstance.find(MonsterCRUD).state().Name).toEqual('Basic Monster');
		});

		it('should redirect', () => {
			expect(monsterCRUDInstance.find(MonsterCRUD).state().Name).toEqual('Basic Monster');
			monsterCRUDInstance.find("MonsterCRUD").setState({ submitted: true });
			monsterCRUDInstance.update();
			expect(monsterCRUDInstance.find(MonsterCRUD).state().Name).toEqual('');
		});

		it('should redirect and back button', () => {
			monsterCRUDInstance.find("Button#BackButton").simulate('click');
			monsterCRUDInstance.update();
			expect(monsterCRUDInstance.find(MonsterCRUD).state().Name).toEqual('');
		});
	});

	const originalMonster: IMonsterState = {
		Id: 0,
		Name: "Hello Original",
		Type: "Celestial",
		Alignment: "AnyGoodAlignment",
		Size: "Gargantuan",
		Race: "Devil",
		Environment: "Underdark",
		DamageVulnerabilities: "Everything",
		DamageResistances: "None at all",
		DamageImmunities: "Nada",
		ConditionImmunities: "Nothing",
		ArmorClass: 15,
		HitPoints: 40,
		HitPointDistribution: "9d5-5",
		// BIG TODO: fix speed editing - users have to re enter speed
		//  everytime they edit a monster otherwise it will be deleted.
		//"Speed": "25ft. Swimming Speed: 15 ft.",
		AbilityScores: {
			Strength: 17,
			Dexterity: 15,
			Constitution: 13,
			Intelligence: 12,
			Wisdom: 16,
			Charisma: 15
		},
		SavingThrows: {
			Strength: -3,
			Dexterity: 0,
			Constitution: -1,
			Intelligence: -2,
			Wisdom: 8,
			Charisma: 9
		},
		Skills: {
			Athletics: 9,
			Acrobatics: 10,
			"Sleight of Hand": 9,
			Stealth: 8,
			Arcana: 7,
			History: 7,
			Investigation: 6,
			Nature: 7,
			Religion: 8,
			"Animal Handling": 9,
			Insight: 10,
			Medicine: 12,
			Perception: 15,
			Survival: 11,
			Deception: 10,
			Intimidation: 9,
			Performance: 7,
			Persuasion: 4,
		},
		Senses: {
			Blind: 30,
			Blindsight: 30,
			Darkvision: 10,
			Tremorsense: 15,
			Truesight: 60,
			"Passive Perception": 13,
			"Passive Investigation": 14,
			"Passive Insight": 16,
		},
		Languages: "Common and Draconic",
		ChallengeRating: 2.5,
	}

	/*let editMonster: IMonsterState = {
		Id: 0,
		Name: "Hello Original",
		Type: "Celestial",
		Alignment: "AnyGoodAlignment",
		Size: "Gargantuan",
		Race: "Devil",
		Environment: "Underdark",
		DamageVulnerabilities: "Everything",
		DamageResistances: "None at all",
		DamageImmunities: "Nada",
		ConditionImmunities: "Nothing",
		ArmorClass: 15,
		HitPoints: 40,
		HitPointDistribution: "9d5-5",
		Speed: "25ft. Swimming Speed: 15 ft.",
		AbilityScores: {
			Strength: 17,
			Dexterity: 15,
			Constitution: 13,
			Intelligence: 12,
			Wisdom: 16,
			Charisma: 15
		},
		SavingThrows: {
			Strength: -3,
			Dexterity: 0,
			Constitution: -1,
			Intelligence: -2,
			Wisdom: 8,
			Charisma: 9
		},
		Skills: {
			Athletics: 9,
			Acrobatics: 10,
			"Sleight of Hand": 9,
			Stealth: 8,
			Arcana: 7,
			History: 7,
			Investigation: 6,
			Nature: 7,
			Religion: 8,
			"Animal Handling": 9,
			Insight: 10,
			Medicine: 12,
			Perception: 15,
			Survival: 11,
			Deception: 10,
			Intimidation: 9,
			Performance: 7,
			Persuasion: 4,
		},
		Senses: {
			Blind: 30,
			Blindsight: 30,
			Darkvision: 10,
			Tremorsense: 15,
			Truesight: 60,
			"Passive Perception": 13,
			"Passive Investigation": 14,
			"Passive Insight": 16,
		},
		Languages: "Common and Draconic",
		ChallengeRating: 2.5,
	}*/

	describe('render monster from database', () => {
		beforeEach(async (done) => {
			nock.disableNetConnect();
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
			nock(API_URL)
			.get('/monster/0')
			.reply(200, {
				status: 201,
				messages: ['success'],
				content: originalMonster
			});
			monsterCRUDInstance = mount<MonsterCRUD, IMonsterCRUDProps, IMonsterCRUDState>(<MonsterCRUD Process={MonsterCRUDState.Edit} Id={0} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the MonsterCRUD to request the mosnter from the database.
			expect(nock.isDone()).toEqual(true);
			done();
		});

		afterEach( () => {
			nock.cleanAll();
		});

		it('renders without crashing', () => {
			expect(monsterCRUDInstance).toBeDefined();
			expect(monsterCRUDInstance.state('Monster')).toEqual(originalMonster);
		});

		it('when no changes it sends the monster back as it was', async (done) => {
			// BIG TODO: fix speed editing
			nock(API_URL)
			.post('/monster/edit', originalMonster)
			.reply(201, { status: 201, messages: ['success'] });
			monsterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			monsterCRUDInstance.update();
			expect(monsterCRUDInstance.find('#ModalMessage').text()).toEqual("Monster successfully updated.");
			expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});
	});

	describe('Server request Path for get', () => {

		beforeEach( () => {
			nock.disableNetConnect();
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
		});

		afterEach( () => {
			nock.cleanAll();
		});

		it('should show error message when API route not found', async (done) => {
			nock(API_URL)
			.get('/monster/0')
			.reply(404);
			monsterCRUDInstance = mount<MonsterCRUD, IMonsterCRUDProps, IMonsterCRUDState>(<MonsterCRUD Process={MonsterCRUDState.Edit} Id={0} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the MonsterCRUD to request the mosnter from the database.
			monsterCRUDInstance.update();
			expect(monsterCRUDInstance.find('#ModalMessage').text()).toEqual("There was an error sending your request.");
			expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you', async (done) => {
			nock(API_URL)
			.get('/monster/0')
			.reply(200, { status: 400, messages: ["Monster not found."]});
			monsterCRUDInstance = mount<MonsterCRUD, IMonsterCRUDProps, IMonsterCRUDState>(<MonsterCRUD Process={MonsterCRUDState.Edit} Id={0} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the MonsterCRUD to request the mosnter from the database.
			monsterCRUDInstance.update();
			expect(monsterCRUDInstance.find('#ModalMessage').text()).toEqual("Error finding monster: Monster not found.");
			expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you without any messages', async (done) => {
			nock(API_URL)
			.get('/monster/0')
			.reply(200, { status: 401 });
			monsterCRUDInstance = mount<MonsterCRUD, IMonsterCRUDProps, IMonsterCRUDState>(<MonsterCRUD Process={MonsterCRUDState.Edit} Id={0} />);
			// THREE IS REQUIRED, SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the MonsterCRUD to request the mosnter from the database.
			monsterCRUDInstance.update();
			expect(monsterCRUDInstance.find('#ModalMessage').text()).toEqual("There was an error retreiving the monster. Please try again later.");
			expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});
	});

	describe('Server request Path for submit', () => {

		beforeEach(async (done) => {
			nock.disableNetConnect();
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
			nock(API_URL)
			.get('/monster/0')
			.reply(200, basicResponse);
			monsterCRUDInstance = mount<MonsterCRUD, IMonsterCRUDProps, IMonsterCRUDState>(<MonsterCRUD Process={MonsterCRUDState.Edit} Id={0} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the MonsterCRUD to request the mosnter from the database.
			expect(nock.isDone()).toEqual(true);
			done();
		});

		afterEach( () => {
			nock.cleanAll();
		});

		it('renders without crashing', () => {
			expect(monsterCRUDInstance).toBeDefined();
		});

		it('should be able to send monster name only to edit', async (done) => {
			monsterCRUDInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/monster/edit', {
				"Id": 0,
				"Name": "Hello",
				"AbilityScores": {},
				"SavingThrows": {},
				"Skills": {},
				"Senses": {}
			})
			.reply(201, { status: 201, messages: ['success'] });
			monsterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			monsterCRUDInstance.update();
			expect(monsterCRUDInstance.find('#ModalMessage').text()).toEqual("Monster successfully updated.");
			expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when API route not found', async (done) => {
			monsterCRUDInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/monster/edit', {
				"Id": 0,
				"Name": "Hello",
				"AbilityScores": {},
				"SavingThrows": {},
				"Skills": {},
				"Senses": {}
			})
			.reply(404);
			monsterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			monsterCRUDInstance.update();
			expect(monsterCRUDInstance.find('#ModalMessage').text()).toEqual("There was an error sending your request.");
			expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you', async (done) => {
			monsterCRUDInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/monster/edit', {
				"Id": 0,
				"Name": "Hello",
				"AbilityScores": {},
				"SavingThrows": {},
				"Skills": {},
				"Senses": {}
			})
			.reply(200, { status: 400, messages: ["Invalid monster object"]});
			monsterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			monsterCRUDInstance.update();
			expect(monsterCRUDInstance.find('#ModalMessage').text()).toEqual("Invalid monster object");
			expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you without any messages', async (done) => {
			monsterCRUDInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/monster/edit', {
				"Id": 0,
				"Name": "Hello",
				"AbilityScores": {},
				"SavingThrows": {},
				"Skills": {},
				"Senses": {}
			})
			.reply(200, { status: 401 });
			monsterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			monsterCRUDInstance.update();
			expect(monsterCRUDInstance.find('#ModalMessage').text()).toEqual("There was an error submitting your request. Please try again later.");
			expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show payload error message when monster is not properly formed', async (done) => {
			monsterCRUDInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
			monsterCRUDInstance.find('input#AbilityScoresStrength').simulate('change', { target: { value: -1 } })
			monsterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			monsterCRUDInstance.update();
			expect(monsterCRUDInstance.find('#ModalMessage').text()).toEqual("\"Strength\" must be greater than 0");
			expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(true);
			done();
		});

		it('should show payload error message when monster has an invalid skill', async (done) => {
			monsterCRUDInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
			monsterCRUDInstance.find('MonsterSkillBonuses').setState({ "InvalidSkillName": 100 })
			monsterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			monsterCRUDInstance.update();
			expect(monsterCRUDInstance.find('#ModalMessage').text()).toEqual("\"InvalidSkillName\" is not allowed");
			expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(true);
			done();
		});

		it('should show payload error message when monster has an invalid Size', async (done) => {
			monsterCRUDInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
			monsterCRUDInstance.find('MonsterEnumConfiguration').setState({ Size: "InvalidSize" })
			monsterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			monsterCRUDInstance.update();
			expect(monsterCRUDInstance.find('#ModalMessage').text()).toEqual("\"Size\" must be one of Tiny,Small,Medium,Large,Huge,Gargantuan");
			expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(true);
			done();
		});

	});

	describe('Happy Path', () => {

		beforeEach(async (done) => {
			nock.disableNetConnect();
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
			nock(API_URL)
			.get('/monster/0')
			.reply(200, {
				status: 201,
				messages: ['success'],
				content: originalMonster
			});
			monsterCRUDInstance = mount<MonsterCRUD, IMonsterCRUDProps, IMonsterCRUDState>(<MonsterCRUD Process={MonsterCRUDState.Edit} Id={0} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the MonsterCRUD to request the mosnter from the database.
			expect(nock.isDone()).toEqual(true);
			done();
		});

		afterEach( () => {
			nock.cleanAll();
		});

		it('should be able to edit all and send monster to server edit', async (done) => {
			monsterCRUDInstance.find('Input#Name').simulate('change', { target: { value: 'New Hello' } })
			monsterCRUDInstance.find('select#Type').simulate('change', { target: { value: "Undead" } })
			monsterCRUDInstance.find('select#Size').simulate('change', { target: { value: "Small" } })
			monsterCRUDInstance.find('select#Race').simulate('change', { target: { value: "Titan" } })
			monsterCRUDInstance.find('select#Environment').simulate('change', { target: { value: "Coastal" } })
			monsterCRUDInstance.find('select#Alignment').simulate('change', { target: { value: "AnyNonLawfulAlignment" } })
			monsterCRUDInstance.find('input#DamageVulnerabilities').simulate('change', { target: { value: 'New Everything' } })
			monsterCRUDInstance.find('input#DamageResistances').simulate('change', { target: { value: 'New None at all' } })
			monsterCRUDInstance.find('input#DamageImmunities').simulate('change', { target: { value: 'New Nada' } })
			monsterCRUDInstance.find('input#ConditionImmunities').simulate('change', { target: { value: 'New Nothing' } })
			monsterCRUDInstance.find('input#ArmorClass').simulate('change', { target: { value: 20 } })
			monsterCRUDInstance.find('input#HitPoints').simulate('change', { target: { value: 45 } })
			monsterCRUDInstance.find('input#HitPointDistribution').simulate('change', { target: { value: '9d5-10' } })
			monsterCRUDInstance.find('input#SpeedLand').simulate('change', { target: { value: 30 } })
			monsterCRUDInstance.find('input#SpeedSwim').simulate('change', { target: { value: 20 } })
			monsterCRUDInstance.find('input#AbilityScoresStrength').simulate('change', { target: { value: 23 } })
			monsterCRUDInstance.find('input#AbilityScoresDexterity').simulate('change', { target: { value: 20 } })
			monsterCRUDInstance.find('input#AbilityScoresConstitution').simulate('change', { target: { value: 18 } })
			monsterCRUDInstance.find('input#AbilityScoresIntelligence').simulate('change', { target: { value: 17 } })
			monsterCRUDInstance.find('input#AbilityScoresWisdom').simulate('change', { target: { value: 21 } })
			monsterCRUDInstance.find('input#AbilityScoresCharisma').simulate('change', { target: { value: 20 } })
			monsterCRUDInstance.find('input#SavingThrowsStrength').simulate('change', { target: { value: -8 } })
			monsterCRUDInstance.find('input#SavingThrowsDexterity').simulate('change', { target: { value: -5 } })
			monsterCRUDInstance.find('input#SavingThrowsConstitution').simulate('change', { target: { value: -6 } })
			monsterCRUDInstance.find('input#SavingThrowsIntelligence').simulate('change', { target: { value: -7 } })
			monsterCRUDInstance.find('input#SavingThrowsWisdom').simulate('change', { target: { value: 3 } })
			monsterCRUDInstance.find('input#SavingThrowsCharisma').simulate('change', { target: { value: 4 } })
			monsterCRUDInstance.find('input#Athletics').simulate('change', { target: { value: 14 } })
			monsterCRUDInstance.find('input#Acrobatics').simulate('change', { target: { value: 15 } })
			monsterCRUDInstance.find('input[id="Sleight of Hand"]').simulate('change', { target: { value: 14 } })
			monsterCRUDInstance.find('input#Stealth').simulate('change', { target: { value: 13 } })
			monsterCRUDInstance.find('input#Arcana').simulate('change', { target: { value: 12 } })
			monsterCRUDInstance.find('input#History').simulate('change', { target: { value: 12 } })
			monsterCRUDInstance.find('input#Investigation').simulate('change', { target: { value: 11 } })
			monsterCRUDInstance.find('input#Nature').simulate('change', { target: { value: 12 } })
			monsterCRUDInstance.find('input#Religion').simulate('change', { target: { value: 13 } })
			monsterCRUDInstance.find('input[id="Animal Handling"]').simulate('change', { target: { value: 14 } })
			monsterCRUDInstance.find('input#Insight').simulate('change', { target: { value: 15 } })
			monsterCRUDInstance.find('input#Medicine').simulate('change', { target: { value: 17 } })
			monsterCRUDInstance.find('input#Perception').simulate('change', { target: { value: 20 } })
			monsterCRUDInstance.find('input#Survival').simulate('change', { target: { value: 16 } })
			monsterCRUDInstance.find('input#Deception').simulate('change', { target: { value: 15 } })
			monsterCRUDInstance.find('input#Intimidation').simulate('change', { target: { value: 14 } })
			monsterCRUDInstance.find('input#Performance').simulate('change', { target: { value: 12 } })
			monsterCRUDInstance.find('input#Persuasion').simulate('change', { target: { value: 9 } })
			monsterCRUDInstance.find('input#Blind').simulate('change', { target: { value: 35 } })
			monsterCRUDInstance.find('input#Blindsight').simulate('change', { target: { value: 35 } })
			monsterCRUDInstance.find('input#Darkvision').simulate('change', { target: { value: 15} })
			monsterCRUDInstance.find('input#Tremorsense').simulate('change', { target: { value: 20 } })
			monsterCRUDInstance.find('input#Truesight').simulate('change', { target: { value: 65 } })
			monsterCRUDInstance.find('input[id="Passive Perception"]').simulate('change', { target: { value: 18 } })
			monsterCRUDInstance.find('input[id="Passive Investigation"]').simulate('change', { target: { value: 19 } })
			monsterCRUDInstance.find('input[id="Passive Insight"]').simulate('change', { target: { value: 21 } })
			monsterCRUDInstance.find('Input#Languages').simulate('change', { target: { value: 'New Common and Draconic' } })
			monsterCRUDInstance.find('Input#ChallengeRating').simulate('change', { target: { value: 7.5 } })
			monsterCRUDInstance.find('Input#ExperiencePoints').simulate('change', { target: { value: 195 } })
			//console.log(monsterCRUDInstance.state())
			expect(monsterCRUDInstance.state()).toEqual({
				Process: MonsterCRUDState.Edit,
				Id: 0,
				Name: 'New Hello',
				NameError: undefined,
				ChallengeRating: 7.5,
				ChallengeRatingError: undefined,
				ExperiencePoints: 195,
				Monster: originalMonster,
				submitted: false,
				modal: {
					open: false,
					message: ""
				},
			})
			nock(API_URL)
			.post('/monster/edit', {
				"Id": 0,
				"Name": "New Hello",
				"Type": "Undead",
				"Alignment": "AnyNonLawfulAlignment",
				"Size": "Small",
				"Race": "Titan",
				"Environment": "Coastal",
				"DamageVulnerabilities": "New Everything",
				"DamageResistances": "New None at all",
				"DamageImmunities": "New Nada",
				"ConditionImmunities": "New Nothing",
				"ArmorClass": 20,
				"HitPoints": 45,
				"HitPointDistribution": "9d5-10",
				"Speed": "30ft. Swimming Speed: 20 ft.",
				"AbilityScores": {
					"Strength": 23,
					"Dexterity": 20,
					"Constitution": 18,
					"Intelligence": 17,
					"Wisdom": 21,
					"Charisma": 20
				},
				"SavingThrows": {
					"Strength": -8,
					"Dexterity": -5,
					"Constitution": -6,
					"Intelligence": -7,
					"Wisdom": 3,
					"Charisma": 4
				},
				"Skills": {
					"Athletics": 14,
					"Acrobatics": 15,
					"Sleight of Hand": 14,
					"Stealth": 13,
					"Arcana": 12,
					"History": 12,
					"Investigation": 11,
					"Nature": 12,
					"Religion": 13,
					"Animal Handling": 14,
					"Insight": 15,
					"Medicine": 17,
					"Perception": 20,
					"Survival": 16,
					"Deception": 15,
					"Intimidation": 14,
					"Performance": 12,
					"Persuasion": 9,
				},
				"Senses": {
					"Blind": 35,
					"Blindsight": 35,
					"Darkvision": 15,
					"Tremorsense": 20,
					"Truesight": 65,
					"Passive Perception": 18,
					"Passive Investigation": 19,
					"Passive Insight": 21,
				},
				"Languages": "New Common and Draconic",
				"ChallengeRating": 7.5,
				//abilities: [],
				//actions: [],
			})
			.reply(201, { status: 201, messages: ['success'] });
			monsterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			monsterCRUDInstance.update();
			expect(monsterCRUDInstance.find('#ModalMessage').text()).toEqual("Monster successfully updated.");
			expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		describe('should show and hide modal', () => {
			it('show modal', () => {
				monsterCRUDInstance.instance().closeModal();
				monsterCRUDInstance.update();
				expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(false);
				monsterCRUDInstance.instance().openModal('TestMessage');
				monsterCRUDInstance.update();
				expect(monsterCRUDInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(true);
			});

			it('close modal', () => {
				monsterCRUDInstance.instance().openModal('TestMessage');
				monsterCRUDInstance.update();
				expect(monsterCRUDInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(true);
				monsterCRUDInstance.instance().closeModal();
				monsterCRUDInstance.update();
				expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(false);
			});

			it('close modal by click', () => {
				monsterCRUDInstance.instance().openModal('TestMessage');
				monsterCRUDInstance.update();
				expect(monsterCRUDInstance.find('#ModalMessage').text().length).toBeGreaterThan(0);
				expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(true);
				let background = monsterCRUDInstance.find('ModalBackground#modalBackground')
				background.simulate('click');
				monsterCRUDInstance.update();
				expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(false);
			});
		});
	})
	// input.simulate('change', { target: { value: 'Hello' } })

////// Sad Paths: To Fix Later, Enzyme is not Cooperating//////

	describe("Sad paths", () => {
			/*it('should direct to home page if not logged in', () => {

				CookieManager.prototype.UserAuthenticated = jest.fn().mockImplementationOnce(() => {
					return false
				});
				expect(monsterCRUDInstance.find('.landing-container')).toExist();
			});

			it('should display error messages if values are incorrect', () => {

					monsterCRUDInstance.setState({
							submitted: false,
							monster: {
								name: "Hello",
								type: Monster.MonsterType.Aberration,
								alignment: Monster.MonsterAlignment.AnyAlignment,
								size: Monster.MonsterSize.Medium,
								race: Monster.MonsterRace.AnyRace,
								environment: Monster.MonsterEnvironment.Arctic,
								resistance: "Everything",
								damageImmunity: "None at all",
								conditionImmunity: "Nada",
								vulnerability: "Nothing",
								armorClass: -15,
								hitPoints: -40,
								hitPointDice: "9x5",
								hitPointDiceAdd: -5,
								speedLand: -25,
								speedSwim: -15,
								strStat: -17,
								dexStat: -15,
								conStat: -13,
								intStat: -12,
								wisStat: -16,
								chaStat: -15,
								strSavingThrow: -3,
								dexSavingThrow: 0,
								conSavingThrow: -1,
								intSavingThrow: -2,
								wisSavingThrow: 8,
								chaSavingThrow: 9,
								skillsAthletics: 9,
								skillsAcrobatics: 19,
								skillsSleightOfHand: 9,
								skillsStealth: 8,
								skillsArcana: 7,
								skillsHistory: 7,
								skillsInvestigation: 6,
								skillsNature: 7,
								skillsReligion: 8,
								skillsAnimalHandling: 9,
								skillsInsight: 10,
								skillsMedicine: 12,
								skillsPerception: 15,
								skillsSurvival: 11,
								skillsDeception: 10,
								skillsIntimidation: 9,
								skillsPerformance: 7,
								skillsPersuasion: 4,
								sensesBlindsight: 30,
								sensesDarkvision: 10,
								sensesTremorsense: 15,
								sensesTruesight: 60,
								sensesPassivePerception: 13,
								sensesPassiveInvestigation: 14,
								sensesPassiveInsight: 16,
								languages: "Common and Draconic",
								challengeRating: -2.5,
								experiencePoints: -190,
								abilities: [],
								actions: [],
							}
					})

					console.log(monsterCRUDInstance.find('#armorClass').text())
					expect(monsterCRUDInstance.dive().text().includes("Your armor class must be above 0")).toBe(true);

					/*
					expect(monsterCRUDInstance.find("#hitPoints").find({helperText: "You cannot have a negative base HP."})).toExist();
					expect(monsterCRUDInstance.find({helperText: "You must provide your hitpoint dice in the xdy format (i.e. 4d6)"})).toExist();
					expect(monsterCRUDInstance.find({helperText: "You cannot have a negative land speed."})).toExist();
					expect(monsterCRUDInstance.find({helperText: "You cannot have a negative swimming speed."})).toExist();
					expect(monsterCRUDInstance.find({helperText: "You cannot have a negative strength stat."})).toExist();
					expect(monsterCRUDInstance.find({helperText: "You cannot have a negative dexterity stat."})).toExist();
					expect(monsterCRUDInstance.find({helperText: "You cannot have a negative constitution stat."})).toExist();
					expect(monsterCRUDInstance.find({helperText: "You cannot have a negative intelligence stat."})).toExist();
					expect(monsterCRUDInstance.find({helperText: "You cannot have a negative wisdom stat."})).toExist();
					expect(monsterCRUDInstance.find({helperText: "You cannot have a negative charisma stat."})).toExist();
					expect(monsterCRUDInstance.find({helperText: "You cannot have a negative challenge rating."})).toExist();
					expect(monsterCRUDInstance.find({helperText: "You cannot have negative experience points."})).toExist();
				})*/
		})
})