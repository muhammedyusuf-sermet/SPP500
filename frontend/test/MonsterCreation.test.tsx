import * as React from "react"
import { shallow, ShallowWrapper } from 'enzyme';
import { MonsterCreation, MonsterAlignmentDropdown, MonsterEnvironmentDropdown, MonsterRaceDropdown, MonsterSizeDropdown, MonsterTypeDropdown, IMonsterCreationState } from "../src/renderer/components/MonsterCreation";

import * as Monster from "../src/monster";
import * as nock from 'nock';
import {API_URL} from '../src/config'

import { CookieManager as CookieManagerMock } from "../src/__mocks__/cookie";
import { CookieManager } from "../src/cookie";
////// Happy Path //////
jest.mock('../src/cookie');

describe('Monster Creation', () => {

	let monsterCreationInstance: ShallowWrapper<any, IMonsterCreationState, MonsterCreation>;

	describe('Happy Path', () => {

		beforeEach(() => {
			// set the user as logged in.
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			monsterCreationInstance = shallow (<MonsterCreation/>);
		})

		it('renders without crashing', () => {
			expect(monsterCreationInstance).toBeDefined();
		});

		it('renders correctly when the page is loaded', () => {
			expect(monsterCreationInstance).toMatchSnapshot();
		});

		it('should be able to update state', () => {
			monsterCreationInstance.find('#name').simulate('change', { target: { value: 'Hello' } })
			monsterCreationInstance.find(MonsterTypeDropdown).dive().find('#type').simulate('change', { target: { value: "Celestial" } })
			monsterCreationInstance.find(MonsterSizeDropdown).dive().find('#size').simulate('change', { target: { value: "Gargantuan" } })
			monsterCreationInstance.find(MonsterRaceDropdown).dive().find('#race').simulate('change', { target: { value: "Devil" } })
			monsterCreationInstance.find(MonsterEnvironmentDropdown).dive().find('#environment').simulate('change', { target: { value: "Underdark" } })
			monsterCreationInstance.find(MonsterAlignmentDropdown).dive().find('#alignment').simulate('change', { target: { value: "Any Good Alignment" } })
			monsterCreationInstance.find('#resistance').simulate('change', { target: { value: 'Everything' } })
			monsterCreationInstance.find('#damageImmunity').simulate('change', { target: { value: 'None at all' } })
			monsterCreationInstance.find('#conditionImmunity').simulate('change', { target: { value: 'Nada' } })
			monsterCreationInstance.find('#vulnerability').simulate('change', { target: { value: 'Nothing' } })
			monsterCreationInstance.find('#armorClass').simulate('change', { target: { value: 15 } })
			monsterCreationInstance.find('#hitPoints').simulate('change', { target: { value: 40 } })
			monsterCreationInstance.find('#hitPointDice').simulate('change', { target: { value: '9d5' } })
			monsterCreationInstance.find('#hitPointModifier').simulate('change', { target: { value: -5 } })
			monsterCreationInstance.find('#landSpeed').simulate('change', { target: { value: 25 } })
			monsterCreationInstance.find('#swimmingSpeed').simulate('change', { target: { value: 15 } })
			monsterCreationInstance.find('#strength').simulate('change', { target: { value: 17 } })
			monsterCreationInstance.find('#dexterity').simulate('change', { target: { value: 15 } })
			monsterCreationInstance.find('#constitution').simulate('change', { target: { value: 13 } })
			monsterCreationInstance.find('#intelligence').simulate('change', { target: { value: 12 } })
			monsterCreationInstance.find('#wisdom').simulate('change', { target: { value: 16 } })
			monsterCreationInstance.find('#charisma').simulate('change', { target: { value: 15 } })
			monsterCreationInstance.find('#strengthSavingThrow').simulate('change', { target: { value: -3 } })
			monsterCreationInstance.find('#dexteritySavingThrow').simulate('change', { target: { value: 0 } })
			monsterCreationInstance.find('#constitutionSavingThrow').simulate('change', { target: { value: -1 } })
			monsterCreationInstance.find('#intelligenceSavingThrow').simulate('change', { target: { value: -2 } })
			monsterCreationInstance.find('#wisdomSavingThrow').simulate('change', { target: { value: 8 } })
			monsterCreationInstance.find('#charismaSavingThrow').simulate('change', { target: { value: 9 } })
			monsterCreationInstance.find('#athletics').simulate('change', { target: { value: 9 } })
			monsterCreationInstance.find('#acrobatics').simulate('change', { target: { value: 10 } })
			monsterCreationInstance.find('#sleightOfHand').simulate('change', { target: { value: 9 } })
			monsterCreationInstance.find('#stealth').simulate('change', { target: { value: 8 } })
			monsterCreationInstance.find('#arcana').simulate('change', { target: { value: 7 } })
			monsterCreationInstance.find('#history').simulate('change', { target: { value: 7 } })
			monsterCreationInstance.find('#investigation').simulate('change', { target: { value: 6 } })
			monsterCreationInstance.find('#nature').simulate('change', { target: { value: 7 } })
			monsterCreationInstance.find('#religion').simulate('change', { target: { value: 8 } })
			monsterCreationInstance.find('#animalHandling').simulate('change', { target: { value: 9 } })
			monsterCreationInstance.find('#insight').simulate('change', { target: { value: 10 } })
			monsterCreationInstance.find('#medicine').simulate('change', { target: { value: 12 } })
			monsterCreationInstance.find('#perception').simulate('change', { target: { value: 15 } })
			monsterCreationInstance.find('#survival').simulate('change', { target: { value: 11 } })
			monsterCreationInstance.find('#deception').simulate('change', { target: { value: 10 } })
			monsterCreationInstance.find('#intimidation').simulate('change', { target: { value: 9 } })
			monsterCreationInstance.find('#performance').simulate('change', { target: { value: 7 } })
			monsterCreationInstance.find('#persuasion').simulate('change', { target: { value: 4 } })
			monsterCreationInstance.find('#blindsight').simulate('change', { target: { value: 30 } })
			monsterCreationInstance.find('#darkvision').simulate('change', { target: { value: 10} })
			monsterCreationInstance.find('#tremorsense').simulate('change', { target: { value: 15 } })
			monsterCreationInstance.find('#truesight').simulate('change', { target: { value: 60 } })
			monsterCreationInstance.find('#passivePerception').simulate('change', { target: { value: 13 } })
			monsterCreationInstance.find('#passiveInvestigation').simulate('change', { target: { value: 14 } })
			monsterCreationInstance.find('#passiveInsight').simulate('change', { target: { value: 16 } })
			monsterCreationInstance.find('#languages').simulate('change', { target: { value: 'Common and Draconic' } })
			monsterCreationInstance.find('#challengeRating').simulate('change', { target: { value: 2.5 } })
			monsterCreationInstance.find('#experiencePoints').simulate('change', { target: { value: 190 } })
			//console.log(monsterCreationInstance.state())
			expect(monsterCreationInstance.state()).toEqual({
					submitted: false,
					model: {
						open: false,
						message: ""
					},
					monster: {
						name: "Hello",
						type: Monster.MonsterType.Celestial,
						alignment: Monster.MonsterAlignment.AnyGoodAlignment,
						size: Monster.MonsterSize.Gargantuan,
						race: Monster.MonsterRace.Devil,
						environment: Monster.MonsterEnvironment.Underdark,
						resistance: "Everything",
						damageImmunity: "None at all",
						conditionImmunity: "Nada",
						vulnerability: "Nothing",
						armorClass: 15,
						hitPoints: 40,
						hitPointDice: "9d5",
						hitPointDiceAdd: -5,
						speedLand: 25,
						speedSwim: 15,
						strStat: 17,
						dexStat: 15,
						conStat: 13,
						intStat: 12,
						wisStat: 16,
						chaStat: 15,
						strSavingThrow: -3,
						dexSavingThrow: 0,
						conSavingThrow: -1,
						intSavingThrow: -2,
						wisSavingThrow: 8,
						chaSavingThrow: 9,
						skillsAthletics: 9,
						skillsAcrobatics: 10,
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
						challengeRating: 2.5,
						experiencePoints: 190,
						abilities: [],
						actions: [],
					}
			})
			nock(API_URL)
			.post('/monster/create', {
					"Name": "Hello",
					"Size": "Gargantuan",
					"Type": "Celestial",
					"Race": "Devil",
					"Environment": "Underdark",
					"Alignment": "AnyGoodAlignment",
					"ArmorClass": 15,
					"HitPoints": 40,
					"HitPointDistribution": "9d5-5",
					"Speed": "25ft. Swimming Speed: 15 ft.",
					"Senses" : "Blindsight: 30 ft. Darkvision: 10 ft. Tremorsense: 15 ft. Truesight: 60 ft. Passive Insight: 16. Passive Investigation: 14. Passive Perception: 13.",
					"Languages": "Common and Draconic",
					"DamageVulnerabilities": "Nothing",
					"DamageResistances": "Everything",
					"DamageImmunities": "None at all",
					"ConditionImmunities": "Nada",
					"ChallengeRating": 2.5,
					"ExperiencePoints": 190,
					"AbilityScores": {
						"Strength": 17,
						"Dexterity": 15,
						"Constitution": 13,
						"Intelligence": 12,
						"Wisdom": 16,
						"Charisma": 15,
					},
					"SavingThrows": {
						"Strength": -3,
						"Dexterity": 0,
						"Constitution": -1,
						"Intelligence": -2,
						"Wisdom": 8,
						"Charisma": 9,
					},
					"Skills": {
						"Acrobatics": 10,
						"Animal Handling": 9,
						"Arcana": 7,
						"Athletics": 9,
						"Deception": 10,
						"History": 7,
						"Insight": 10,
						"Intimidation": 9,
						"Investigation": 6,
						"Medicine": 12,
						"Nature": 7,
						"Perception": 15,
						"Performance": 7,
						"Persuasion": 4,
						"Religion": 8,
						"Sleight of Hand": 9,
						"Stealth": 8,
						"Survival": 11,
					}

				})
			.reply(201, {
				body: [{ status:201, message: 'success' }],
			});
			monsterCreationInstance.find('form').simulate('submit', { preventDefault () {} });
		});

		it('should change only types when type is changed', () => {
			monsterCreationInstance.find(MonsterTypeDropdown).dive().find('#type').simulate('change', { target: { value: "Celestial" } })
			expect(monsterCreationInstance.state().monster.type).toEqual(Monster.MonsterType.Celestial);
		})

		it('should change only alignment when alignment is changed', () => {
			monsterCreationInstance.find(MonsterAlignmentDropdown).dive().find('#alignment').simulate('change', { target: { value: "Lawful Good" } })
			expect(monsterCreationInstance.state().monster.alignment).toEqual(Monster.MonsterAlignment.LawfulGood);
		})

		it('should change only size when size is changed', () => {
			monsterCreationInstance.find(MonsterSizeDropdown).dive().find('#size').simulate('change', { target: { value: "Tiny" } })
			expect(monsterCreationInstance.state().monster.size).toEqual(Monster.MonsterSize.Tiny);
		})

		it('should change only races when race is changed', () => {
			monsterCreationInstance.find(MonsterRaceDropdown).dive().find('#race').simulate('change', { target: { value: "Orc" } })
			expect(monsterCreationInstance.state().monster.race).toEqual(Monster.MonsterRace.Orc);
		})

		it('should change only environments when environment is changed', () => {
			monsterCreationInstance.find(MonsterEnvironmentDropdown).dive().find('#environment').simulate('change', { target: { value: "Swamp" } })
			expect(monsterCreationInstance.state().monster.environment).toEqual(Monster.MonsterEnvironment.Swamp);
		})
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