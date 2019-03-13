import * as React from "react";
import * as nock from 'nock';
import { shallow, ShallowWrapper } from 'enzyme';
import { MonsterCreation, MonsterDropdown, IMonsterCreationState, IMonsterCreationProps } from "../src/renderer/components/MonsterCreation";

import {API_URL} from '../src/config'
import { MonsterType, Alignment, Size, MonsterRace, Environment } from "../src/monster";
import { CookieManager } from '../src/__mocks__/cookie';

jest.mock('../src/cookie.ts');

////// Happy Path //////


describe('Monster Creation', () => {

	let monsterCreationInstance: ShallowWrapper<IMonsterCreationProps, IMonsterCreationState, MonsterCreation>;

	describe('Happy Path', () => {

		beforeEach(() => {
			CookieManager.SetStringCookie('session_token', 'hello');
			nock.disableNetConnect();
			monsterCreationInstance = shallow(<MonsterCreation />);
		})

		it('renders without crashing', () => {
			expect(monsterCreationInstance).toBeDefined();
		});

		/*it('renders correctly when the page is loaded', () => {
			expect(monsterCreationInstance).toMatchSnapshot();
		});*/

		it('should be able to update state', () => {
			monsterCreationInstance.find('#name').simulate('change', { target: { value: 'Hello' } })
			monsterCreationInstance.find(MonsterDropdown).find('[name="Type"]').dive().find('#Type.Celestial').simulate('click', { target: { value: "Celestial" } })
			monsterCreationInstance.find(MonsterDropdown).find('[name="Size"]').dive().find('#Size.Gargantuan').simulate('click', { target: { value: "Gargantuan" } })
			monsterCreationInstance.find(MonsterDropdown).find('[name="Race"]').dive().find('#Race.Devil').simulate('click', { target: { value: "Devil" } })
			monsterCreationInstance.find(MonsterDropdown).find('[name="Environment"]').dive().find('#Environment.Underdark').simulate('click', { target: { value: "Underdark" } })
			monsterCreationInstance.find(MonsterDropdown).find('[name="Alignment"]').dive().find('#Alignment.AnyGoodAlignment').simulate('click', { target: { value: "AnyGoodAlignment" } })
			monsterCreationInstance.find('#DamageVulnerabilities').simulate('change', { target: { value: 'Everything' } })
			monsterCreationInstance.find('#DamageResistance').simulate('change', { target: { value: 'None at all' } })
			monsterCreationInstance.find('#DamageImmunity').simulate('change', { target: { value: 'Nada' } })
			monsterCreationInstance.find('#ConditionImmunity').simulate('change', { target: { value: 'Nothing' } })
			monsterCreationInstance.find('#ArmorClass').simulate('change', { target: { value: 15 } })
			monsterCreationInstance.find('#HitPoints').simulate('change', { target: { value: 40 } })
			monsterCreationInstance.find('#HitPointDistribution').simulate('change', { target: { value: '9d5 - 5' } })
			monsterCreationInstance.find('#SpeedLand').simulate('change', { target: { value: 25 } })
			monsterCreationInstance.find('#SpeedSwim').simulate('change', { target: { value: 15 } })
			monsterCreationInstance.find('#AbilityStrength').simulate('change', { target: { value: 17 } })
			monsterCreationInstance.find('#AbilityDexterity').simulate('change', { target: { value: 15 } })
			monsterCreationInstance.find('#AbilityConstitution').simulate('change', { target: { value: 13 } })
			monsterCreationInstance.find('#AbilityIntelligence').simulate('change', { target: { value: 12 } })
			monsterCreationInstance.find('#AbilityWisdom').simulate('change', { target: { value: 16 } })
			monsterCreationInstance.find('#AbilityCharisma').simulate('change', { target: { value: 15 } })
			monsterCreationInstance.find('#SavingStrength').simulate('change', { target: { value: -3 } })
			monsterCreationInstance.find('#SavingDexterity').simulate('change', { target: { value: 0 } })
			monsterCreationInstance.find('#SavingConstitution').simulate('change', { target: { value: -1 } })
			monsterCreationInstance.find('#SavingIntelligence').simulate('change', { target: { value: -2 } })
			monsterCreationInstance.find('#SavingWisdom').simulate('change', { target: { value: 8 } })
			monsterCreationInstance.find('#SavingCharisma').simulate('change', { target: { value: 9 } })
			monsterCreationInstance.find('#Athletics').simulate('change', { target: { value: 9 } })
			monsterCreationInstance.find('#Acrobatics').simulate('change', { target: { value: 10 } })
			monsterCreationInstance.find('#SleightOfHand').simulate('change', { target: { value: 9 } })
			monsterCreationInstance.find('#Stealth').simulate('change', { target: { value: 8 } })
			monsterCreationInstance.find('#Arcana').simulate('change', { target: { value: 7 } })
			monsterCreationInstance.find('#History').simulate('change', { target: { value: 7 } })
			monsterCreationInstance.find('#Investigation').simulate('change', { target: { value: 6 } })
			monsterCreationInstance.find('#Nature').simulate('change', { target: { value: 7 } })
			monsterCreationInstance.find('#Religion').simulate('change', { target: { value: 8 } })
			monsterCreationInstance.find('#AnimalHandling').simulate('change', { target: { value: 9 } })
			monsterCreationInstance.find('#Insight').simulate('change', { target: { value: 10 } })
			monsterCreationInstance.find('#Medicine').simulate('change', { target: { value: 12 } })
			monsterCreationInstance.find('#Perception').simulate('change', { target: { value: 15 } })
			monsterCreationInstance.find('#Survival').simulate('change', { target: { value: 11 } })
			monsterCreationInstance.find('#Deception').simulate('change', { target: { value: 10 } })
			monsterCreationInstance.find('#Intimidation').simulate('change', { target: { value: 9 } })
			monsterCreationInstance.find('#Performance').simulate('change', { target: { value: 7 } })
			monsterCreationInstance.find('#Persuasion').simulate('change', { target: { value: 4 } })
			monsterCreationInstance.find('#Blindsight').simulate('change', { target: { value: 30 } })
			monsterCreationInstance.find('#Darkvision').simulate('change', { target: { value: 10} })
			monsterCreationInstance.find('#Tremorsense').simulate('change', { target: { value: 15 } })
			monsterCreationInstance.find('#Truesight').simulate('change', { target: { value: 60 } })
			monsterCreationInstance.find('#PassivePerception').simulate('change', { target: { value: 13 } })
			monsterCreationInstance.find('#PassiveInvestigation').simulate('change', { target: { value: 14 } })
			monsterCreationInstance.find('#PassiveInsight').simulate('change', { target: { value: 16 } })
			monsterCreationInstance.find('#Languages').simulate('change', { target: { value: 'Common and Draconic' } })
			monsterCreationInstance.find('#ChallengeRating').simulate('change', { target: { value: 2.5 } })
			monsterCreationInstance.find('#ExperiencePoints').simulate('change', { target: { value: 190 } })
			//console.log(monsterCreationInstance.state())
			expect(monsterCreationInstance.state()).toEqual({
					submitted: false,
					modal: {
						open: false,
						message: ""
					},
					SpeedLand: 25,
					SpeedSwim: 15,
					experiencePoints: 190,
					monster: {
						Name: "Hello",
						Type: MonsterType.Celestial,
						Alignment: Alignment.AnyGoodAlignment,
						Size: Size.Gargantuan,
						Race: MonsterRace.Devil,
						Environment: Environment.Underdark,
						DamageVulnerabilities: "Everything",
						DamageResistances: "None at all",
						DamageImmunities: "Nada",
						ConditionImmunities: "Nothing",
						ArmorClass: 15,
						HitPoints: 40,
						HitPointDistribution: "9d5 - 5",
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
							SleightOfHand: 9,
							Stealth: 8,
							Arcana: 7,
							History: 7,
							Investigation: 6,
							Nature: 7,
							Religion: 8,
							AnimalHandling: 9,
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
							Blindsight: 30,
							Darkvision: 10,
							Tremorsense: 15,
							Truesight: 60,
							PassivePerception: 13,
							PassiveInvestigation: 14,
							PassiveInsight: 16,
						},
						Languages: "Common and Draconic",
						ChallengeRating: 2.5,
						//abilities: [],
						//actions: [],
					}
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
				"HitPointDistribution": "9d5 - 5",
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
				"Senses": "Blindsight: 30 ft. Darkvision: 10 ft. Tremorsense: 15 ft. Truesight: 60 ft. PassivePerception: 13. PassiveInvestigation: 14. PassiveInsight: 16.",
				"Languages": "Common and Draconic",
				"ChallengeRating": 2.5,
				//abilities: [],
				//actions: [],
			})
			.reply(201, { status:201, message: 'success' });
			monsterCreationInstance.find('form').simulate('submit', { preventDefault() {} });
		});

		it('should change only types when type is changed', () => {
			monsterCreationInstance.find(MonsterDropdown).find('[name="Type"]').dive().find('#Type.Undead').simulate('click', { target: { value: "Undead" } })
			expect(monsterCreationInstance.state().monster.Type).toEqual(MonsterType.Undead);
		})

		it('should change only alignment when alignment is changed', () => {
			monsterCreationInstance.find(MonsterDropdown).find('[name="Alignment"]').dive().find('#Alignment.AnyNonEvilAlignment').simulate('click', { target: { value: "AnyNonEvilAlignment" } })
			expect(monsterCreationInstance.state().monster.Alignment).toEqual(Alignment.AnyNonEvilAlignment);
		})

		it('should change only size when size is changed', () => {
			monsterCreationInstance.find(MonsterDropdown).find('[name="Size"]').dive().find('#Size.Large').simulate('click', { target: { value: "Large" } })
			expect(monsterCreationInstance.state().monster.Size).toEqual(Size.Large);
		})

		it('should change only races when race is changed', () => {
			monsterCreationInstance.find(MonsterDropdown).find('[name="Race"]').dive().find('#Race.Goblinoid').simulate('click', { target: { value: "Goblinoid" } })
			expect(monsterCreationInstance.state().monster.Race).toEqual(MonsterRace.Goblinoid);
		})

		it('should change only environments when environment is changed', () => {
			monsterCreationInstance.find(MonsterDropdown).find('[name="Environment"]').dive().find('#Environment.Coastal').simulate('click', { target: { value: "Coastal" } })
			expect(monsterCreationInstance.state().monster.Environment).toEqual(Environment.Coastal);
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