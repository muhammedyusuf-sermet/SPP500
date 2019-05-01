import * as React from 'react';
import * as nock from 'nock';
import { mount, ReactWrapper } from 'enzyme';

import { EncounterCRUD, IEncounterCRUDState, IEncounterCRUDProps } from "../src/renderer/components/EncounterCRUD";

import {API_URL} from '../src/config'
import { CookieManager as CookieManagerMock } from "../src/__mocks__/cookie";
import { CookieManager } from "../src/cookie";
import { CRUDProcess } from '../src/renderer/components/MonsterCRUD';

jest.mock('../src/cookie');

////// Happy Path //////

describe('Encounter CRUD', () => {

	let encounterCRUDInstance: ReactWrapper<IEncounterCRUDProps, IEncounterCRUDState, EncounterCRUD>;
	let scope: nock.Scope;

	const basicResponse = {
		status: 201,
		messages: ['success'],
		content: { Id: 0, Name: 'Basic Encounter', Description: 'Basic Desc', Monsters: [{"Id": 5}] }
	}

	describe('Read should be slightly different', () => {
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
			encounterCRUDInstance = mount<EncounterCRUD, IEncounterCRUDProps, IEncounterCRUDState>(<EncounterCRUD Process={CRUDProcess.Read} Id={0} />);
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

		it('renders without crashing', () => {
			expect(encounterCRUDInstance).toBeDefined();
			expect(encounterCRUDInstance.state().encounter.name).toEqual('Basic Encounter');
		});

		it('should not render the submit button', () => {
			expect(encounterCRUDInstance.find('Button#SubmitButton')).toHaveLength(0);
		});

		it('should return response using state variables when called GetTotalPages', () => {
			var totalPages = encounterCRUDInstance.instance().getTotalPages();
			expect(totalPages).toEqual(27);
		});
	});
})