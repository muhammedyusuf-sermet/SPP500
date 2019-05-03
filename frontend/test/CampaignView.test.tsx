import * as React from 'react';
import * as nock from 'nock';
import { mount, ReactWrapper } from 'enzyme';

import { CampaignCRUD, ICampaignCRUDState, ICampaignCRUDProps, ICampaignGetOneResponse } from "../src/renderer/components/CampaignCRUD";

import {API_URL} from '../src/config'
import { CookieManager as CookieManagerMock } from "../src/__mocks__/cookie";
import { CookieManager } from "../src/cookie";
import { CRUDProcess } from '../src/renderer/components/MonsterCRUD';
import { EncounterInstances } from '../src/encounter_instances';
import { CharacterInstances } from '../src/character_instances';
import { CampaignDetails, ICampaignDetailsProps } from '../src/renderer/components/platform/pages/view_game_components/campaign/CampaignDetails';

jest.mock('../src/cookie');

////// Happy Path //////

describe('Campaign CRUD', () => {

	let campaignCRUDInstance: ReactWrapper<ICampaignCRUDProps, ICampaignCRUDState, CampaignCRUD>;

	const basicResponse: ICampaignGetOneResponse = {
		status: 201,
		messages: ['success'],
		content: {
			Id: 1,
			Name: 'Basic Campaign',
			Encounters: [{ Id: 1 }, { Id: 2 }],
			Characters: [{ Id: 1 }]
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
			.get('/campaign/1')
			.reply(200, basicResponse);
			nock(API_URL)
			.get('/encounter/get/0/6')
			.reply(200, {
				status: 201,
				messages: ['success'],
				total: 12,
				content: EncounterInstances.slice(0,6)
			});
			nock(API_URL)
			.get('/character/get/0/6')
			.reply(200, {
				status: 201,
				messages: ['success'],
				total: 12,
				content: CharacterInstances.slice(0,6)
			});
			campaignCRUDInstance = mount<CampaignCRUD, ICampaignCRUDProps, ICampaignCRUDState>(<CampaignCRUD Process={CRUDProcess.Read} Id={1} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the CampaignCRUD to request the mosnter from the database.
			expect(nock.isDone()).toEqual(true);
			campaignCRUDInstance.find('TableBody').update();
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

		it('should have all inputs disabled',() => {
			expect(campaignCRUDInstance.find('input#Name').props().disabled).toEqual(true)
			expect(campaignCRUDInstance.find('textarea#Summary').props().disabled).toEqual(true)
			expect(campaignCRUDInstance.find('textarea#Notes').props().disabled).toEqual(true)
			campaignCRUDInstance.find('tr#encounter1').simulate('click', {})
			campaignCRUDInstance.find('tr#character1').simulate('click', {})
			const campaign = campaignCRUDInstance.find<ICampaignDetailsProps>(CampaignDetails);
			expect(campaign.state('EncountersSet')).toEqual(new Set([1,2]))
			expect(campaign.state('CharactersSet')).toEqual(new Set([1]))
		})

		it('should have all inputs disabled unless switch to edit through props',() => {
			expect(campaignCRUDInstance.find('input#Name').props().disabled).toEqual(true)
			expect(campaignCRUDInstance.find('textarea#Summary').props().disabled).toEqual(true)
			expect(campaignCRUDInstance.find('textarea#Notes').props().disabled).toEqual(true)
			campaignCRUDInstance.find('tr#encounter1').simulate('click', {})
			campaignCRUDInstance.find('tr#character1').simulate('click', {})
			const campaign = campaignCRUDInstance.find<ICampaignDetailsProps>(CampaignDetails);
			expect(campaign.state('EncountersSet')).toEqual(new Set([1,2]))
			expect(campaign.state('CharactersSet')).toEqual(new Set([1]))
			campaignCRUDInstance.setProps({
				Process: CRUDProcess.Edit
			});
			expect(campaignCRUDInstance.find('input#Name').props().disabled).toEqual(false)
			expect(campaignCRUDInstance.find('textarea#Summary').props().disabled).toEqual(false)
			expect(campaignCRUDInstance.find('textarea#Notes').props().disabled).toEqual(false)
			campaignCRUDInstance.find('tr#encounter1').simulate('click', {})
			campaignCRUDInstance.find('tr#character1').simulate('click', {})
			expect(campaign.state('EncountersSet')).toEqual(new Set([2]))
			expect(campaign.state('CharactersSet')).toEqual(new Set())
		})

		it('should change pages for encounter', async (done) => {
			//const campaign = campaignCRUDInstance.find<ICampaignDetailsProps>(CampaignDetails);
			//console.log(campaign.debug())
			expect(campaignCRUDInstance.find('tr#encounter6')).toHaveLength(1)
			expect(campaignCRUDInstance.find('tr#encounter7')).toHaveLength(0)
			nock(API_URL)
			.get('/encounter/get/1/6')
			.reply(200, {
				status: 201,
				messages: ['success'],
				total: 12,
				content: EncounterInstances.slice(6,12)
			});
			campaignCRUDInstance.find('button#EncounterNext').simulate('click', { button: 0 });
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			expect(nock.isDone()).toEqual(true);
			campaignCRUDInstance.update()
			expect(campaignCRUDInstance.find('tr#encounter6')).toHaveLength(0)
			expect(campaignCRUDInstance.find('tr#encounter7')).toHaveLength(1)
			done();
		})

		it('should change pages for character', async (done) => {
			//const campaign = campaignCRUDInstance.find<ICampaignDetailsProps>(CampaignDetails);
			//console.log(campaign.debug())
			expect(campaignCRUDInstance.find('tr#character6')).toHaveLength(1)
			expect(campaignCRUDInstance.find('tr#character7')).toHaveLength(0)
			nock(API_URL)
			.get('/character/get/1/6')
			.reply(200, {
				status: 201,
				messages: ['success'],
				total: 12,
				content: CharacterInstances.slice(6,12)
			});
			campaignCRUDInstance.find('button#CharacterNext').simulate('click', { button: 0 });
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			expect(nock.isDone()).toEqual(true);
			campaignCRUDInstance.update()
			expect(campaignCRUDInstance.find('tr#character6')).toHaveLength(0)
			expect(campaignCRUDInstance.find('tr#character7')).toHaveLength(1)
			done();
		})

		it('should change page size for encounter', async (done) => {
			//const campaign = campaignCRUDInstance.find<ICampaignDetailsProps>(CampaignDetails);
			//console.log(campaign.debug())
			expect(campaignCRUDInstance.find('tr#encounter6')).toHaveLength(1)
			expect(campaignCRUDInstance.find('tr#encounter7')).toHaveLength(0)
			nock(API_URL)
			.get('/encounter/get/0/12')
			.reply(200, {
				status: 201,
				messages: ['success'],
				total: 12,
				content: EncounterInstances
			});
			campaignCRUDInstance.find('select#Encounter').simulate('change', { target: { value: 12 } });
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			expect(nock.isDone()).toEqual(true);
			campaignCRUDInstance.update()
			expect(campaignCRUDInstance.find('tr#encounter6')).toHaveLength(1)
			expect(campaignCRUDInstance.find('tr#encounter7')).toHaveLength(1)
			done();
		})

		it('should change page size for character', async (done) => {
			//const campaign = campaignCRUDInstance.find<ICampaignDetailsProps>(CampaignDetails);
			//console.log(campaign.debug())
			expect(campaignCRUDInstance.find('tr#character6')).toHaveLength(1)
			expect(campaignCRUDInstance.find('tr#character7')).toHaveLength(0)
			nock(API_URL)
			.get('/character/get/0/12')
			.reply(200, {
				status: 201,
				messages: ['success'],
				total: 12,
				content: CharacterInstances
			});
			campaignCRUDInstance.find('select#Character').simulate('change', { target: { value: 12 } });
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			expect(nock.isDone()).toEqual(true);
			campaignCRUDInstance.update()
			expect(campaignCRUDInstance.find('tr#character6')).toHaveLength(1)
			expect(campaignCRUDInstance.find('tr#character7')).toHaveLength(1)
			done();
		})
	});
})