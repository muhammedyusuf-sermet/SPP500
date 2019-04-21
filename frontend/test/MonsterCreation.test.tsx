import * as React from 'react';
import * as nock from 'nock';
import { mount, shallow, ReactWrapper } from 'enzyme';
import { MonsterCRUD, IMonsterCRUDState, IMonsterCRUDProps, MonsterCRUDState } from "../src/renderer/components/MonsterCRUD";

import {API_URL} from '../src/config'
import { CookieManager as CookieManagerMock } from "../src/__mocks__/cookie";
import { CookieManager } from "../src/cookie";
import { BrowserRouter } from 'react-router-dom';

jest.mock('../src/cookie');

////// Happy Path //////


describe('Monster CRUD', () => {

	let monsterCRUDInstance: ReactWrapper<IMonsterCRUDProps, IMonsterCRUDState, MonsterCRUD>;

	describe('Redirect if submitted', () => {
		beforeEach(() => {
			nock.disableNetConnect();
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
			monsterCRUDInstance = mount<MonsterCRUD, IMonsterCRUDProps, IMonsterCRUDState>(<BrowserRouter><MonsterCRUD Process={MonsterCRUDState.Create} /></BrowserRouter>);
		})

		it('renders without crashing', () => {
			expect(monsterCRUDInstance).toBeDefined();
		});

		it('should redirect', () => {
			expect(monsterCRUDInstance.find('Redirect')).toHaveLength(0);
			monsterCRUDInstance.find("MonsterCRUD").setState({ submitted: true });
			monsterCRUDInstance.update();
			expect(monsterCRUDInstance.find('Redirect')).toHaveLength(1);
		});
	});

	describe('Happy Path', () => {

		beforeEach(() => {
			nock.disableNetConnect();
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
			monsterCRUDInstance = mount<MonsterCRUD, IMonsterCRUDProps, IMonsterCRUDState>(<MonsterCRUD Process={MonsterCRUDState.Create} />);
		})

		it('renders without crashing', () => {
			expect(monsterCRUDInstance).toBeDefined();
		});

		it('renders correctly when the page is loaded', () => {
			const shallowMonsterCrud = shallow<MonsterCRUD, IMonsterCRUDProps, IMonsterCRUDState>(<MonsterCRUD Process={MonsterCRUDState.Create} />);

			expect(shallowMonsterCrud).toMatchSnapshot();
		});

		it('should be able to send monster name only to create', async (done) => {
			monsterCRUDInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/monster/create', {
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
			expect(monsterCRUDInstance.find('#ModalMessage').text()).toEqual("Monster successfully created.");
			expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when API route not found', async (done) => {
			monsterCRUDInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/monster/create', {
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
			.post('/monster/create', {
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
			.post('/monster/create', {
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

		it('should be able to send monster to create', async (done) => {
			monsterCRUDInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
			monsterCRUDInstance.find('select#Type').simulate('change', { target: { value: "Celestial" } })
			monsterCRUDInstance.find('select#Size').simulate('change', { target: { value: "Gargantuan" } })
			monsterCRUDInstance.find('select#Race').simulate('change', { target: { value: "Devil" } })
			monsterCRUDInstance.find('select#Environment').simulate('change', { target: { value: "Underdark" } })
			monsterCRUDInstance.find('select#Alignment').simulate('change', { target: { value: "AnyGoodAlignment" } })
			monsterCRUDInstance.find('input#DamageVulnerabilities').simulate('change', { target: { value: 'Everything' } })
			monsterCRUDInstance.find('input#DamageResistances').simulate('change', { target: { value: 'None at all' } })
			monsterCRUDInstance.find('input#DamageImmunities').simulate('change', { target: { value: 'Nada' } })
			monsterCRUDInstance.find('input#ConditionImmunities').simulate('change', { target: { value: 'Nothing' } })
			monsterCRUDInstance.find('input#ArmorClass').simulate('change', { target: { value: 15 } })
			monsterCRUDInstance.find('input#HitPoints').simulate('change', { target: { value: 40 } })
			monsterCRUDInstance.find('input#HitPointDistribution').simulate('change', { target: { value: '9d5-5' } })
			monsterCRUDInstance.find('input#SpeedLand').simulate('change', { target: { value: 25 } })
			monsterCRUDInstance.find('input#SpeedSwim').simulate('change', { target: { value: 15 } })
			monsterCRUDInstance.find('input#AbilityScoresStrength').simulate('change', { target: { value: 17 } })
			monsterCRUDInstance.find('input#AbilityScoresDexterity').simulate('change', { target: { value: 15 } })
			monsterCRUDInstance.find('input#AbilityScoresConstitution').simulate('change', { target: { value: 13 } })
			monsterCRUDInstance.find('input#AbilityScoresIntelligence').simulate('change', { target: { value: 12 } })
			monsterCRUDInstance.find('input#AbilityScoresWisdom').simulate('change', { target: { value: 16 } })
			monsterCRUDInstance.find('input#AbilityScoresCharisma').simulate('change', { target: { value: 15 } })
			monsterCRUDInstance.find('input#SavingThrowsStrength').simulate('change', { target: { value: -3 } })
			monsterCRUDInstance.find('input#SavingThrowsDexterity').simulate('change', { target: { value: 0 } })
			monsterCRUDInstance.find('input#SavingThrowsConstitution').simulate('change', { target: { value: -1 } })
			monsterCRUDInstance.find('input#SavingThrowsIntelligence').simulate('change', { target: { value: -2 } })
			monsterCRUDInstance.find('input#SavingThrowsWisdom').simulate('change', { target: { value: 8 } })
			monsterCRUDInstance.find('input#SavingThrowsCharisma').simulate('change', { target: { value: 9 } })
			monsterCRUDInstance.find('input#Athletics').simulate('change', { target: { value: 9 } })
			monsterCRUDInstance.find('input#Acrobatics').simulate('change', { target: { value: 10 } })
			monsterCRUDInstance.find('input[id="Sleight of Hand"]').simulate('change', { target: { value: 9 } })
			monsterCRUDInstance.find('input#Stealth').simulate('change', { target: { value: 8 } })
			monsterCRUDInstance.find('input#Arcana').simulate('change', { target: { value: 7 } })
			monsterCRUDInstance.find('input#History').simulate('change', { target: { value: 7 } })
			monsterCRUDInstance.find('input#Investigation').simulate('change', { target: { value: 6 } })
			monsterCRUDInstance.find('input#Nature').simulate('change', { target: { value: 7 } })
			monsterCRUDInstance.find('input#Religion').simulate('change', { target: { value: 8 } })
			monsterCRUDInstance.find('input[id="Animal Handling"]').simulate('change', { target: { value: 9 } })
			monsterCRUDInstance.find('input#Insight').simulate('change', { target: { value: 10 } })
			monsterCRUDInstance.find('input#Medicine').simulate('change', { target: { value: 12 } })
			monsterCRUDInstance.find('input#Perception').simulate('change', { target: { value: 15 } })
			monsterCRUDInstance.find('input#Survival').simulate('change', { target: { value: 11 } })
			monsterCRUDInstance.find('input#Deception').simulate('change', { target: { value: 10 } })
			monsterCRUDInstance.find('input#Intimidation').simulate('change', { target: { value: 9 } })
			monsterCRUDInstance.find('input#Performance').simulate('change', { target: { value: 7 } })
			monsterCRUDInstance.find('input#Persuasion').simulate('change', { target: { value: 4 } })
			monsterCRUDInstance.find('input#Blind').simulate('change', { target: { value: 30 } })
			monsterCRUDInstance.find('input#Blindsight').simulate('change', { target: { value: 30 } })
			monsterCRUDInstance.find('input#Darkvision').simulate('change', { target: { value: 10} })
			monsterCRUDInstance.find('input#Tremorsense').simulate('change', { target: { value: 15 } })
			monsterCRUDInstance.find('input#Truesight').simulate('change', { target: { value: 60 } })
			monsterCRUDInstance.find('input[id="Passive Perception"]').simulate('change', { target: { value: 13 } })
			monsterCRUDInstance.find('input[id="Passive Investigation"]').simulate('change', { target: { value: 14 } })
			monsterCRUDInstance.find('input[id="Passive Insight"]').simulate('change', { target: { value: 16 } })
			monsterCRUDInstance.find('Input#Languages').simulate('change', { target: { value: 'Common and Draconic' } })
			monsterCRUDInstance.find('Input#ChallengeRating').simulate('change', { target: { value: 2.5 } })
			monsterCRUDInstance.find('Input#ExperiencePoints').simulate('change', { target: { value: 190 } })
			//console.log(monsterCRUDInstance.state())
			expect(monsterCRUDInstance.state()).toEqual({
				Process: MonsterCRUDState.Create,
				Id: undefined,
				Name: 'Hello',
				NameError: undefined,
				ChallengeRating: 2.5,
				ChallengeRatingError: undefined,
				ExperiencePoints: 190,
				Monster: {
					Name: '',
					AbilityScores: {},
					SavingThrows: {},
					Senses: {},
					Skills: {}
				},
				submitted: false,
				modal: {
					open: false,
					message: ""
				},
			})
			nock(API_URL)
			.post('/monster/create', {
				"Name": "Hello",
				"Type": "Celestial",
				"Alignment": "AnyGoodAlignment",
				"Size": "Gargantuan",
				"Race": "Devil",
				"Environment": "Underdark",
				"DamageVulnerabilities": "Everything",
				"DamageResistances": "None at all",
				"DamageImmunities": "Nada",
				"ConditionImmunities": "Nothing",
				"ArmorClass": 15,
				"HitPoints": 40,
				"HitPointDistribution": "9d5-5",
				"Speed": "25ft. Swimming Speed: 15 ft.",
				"AbilityScores": {
					"Strength": 17,
					"Dexterity": 15,
					"Constitution": 13,
					"Intelligence": 12,
					"Wisdom": 16,
					"Charisma": 15
				},
				"SavingThrows": {
					"Strength": -3,
					"Dexterity": 0,
					"Constitution": -1,
					"Intelligence": -2,
					"Wisdom": 8,
					"Charisma": 9
				},
				"Skills": {
					"Athletics": 9,
					"Acrobatics": 10,
					"Sleight of Hand": 9,
					"Stealth": 8,
					"Arcana": 7,
					"History": 7,
					"Investigation": 6,
					"Nature": 7,
					"Religion": 8,
					"Animal Handling": 9,
					"Insight": 10,
					"Medicine": 12,
					"Perception": 15,
					"Survival": 11,
					"Deception": 10,
					"Intimidation": 9,
					"Performance": 7,
					"Persuasion": 4,
				},
				"Senses": {
					"Blind": 30,
					"Blindsight": 30,
					"Darkvision": 10,
					"Tremorsense": 15,
					"Truesight": 60,
					"Passive Perception": 13,
					"Passive Investigation": 14,
					"Passive Insight": 16,
				},
				"Languages": "Common and Draconic",
				"ChallengeRating": 2.5,
				//abilities: [],
				//actions: [],
			})
			.reply(201, { status: 201, message: 'success' });
			monsterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			monsterCRUDInstance.update();
			expect(monsterCRUDInstance.find('#ModalMessage').text()).toEqual("Monster successfully created.");
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