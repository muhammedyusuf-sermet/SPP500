import * as React from 'react';
import * as nock from 'nock';
import { mount, ReactWrapper } from 'enzyme';
import { MonsterCreation, IMonsterCreationState, IMonsterCreationProps } from "../src/renderer/components/MonsterCreation";

import {API_URL} from '../src/config'
import { CookieManager as CookieManagerMock } from "../src/__mocks__/cookie";
import { CookieManager } from "../src/cookie";

jest.mock('../src/cookie');

////// Happy Path //////


describe('Monster Creation', () => {

	let monsterCreationInstance: ReactWrapper<IMonsterCreationProps, IMonsterCreationState, MonsterCreation>;

	describe('Happy Path', () => {

		beforeEach(() => {
			nock.disableNetConnect();
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
			monsterCreationInstance = mount<MonsterCreation, IMonsterCreationProps, IMonsterCreationState>(<MonsterCreation />);
		})

		it('renders without crashing', () => {
			expect(monsterCreationInstance).toBeDefined();
		});

		/*it('renders correctly when the page is loaded', () => {
			expect(monsterCreationInstance).toMatchSnapshot();
		});*/

		it('should be able to send monster to create', async (done) => {
			monsterCreationInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
			monsterCreationInstance.find('select#Type').simulate('change', { target: { value: "Celestial" } })
			monsterCreationInstance.find('select#Size').simulate('change', { target: { value: "Gargantuan" } })
			monsterCreationInstance.find('select#Race').simulate('change', { target: { value: "Devil" } })
			monsterCreationInstance.find('select#Environment').simulate('change', { target: { value: "Underdark" } })
			monsterCreationInstance.find('select#Alignment').simulate('change', { target: { value: "AnyGoodAlignment" } })
			monsterCreationInstance.find('Input#DamageVulnerabilities').simulate('change', { target: { value: 'Everything' } })
			monsterCreationInstance.find('Input#DamageResistances').simulate('change', { target: { value: 'None at all' } })
			monsterCreationInstance.find('Input#DamageImmunities').simulate('change', { target: { value: 'Nada' } })
			monsterCreationInstance.find('Input#ConditionImmunities').simulate('change', { target: { value: 'Nothing' } })
			monsterCreationInstance.find('Input#ArmorClass').simulate('change', { target: { value: 15 } })
			monsterCreationInstance.find('Input#HitPoints').simulate('change', { target: { value: 40 } })
			monsterCreationInstance.find('Input#HitPointDistribution').simulate('change', { target: { value: '9d5-5' } })
			monsterCreationInstance.find('Input#SpeedLand').simulate('change', { target: { value: 25 } })
			monsterCreationInstance.find('Input#SpeedSwim').simulate('change', { target: { value: 15 } })
			monsterCreationInstance.find('Input#Athletics').simulate('change', { target: { value: 9 } })
			monsterCreationInstance.find('Input#Acrobatics').simulate('change', { target: { value: 10 } })
			monsterCreationInstance.find('Input[id="Sleight of Hand"]').simulate('change', { target: { value: 9 } })
			monsterCreationInstance.find('Input#Stealth').simulate('change', { target: { value: 8 } })
			monsterCreationInstance.find('Input#Arcana').simulate('change', { target: { value: 7 } })
			monsterCreationInstance.find('Input#History').simulate('change', { target: { value: 7 } })
			monsterCreationInstance.find('Input#Investigation').simulate('change', { target: { value: 6 } })
			monsterCreationInstance.find('Input#Nature').simulate('change', { target: { value: 7 } })
			monsterCreationInstance.find('Input#Religion').simulate('change', { target: { value: 8 } })
			monsterCreationInstance.find('Input[id="Animal Handling"]').simulate('change', { target: { value: 9 } })
			monsterCreationInstance.find('Input#Insight').simulate('change', { target: { value: 10 } })
			monsterCreationInstance.find('Input#Medicine').simulate('change', { target: { value: 12 } })
			monsterCreationInstance.find('Input#Perception').simulate('change', { target: { value: 15 } })
			monsterCreationInstance.find('Input#Survival').simulate('change', { target: { value: 11 } })
			monsterCreationInstance.find('Input#Deception').simulate('change', { target: { value: 10 } })
			monsterCreationInstance.find('Input#Intimidation').simulate('change', { target: { value: 9 } })
			monsterCreationInstance.find('Input#Performance').simulate('change', { target: { value: 7 } })
			monsterCreationInstance.find('Input#Persuasion').simulate('change', { target: { value: 4 } })
			monsterCreationInstance.find('Input#Blind').simulate('change', { target: { value: 30 } })
			monsterCreationInstance.find('Input#Blindsight').simulate('change', { target: { value: 30 } })
			monsterCreationInstance.find('Input#Darkvision').simulate('change', { target: { value: 10} })
			monsterCreationInstance.find('Input#Tremorsense').simulate('change', { target: { value: 15 } })
			monsterCreationInstance.find('Input#Truesight').simulate('change', { target: { value: 60 } })
			monsterCreationInstance.find('Input[id="Passive Perception"]').simulate('change', { target: { value: 13 } })
			monsterCreationInstance.find('Input[id="Passive Investigation"]').simulate('change', { target: { value: 14 } })
			monsterCreationInstance.find('Input[id="Passive Insight"]').simulate('change', { target: { value: 16 } })
			monsterCreationInstance.find('Input#Languages').simulate('change', { target: { value: 'Common and Draconic' } })
			monsterCreationInstance.find('Input#ChallengeRating').simulate('change', { target: { value: 2.5 } })
			monsterCreationInstance.find('Input#ExperiencePoints').simulate('change', { target: { value: 190 } })
			//console.log(monsterCreationInstance.state())
			const expectedMonster = {
				Name: "Hello",
				AbilityScores: {},
				SavingThrows: {},
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
				//abilities: [],
				//actions: [],
			};
			const expectedErrors = {
				Name: undefined,
				AbilityScores: {},
				SavingThrows: {},
				Skills: {
					Athletics: undefined,
					Acrobatics: undefined,
					"Sleight of Hand": undefined,
					Stealth: undefined,
					Arcana: undefined,
					History: undefined,
					Investigation: undefined,
					Nature: undefined,
					Religion: undefined,
					"Animal Handling": undefined,
					Insight: undefined,
					Medicine: undefined,
					Perception: undefined,
					Survival: undefined,
					Deception: undefined,
					Intimidation: undefined,
					Performance: undefined,
					Persuasion: undefined,
				},
				Senses: {
					Blind: undefined,
					Blindsight: undefined,
					Darkvision: undefined,
					Tremorsense: undefined,
					Truesight: undefined,
					"Passive Perception": undefined,
					"Passive Investigation": undefined,
					"Passive Insight": undefined,
				},
				Languages: undefined,
				ChallengeRating: undefined,
				//abilities: [],
				//actions: [],
			};
			expect(monsterCreationInstance.state()).toEqual({
					submitted: false,
					modal: {
						open: false,
						message: ""
					},
					SpeedLand: 25,
					SpeedSwim: 15,
					ExperiencePoints: 190,
					monster: expectedMonster,
					monsterErrors: expectedErrors
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
					"SleightOfHand": 9,
					"Stealth": 8,
					"Arcana": 7,
					"History": 7,
					"Investigation": 6,
					"Nature": 7,
					"Religion": 8,
					"AnimalHandling": 9,
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
			await monsterCreationInstance.instance().validateForm({ preventDefault() {} } as React.FormEvent);
			expect(nock.isDone()).toEqual(true);
			done();
		});
	})
	// input.simulate('change', { target: { value: 'Hello' } })

////// Sad Paths: To Fix Later, Enzyme is not Cooperating//////

	describe("Sad paths", () => {
			/*it('should direct to home page if not logged in', () => {

				CookieManager.prototype.UserAuthenticated = jest.fn().mockImplementationOnce(() => {
					return false
				});
				expect(monsterCreationInstance.find('.landing-container')).toExist();
			});

			it('should display error messages if values are incorrect', () => {

					monsterCreationInstance.setState({
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

					console.log(monsterCreationInstance.find('#armorClass').text())
					expect(monsterCreationInstance.dive().text().includes("Your armor class must be above 0")).toBe(true);

					/*
					expect(monsterCreationInstance.find("#hitPoints").find({helperText: "You cannot have a negative base HP."})).toExist();
					expect(monsterCreationInstance.find({helperText: "You must provide your hitpoint dice in the xdy format (i.e. 4d6)"})).toExist();
					expect(monsterCreationInstance.find({helperText: "You cannot have a negative land speed."})).toExist();
					expect(monsterCreationInstance.find({helperText: "You cannot have a negative swimming speed."})).toExist();
					expect(monsterCreationInstance.find({helperText: "You cannot have a negative strength stat."})).toExist();
					expect(monsterCreationInstance.find({helperText: "You cannot have a negative dexterity stat."})).toExist();
					expect(monsterCreationInstance.find({helperText: "You cannot have a negative constitution stat."})).toExist();
					expect(monsterCreationInstance.find({helperText: "You cannot have a negative intelligence stat."})).toExist();
					expect(monsterCreationInstance.find({helperText: "You cannot have a negative wisdom stat."})).toExist();
					expect(monsterCreationInstance.find({helperText: "You cannot have a negative charisma stat."})).toExist();
					expect(monsterCreationInstance.find({helperText: "You cannot have a negative challenge rating."})).toExist();
					expect(monsterCreationInstance.find({helperText: "You cannot have negative experience points."})).toExist();
				})*/
		})
})