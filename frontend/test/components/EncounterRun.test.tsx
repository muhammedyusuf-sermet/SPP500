import * as React from 'react';
import * as nock from 'nock';
import { mount, ReactWrapper } from 'enzyme';

import { IEncounterRunProps, IEncounterRunState, EncounterRun, IEncounterGetOneResponse, ICampaignGetOneResponse } from '../../src/renderer/components/platform/pages/run_encounter/EncounterRun';

import {API_URL} from '../../src/config'
import { CookieManager as CookieManagerMock } from "../../src/__mocks__/cookie";
import { CookieManager } from "../../src/cookie";
import { CharacterInstances } from '../../src/character_instances';
import { EncounterInstances } from '../../src/encounter_instances';

jest.mock('../../src/cookie');

////// Happy Path //////

describe('Encounter Run', () => {

	let encounterRunInstance: ReactWrapper<IEncounterRunProps, IEncounterRunState, EncounterRun>;

	const basicResponse: IEncounterGetOneResponse = {
		status: 201,
		messages: ['success'],
		content: {
			Id: 1,
			Name: 'Basic Encounter',
			Description: 'Basic Description',
			Monsters: [
				{
					Id: 0,
					Name: 'Basic Encounter 0',
					ArmorClass: 12,
					HitPoints: 100,
					AbilityScores: {},
					Senses: {},
					Skills: {},
					SavingThrows: {},
				},{
					Id: 1,
					Name: 'Basic Encounter 1',
					ArmorClass: 15,
					HitPoints: 130,
					AbilityScores: {},
					Senses: {},
					Skills: {},
					SavingThrows: {},
				},{
					Id: 2,
					Name: 'Basic Encounter 2',
					ArmorClass: 7,
					HitPoints: 50,
					AbilityScores: {},
					Senses: {},
					Skills: {},
					SavingThrows: {},
				},]
		}
	}

	const basicCampaign: ICampaignGetOneResponse = {
		status: 201,
		messages: ['success'],
		content: {
			Id: 1,
			Name: 'Basic Campaign',
			Characters: CharacterInstances,
			Encounters: EncounterInstances
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
			.get('/encounter/1')
			.reply(200, basicResponse);
			encounterRunInstance = mount<EncounterRun, IEncounterRunProps, IEncounterRunState>(<EncounterRun EncounterId={1} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the EncounterRun to request the encounter from the database.
			expect(nock.isDone()).toEqual(true);
			done();
		});

		afterEach( () => {
			nock.cleanAll();
		});

		it('renders without crashing', () => {
			expect(encounterRunInstance).toBeDefined();
			expect(encounterRunInstance.state().Encounter).toEqual(basicResponse.content);
		});
	});

	describe('Server request Path for get encounter', () => {

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
			.get('/encounter/1')
			.reply(404);
			encounterRunInstance = mount<EncounterRun, IEncounterRunProps, IEncounterRunState>(<EncounterRun EncounterId={1} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the EncounterRun to request the encounter from the database.
			encounterRunInstance.update();
			expect(encounterRunInstance.find('#ModalMessage').text()).toEqual("There was an error sending your request.");
			expect(encounterRunInstance.find('Modal#encounterRunModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you', async (done) => {
			nock(API_URL)
			.get('/encounter/1')
			.reply(200, { status: 400, messages: ["Encounter not found."]});
			encounterRunInstance = mount<EncounterRun, IEncounterRunProps, IEncounterRunState>(<EncounterRun EncounterId={1} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the EncounterRun to request the encounter from the database.
			encounterRunInstance.update();
			expect(encounterRunInstance.find('#ModalMessage').text()).toEqual("Error finding encounter: Encounter not found.");
			expect(encounterRunInstance.find('Modal#encounterRunModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you without any messages', async (done) => {
			nock(API_URL)
			.get('/encounter/1')
			.reply(200, { status: 401 });
			encounterRunInstance = mount<EncounterRun, IEncounterRunProps, IEncounterRunState>(<EncounterRun EncounterId={1} />);
			// THREE IS REQUIRED, SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the EncounterRun to request the encounter from the database.
			encounterRunInstance.update();
			expect(encounterRunInstance.find('#ModalMessage').text()).toEqual("There was an error retreiving the encounter. Please try again later.");
			expect(encounterRunInstance.find('Modal#encounterRunModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});
	});

	describe('Server request Path for get campaign', () => {

		beforeEach(() => {
			nock.disableNetConnect();
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
			nock(API_URL)
			.get('/encounter/1')
			.reply(200, basicResponse);
		});

		afterEach( () => {
			nock.cleanAll();
		});

		it('should show error message when API route not found', async (done) => {
			nock(API_URL)
			.get('/campaign/1')
			.reply(404);
			encounterRunInstance = mount<EncounterRun, IEncounterRunProps, IEncounterRunState>(<EncounterRun EncounterId={1} CampaignId={1} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the EncounterRun to request the encounter from the database.
			encounterRunInstance.update();
			expect(encounterRunInstance.find('#ModalMessage').text()).toEqual("There was an error sending your request.");
			expect(encounterRunInstance.find('Modal#encounterRunModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you', async (done) => {
			nock(API_URL)
			.get('/campaign/1')
			.reply(200, { status: 400, messages: ["Campaign not found."]});
			encounterRunInstance = mount<EncounterRun, IEncounterRunProps, IEncounterRunState>(<EncounterRun EncounterId={1} CampaignId={1} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the EncounterRun to request the encounter from the database.
			encounterRunInstance.update();
			expect(encounterRunInstance.find('#ModalMessage').text()).toEqual("Error finding campaign: Campaign not found.");
			expect(encounterRunInstance.find('Modal#encounterRunModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you without any messages', async (done) => {
			nock(API_URL)
			.get('/campaign/1')
			.reply(200, { status: 401 });
			encounterRunInstance = mount<EncounterRun, IEncounterRunProps, IEncounterRunState>(<EncounterRun EncounterId={1} CampaignId={1} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the EncounterRun to request the encounter from the database.
			encounterRunInstance.update();
			expect(encounterRunInstance.find('#ModalMessage').text()).toEqual("There was an error retreiving the campaign. Please try again later.");
			expect(encounterRunInstance.find('Modal#encounterRunModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
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
			.get('/encounter/1')
			.reply(200, basicResponse);
			nock(API_URL)
			.get('/campaign/1')
			.reply(200, basicCampaign);
			encounterRunInstance = mount<EncounterRun, IEncounterRunProps, IEncounterRunState>(<EncounterRun EncounterId={1} CampaignId={1} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the EncounterRun to request the mosnter from the database.
			expect(nock.isDone()).toEqual(true);
			done();
		});

		afterEach( () => {
			nock.cleanAll();
		});

		it('renders without crashing', () => {
			expect(encounterRunInstance).toBeDefined();
			expect(encounterRunInstance.state().Encounter).toEqual(basicResponse.content);
			encounterRunInstance.unmount();
		});

		it('should view monster', () => {
			encounterRunInstance.update()
			encounterRunInstance.find('Button#ViewMonster1').simulate('click')
			expect(encounterRunInstance.find('MonsterCRUD').props()).toEqual({"Id": 1, "Process": "Read"})
		});

		/*it('should edit monster', () => {
			encounterRunInstance.update()
			encounterRunInstance.find('button#Edit1').simulate('click')
			expect(encounterRunInstance.find('MonsterCRUD').props()).toEqual({"Id": 1, "Process": "Edit"})
		});*/

		it('should view character', () => {
			encounterRunInstance.update()
			encounterRunInstance.find('Button#ViewPlayer1').simulate('click')
			expect(encounterRunInstance.find('CharacterCRUD').props()).toEqual({"Id": 1, "Process": "Read"})
		});

		/*it('should edit character', () => {
			encounterRunInstance.update()
			encounterRunInstance.find('button#Edit1').simulate('click')
			expect(encounterRunInstance.find('CharacterCRUD').props()).toEqual({"Id": 1, "Process": "Edit"})
		});*/

		it('should change which monster to view', () => {
			encounterRunInstance.update()
			encounterRunInstance.find('button#ViewMonster2').simulate('click')
			expect(encounterRunInstance.find('MonsterCRUD').props()).toEqual({"Id": 2, "Process": "Read"})

			encounterRunInstance.find('button#ViewMonster1').simulate('click')
			expect(encounterRunInstance.find('MonsterCRUD').props()).toEqual({"Id": 1, "Process": "Read"})
		});

		/*it('should change which monster to edit', () => {
			encounterRunInstance.update()
			encounterRunInstance.find('button#Edit2').simulate('click')
			expect(encounterRunInstance.find('MonsterCRUD').props()).toEqual({"Id": 2, "Process": "Edit"})

			encounterRunInstance.find('button#Edit1').simulate('click')
			expect(encounterRunInstance.find('MonsterCRUD').props()).toEqual({"Id": 1, "Process": "Edit"})
		});*/

		it('should change which character to view', () => {
			encounterRunInstance.update()
			encounterRunInstance.find('button#ViewPlayer2').simulate('click')
			expect(encounterRunInstance.find('CharacterCRUD').props()).toEqual({"Id": 2, "Process": "Read"})

			encounterRunInstance.find('button#ViewPlayer1').simulate('click')
			expect(encounterRunInstance.find('CharacterCRUD').props()).toEqual({"Id": 1, "Process": "Read"})
		});

		/*it('should change which character to edit', () => {
			encounterRunInstance.update()
			encounterRunInstance.find('button#Edit2').simulate('click')
			expect(encounterRunInstance.find('CharacterCRUD').props()).toEqual({"Id": 2, "Process": "Edit"})

			encounterRunInstance.find('button#Edit1').simulate('click')
			expect(encounterRunInstance.find('CharacterCRUD').props()).toEqual({"Id": 1, "Process": "Edit"})
		});*/

		it('should track turn number', () => {
			encounterRunInstance.update()
			encounterRunInstance.find('button#NextTurn').simulate('click')
			expect(encounterRunInstance.state().Turn).toEqual(1)
			encounterRunInstance.find('button#NextTurn').simulate('click')
			expect(encounterRunInstance.state().Turn).toEqual(2)
			encounterRunInstance.find('button#NextTurn').simulate('click')
			expect(encounterRunInstance.state().Turn).toEqual(3)
		});

		it('should track Encounter Description', () => {
			encounterRunInstance.update()
			encounterRunInstance.find('textarea#EncounterDescription').simulate('change', { target: {value: 'first'}})
			expect(encounterRunInstance.state().Description).toEqual('first')
			encounterRunInstance.find('textarea#EncounterDescription').simulate('change', { target: {value: 'second'}})
			expect(encounterRunInstance.state().Description).toEqual('second')
			encounterRunInstance.find('textarea#EncounterDescription').simulate('change', { target: {value: 'third'}})
			expect(encounterRunInstance.state().Description).toEqual('third')
		});

		it('should track Campaign Notes', () => {
			encounterRunInstance.update()
			encounterRunInstance.find('textarea#CampaignNotes').simulate('change', { target: {value: 'first'}})
			expect(encounterRunInstance.state().Notes).toEqual('first')
			encounterRunInstance.find('textarea#CampaignNotes').simulate('change', { target: {value: 'second'}})
			expect(encounterRunInstance.state().Notes).toEqual('second')
			encounterRunInstance.find('textarea#CampaignNotes').simulate('change', { target: {value: 'third'}})
			expect(encounterRunInstance.state().Notes).toEqual('third')
		});

		it('should track Campaign Summary', () => {
			encounterRunInstance.update()
			encounterRunInstance.find('textarea#CampaignSummary').simulate('change', { target: {value: 'first'}})
			expect(encounterRunInstance.state().Summary).toEqual('first')
			encounterRunInstance.find('textarea#CampaignSummary').simulate('change', { target: {value: 'second'}})
			expect(encounterRunInstance.state().Summary).toEqual('second')
			encounterRunInstance.find('textarea#CampaignSummary').simulate('change', { target: {value: 'third'}})
			expect(encounterRunInstance.state().Summary).toEqual('third')
		});

		describe('should show and hide modal', () => {
			it('show modal', () => {
				encounterRunInstance.instance().closeModal();
				encounterRunInstance.update();
				expect(encounterRunInstance.find('Modal#encounterRunModal').prop('isActive')).toEqual(false);
				encounterRunInstance.instance().openModal('TestMessage');
				encounterRunInstance.update();
				expect(encounterRunInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				expect(encounterRunInstance.find('Modal#encounterRunModal').prop('isActive')).toEqual(true);
			});

			it('close modal', () => {
				encounterRunInstance.instance().openModal('TestMessage');
				encounterRunInstance.update();
				expect(encounterRunInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				expect(encounterRunInstance.find('Modal#encounterRunModal').prop('isActive')).toEqual(true);
				encounterRunInstance.instance().closeModal();
				encounterRunInstance.update();
				expect(encounterRunInstance.find('Modal#encounterRunModal').prop('isActive')).toEqual(false);
			});

			it('close modal by click', () => {
				encounterRunInstance.instance().openModal('TestMessage');
				encounterRunInstance.update();
				expect(encounterRunInstance.find('#ModalMessage').text().length).toBeGreaterThan(0);
				expect(encounterRunInstance.find('Modal#encounterRunModal').prop('isActive')).toEqual(true);
				const background = encounterRunInstance.find('ModalBackground#modalBackground')
				background.simulate('click');
				encounterRunInstance.update();
				expect(encounterRunInstance.find('Modal#encounterRunModal').prop('isActive')).toEqual(false);
			});
		});
	})
})