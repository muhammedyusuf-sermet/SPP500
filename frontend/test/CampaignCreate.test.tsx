import * as React from 'react';
import * as nock from 'nock';
import { mount, ReactWrapper, shallow } from 'enzyme';
import { CampaignCRUD, ICampaignCRUDState, ICampaignCRUDProps } from "../src/renderer/components/CampaignCRUD";

import {API_URL} from '../src/config'
import { CookieManager as CookieManagerMock } from "../src/__mocks__/cookie";
import { CookieManager } from "../src/cookie";
import { BrowserRouter, Route, Switch, Link, Redirect } from 'react-router-dom';
import { CRUDProcess } from '../src/renderer/components/MonsterCRUD';
import { EncounterInstances } from '../src/encounter_instances';
import { CharacterInstances } from '../src/character_instances';

jest.mock('../src/cookie');

////// Happy Path //////


describe('Campaign CRUD create', () => {

	let campaignCRUDInstance: ReactWrapper<ICampaignCRUDProps, ICampaignCRUDState, CampaignCRUD>;

	describe('Redirect if submitted', () => {

		let browserInstance: ReactWrapper<any, any, BrowserRouter>;

		beforeAll(async (done) => {
			nock.disableNetConnect();
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
			// This makes it so there isn't a warning about redirecting to the same page.
			nock(API_URL)
			.get('/encounter/get/0/6')
			.reply(200, {
				status: 201,
				messages: ['success'],
				total: 12,
				content: EncounterInstances
			});
			nock(API_URL)
			.get('/character/get/0/6')
			.reply(200, {
				status: 201,
				messages: ['success'],
				total: 12,
				content: CharacterInstances
			});
			browserInstance = mount<BrowserRouter, any, any>(
				<BrowserRouter >
					<Switch>
						<Route path='/create' render={() => (
							<React.Fragment>
								<CampaignCRUD Process={CRUDProcess.Create} />
								<Link to='/' replace={false} >Home</Link>
							</React.Fragment>
						)} />
						<Route exact path='/' render={() => (
							<Link to='/create' replace={false} >Create</Link>
						)} />
					</Switch>
				</BrowserRouter>
				);
			browserInstance.find('Link').simulate('click', { button: 0 })
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			expect(nock.isDone()).toEqual(true);
			done();
		});

		afterEach( () => {
			nock.cleanAll();
			//browserInstance.find('Link').simulate('click', { button: 0 })
		});

		it('renders without crashing', () => {
			expect(browserInstance.find(Link).text()).toEqual('Home');
			expect(browserInstance.find(CampaignCRUD)).toBeDefined();
			browserInstance.find(Link).simulate('click',{button: 0});
		});

		it('should redirect', async (done) => {
			if (browserInstance.find(Link).text() == 'Create') {
				nock(API_URL)
				.get('/encounter/get/0/6')
				.reply(200, {
					status: 201,
					messages: ['success'],
					total: 12,
					content: EncounterInstances
				});
				nock(API_URL)
				.get('/character/get/0/6')
				.reply(200, {
					status: 201,
					messages: ['success'],
					total: 12,
					content: CharacterInstances
				});
				browserInstance.find(Link).simulate('click',{button: 0});
				// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
				await new Promise(resolve => setImmediate(resolve));
				await new Promise(resolve => setImmediate(resolve));
				await new Promise(resolve => setImmediate(resolve));
				// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
				await new Promise(resolve => setImmediate(resolve));
				await new Promise(resolve => setImmediate(resolve));
				await new Promise(resolve => setImmediate(resolve));
			}
			expect(browserInstance.find(Link).text()).toEqual('Home');
			expect(browserInstance.find(Redirect)).toHaveLength(0);
			browserInstance.find(CampaignCRUD).setState({ submitted: true });
			expect(browserInstance.find(Redirect)).toHaveLength(1);
			browserInstance.update()
			expect(browserInstance.find(Link).text()).toEqual('Create');
			done();
		});

		it('should redirect and back button', async (done) => {
			if (browserInstance.find(Link).text() == 'Create') {
				nock(API_URL)
				.get('/encounter/get/0/6')
				.reply(200, {
					status: 201,
					messages: ['success'],
					total: 12,
					content: EncounterInstances
				});
				nock(API_URL)
				.get('/character/get/0/6')
				.reply(200, {
					status: 201,
					messages: ['success'],
					total: 12,
					content: CharacterInstances
				});
				browserInstance.find(Link).simulate('click',{button: 0});
				// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
				await new Promise(resolve => setImmediate(resolve));
				await new Promise(resolve => setImmediate(resolve));
				await new Promise(resolve => setImmediate(resolve));
				// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
				await new Promise(resolve => setImmediate(resolve));
				await new Promise(resolve => setImmediate(resolve));
				await new Promise(resolve => setImmediate(resolve));
			}
			expect(browserInstance.find(Link).text()).toEqual('Home');
			browserInstance.find("Button#BackButton").simulate('click', { button: 0 });
			// TODO: fix test so it actually checks that we went back
			//expect(browserInstance.find(Link).text()).toEqual('Create');
			done();
		});
	});

	describe('Happy Path', () => {

		beforeEach( async (done) => {
			nock.disableNetConnect();
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
			nock(API_URL)
			.get('/encounter/get/0/6')
			.reply(200, {
				status: 201,
				messages: ['success'],
				total: 12,
				content: EncounterInstances
			});
			nock(API_URL)
			.get('/character/get/0/6')
			.reply(200, {
				status: 201,
				messages: ['success'],
				total: 12,
				content: CharacterInstances
			});
			campaignCRUDInstance = mount<CampaignCRUD, ICampaignCRUDProps, ICampaignCRUDState>(<CampaignCRUD Process={CRUDProcess.Create} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			expect(nock.isDone()).toEqual(true);
			done();
		})

		it('renders without crashing', () => {
			expect(campaignCRUDInstance).toBeDefined();
		});

		it('renders correctly when the page is loaded', () => {
			const shallowCampaignCRUD = shallow<CampaignCRUD, ICampaignCRUDProps, ICampaignCRUDState>(<CampaignCRUD Process={CRUDProcess.Create} />);

			expect(shallowCampaignCRUD).toMatchSnapshot();
		});

		it('should be able to send campaign name only to create', async (done) => {
			campaignCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/campaign/create', {
				"Name": "Hello",
				"Encounters": [],
				"Characters": []
			})
			.reply(201, { status: 201, messages: ['success'] });
			campaignCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			campaignCRUDInstance.update();
			expect(campaignCRUDInstance.find('#ModalMessage').text()).toEqual("Campaign successfully created.");
			expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when API route not found', async (done) => {
			campaignCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/campaign/create', {
				"Name": "Hello",
				"Encounters": [],
				"Characters": []
			})
			.reply(404);
			campaignCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			campaignCRUDInstance.update();
			expect(campaignCRUDInstance.find('#ModalMessage').text()).toEqual("There was an error sending your request.");
			expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you', async (done) => {
			campaignCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/campaign/create', {
				"Name": "Hello",
				"Encounters": [],
				"Characters": []
			})
			.reply(200, { status: 400, messages: ["Invalid campaign object"]});
			campaignCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			campaignCRUDInstance.update();
			expect(campaignCRUDInstance.find('#ModalMessage').text()).toEqual("Invalid campaign object");
			expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you without any messages', async (done) => {
			campaignCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/campaign/create', {
				"Name": "Hello",
				"Encounters": [],
				"Characters": []
			})
			.reply(200, { status: 401 });
			campaignCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			campaignCRUDInstance.update();
			expect(campaignCRUDInstance.find('#ModalMessage').text()).toEqual("There was an error submitting your request. Please try again later.");
			expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show payload error message when campaign is not properly formed', async (done) => {
			campaignCRUDInstance.find('input#Name').simulate('change', { target: { value: '' } })
			campaignCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			campaignCRUDInstance.update();
			expect(campaignCRUDInstance.find('#ModalMessage').text()).toEqual("\"Name\" is required");
			expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			done();
		});

		it('should show payload error message when campaign has an invalid Name', async (done) => {
			campaignCRUDInstance.find('input#Name').simulate('change', { target: { value: '' } })
			campaignCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			campaignCRUDInstance.update();
			expect(campaignCRUDInstance.find('#ModalMessage').text()).toEqual("\"Name\" is required");
			expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			done();
		});

		it('should be able to send campaign to create', async (done) => {
			campaignCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			campaignCRUDInstance.find('textarea#Summary').simulate('change', { target: { value: "Winner takes all." } })
			campaignCRUDInstance.find('textarea#Notes').simulate('change', { target: { value: "Kill small creatures first." } })
			campaignCRUDInstance.find('tr#encounter1').simulate('click', {})
			campaignCRUDInstance.find('tr#encounter2').simulate('click', {})
			// toggle encounter 3
			campaignCRUDInstance.find('tr#encounter3').simulate('click', {})
			campaignCRUDInstance.find('tr#encounter3').simulate('click', {})
			campaignCRUDInstance.find('tr#character1').simulate('click', {})
			// toggle character 2
			campaignCRUDInstance.find('tr#character2').simulate('click', {})
			campaignCRUDInstance.find('tr#character2').simulate('click', {})
			expect(campaignCRUDInstance.state()).toEqual({
				Process: CRUDProcess.Create,
				Id: undefined,
				submitted: false,
				modal: {
					open: false,
					message: ""
				},
				Campaign: {
					Name: '',
				},
			})
			nock(API_URL)
			.post('/campaign/create', {
				"Name": "Hello",
				"Encounters": [{"Id": 1}, {"Id": 2}],
				"Characters": [{"Id": 1}],
				"Summary": "Winner takes all.",
				"Notes": "Kill small creatures first."
			})
			.reply(201, { status: 201, message: 'success' });
			campaignCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			campaignCRUDInstance.update();
			expect(campaignCRUDInstance.find('#ModalMessage').text()).toEqual("Campaign successfully created.");
			expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		describe('should show and hide modal', () => {
			it('show modal', () => {
				campaignCRUDInstance.instance().closeModal();
				campaignCRUDInstance.update();
				expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(false);
				campaignCRUDInstance.instance().openModal('TestMessage');
				campaignCRUDInstance.update();
				expect(campaignCRUDInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			});

			it('close modal', () => {
				campaignCRUDInstance.instance().openModal('TestMessage');
				campaignCRUDInstance.update();
				expect(campaignCRUDInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
				campaignCRUDInstance.instance().closeModal();
				campaignCRUDInstance.update();
				expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(false);
			});

			it('close modal by click', () => {
				campaignCRUDInstance.instance().openModal('TestMessage');
				campaignCRUDInstance.update();
				expect(campaignCRUDInstance.find('#ModalMessage').text().length).toBeGreaterThan(0);
				expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
				let background = campaignCRUDInstance.find('ModalBackground#modalBackground')
				background.simulate('click');
				campaignCRUDInstance.update();
				expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(false);
			});
		});
	});
});