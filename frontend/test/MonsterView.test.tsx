import * as React from 'react';
import * as nock from 'nock';
import { mount, ReactWrapper } from 'enzyme';

import { MonsterCRUD, IMonsterCRUDState, IMonsterCRUDProps, MonsterCRUDState } from "../src/renderer/components/MonsterCRUD";

import {API_URL} from '../src/config'
import { CookieManager as CookieManagerMock } from "../src/__mocks__/cookie";
import { CookieManager } from "../src/cookie";

jest.mock('../src/cookie');

////// Happy Path //////

describe('Monster CRUD', () => {

	let monsterCRUDInstance: ReactWrapper<IMonsterCRUDProps, IMonsterCRUDState, MonsterCRUD>;

	const basicResponse = {
		status: 201,
		messages: ['success'],
		content: { Name: 'Basic Monster', AbilityScores:{}, SavingThrows:{}, Skills:{}, Senses:{} }
	}

	describe('Read should be slightly different', () => {
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
			monsterCRUDInstance = mount<MonsterCRUD, IMonsterCRUDProps, IMonsterCRUDState>(<MonsterCRUD Process={MonsterCRUDState.Read} Id={0} />);
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
			expect(monsterCRUDInstance.state().Name).toEqual('Basic Monster');
		});

		it('should not render the submit button', () => {
			expect(monsterCRUDInstance.find('Button#SubmitButton')).toHaveLength(0);
		});
	});
})