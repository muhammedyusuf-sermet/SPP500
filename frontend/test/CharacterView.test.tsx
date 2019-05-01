import * as React from 'react';
import * as nock from 'nock';
import { mount, ReactWrapper } from 'enzyme';

import { CharacterCRUD, ICharacterCRUDState, ICharacterCRUDProps, ICharacterGetOneResponse } from "../src/renderer/components/CharacterCRUD";

import {API_URL} from '../src/config'
import { CookieManager as CookieManagerMock } from "../src/__mocks__/cookie";
import { CookieManager } from "../src/cookie";

jest.mock('../src/cookie');

////// Happy Path //////

describe('Character CRUD', () => {

	let characterCRUDInstance: ReactWrapper<ICharacterCRUDProps, ICharacterCRUDState, CharacterCRUD>;

	const basicResponse: ICharacterGetOneResponse = {
		status: 201,
		messages: ['success'],
		content: {
			Id: 0,
			Name: 'Basic Character',
		}
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
			.get('/character/0')
			.reply(200, basicResponse);
			characterCRUDInstance = mount<CharacterCRUD, ICharacterCRUDProps, ICharacterCRUDState>(<CharacterCRUD Process={CRUDProcess.Read} Id={0} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the CharacterCRUD to request the mosnter from the database.
			expect(nock.isDone()).toEqual(true);
			done();
		});

		afterEach( () => {
			nock.cleanAll();
		});

		it('renders without crashing', () => {
			expect(characterCRUDInstance).toBeDefined();
			expect(characterCRUDInstance.state().Character.Name).toEqual('Basic Character');
		});

		it('should not render the submit button', () => {
			expect(characterCRUDInstance.find('Button#SubmitButton')).toHaveLength(0);
		});

		it('should have all inputs disabled',() => {
			expect(characterCRUDInstance.find('input#Name').props().disabled).toEqual(true)
			expect(characterCRUDInstance.find('input#Level').props().disabled).toEqual(true)
			expect(characterCRUDInstance.find('select#Race').props().disabled).toEqual(true)
			expect(characterCRUDInstance.find('select#Class').props().disabled).toEqual(true)
			expect(characterCRUDInstance.find('input#MaxHealth').props().disabled).toEqual(true)
			expect(characterCRUDInstance.find('input#ArmorClass').props().disabled).toEqual(true)
			expect(characterCRUDInstance.find('textarea#Notes').props().disabled).toEqual(true)
		})

		it('should have all inputs disabled unless switch to edit through props',() => {
			expect(characterCRUDInstance.find('input#Name').props().disabled).toEqual(true)
			expect(characterCRUDInstance.find('input#Level').props().disabled).toEqual(true)
			expect(characterCRUDInstance.find('select#Race').props().disabled).toEqual(true)
			expect(characterCRUDInstance.find('select#Class').props().disabled).toEqual(true)
			expect(characterCRUDInstance.find('input#MaxHealth').props().disabled).toEqual(true)
			expect(characterCRUDInstance.find('input#ArmorClass').props().disabled).toEqual(true)
			expect(characterCRUDInstance.find('textarea#Notes').props().disabled).toEqual(true)
			characterCRUDInstance.setProps({
				Process: CRUDProcess.Edit
			});
			expect(characterCRUDInstance.find('input#Name').props().disabled).toEqual(false)
			expect(characterCRUDInstance.find('input#Level').props().disabled).toEqual(false)
			expect(characterCRUDInstance.find('select#Race').props().disabled).toEqual(false)
			expect(characterCRUDInstance.find('select#Class').props().disabled).toEqual(false)
			expect(characterCRUDInstance.find('input#MaxHealth').props().disabled).toEqual(false)
			expect(characterCRUDInstance.find('input#ArmorClass').props().disabled).toEqual(false)
			expect(characterCRUDInstance.find('textarea#Notes').props().disabled).toEqual(false)
		})
	});
})