import * as React from 'react';
import * as nock from 'nock';
import { mount, ReactWrapper } from 'enzyme';
import { CampaignCRUD, ICampaignCRUDState, ICampaignCRUDProps, CampaignCRUDState } from "../src/renderer/components/CampaignCRUD";
import {API_URL} from '../src/config'
import { CookieManager as CookieManagerMock } from "../src/__mocks__/cookie";
import { CookieManager } from "../src/cookie";

jest.mock('../src/cookie');

////// Happy Path //////

describe('Campaign CRUD', () => {

	let campaignCRUDInstance: ReactWrapper<ICampaignCRUDProps, ICampaignCRUDState, CampaignCRUD>;

	const basicResponse = {
		status: 201,
		messages: ['success'],
		content: { Name: 'Basic Campaign' }
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
			.get('/campaign/0')
			.reply(200, basicResponse);
			campaignCRUDInstance = mount<CampaignCRUD, ICampaignCRUDProps, ICampaignCRUDState>(<CampaignCRUD Process={CampaignCRUDState.Read} Id={0} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the CampaignCRUD to request the mosnter from the database.
			expect(nock.isDone()).toEqual(true);
			done();
		});

		afterEach( () => {
			nock.cleanAll();
		});

		it('renders without crashing', () => {
			expect(campaignCRUDInstance).toBeDefined();
			expect(campaignCRUDInstance.state().Campaign.Name).toEqual('Basic Campaign');
		});

		it('should not render the submit button', () => {
			expect(campaignCRUDInstance.find('Button#SubmitButton')).toHaveLength(0);
		});
	});
})