import * as React from 'react';
import * as nock from 'nock';
import { mount, ReactWrapper, shallow } from 'enzyme';

import { CampaignCRUD, ICampaignCRUDState, ICampaignCRUDProps, ICampaignGetOneResponse } from "../src/renderer/components/CampaignCRUD";

import {API_URL} from '../src/config'
import { CookieManager as CookieManagerMock } from "../src/__mocks__/cookie";
import { CookieManager } from "../src/cookie";
import { BrowserRouter, Route, Redirect, Switch, Link } from 'react-router-dom';
import { ICampaignData } from '../src/campaign';
import { CRUDProcess } from '../src/renderer/components/MonsterCRUD';

jest.mock('../src/cookie');

////// Happy Path //////

describe('Campaign CRUD', () => {

	let campaignCRUDInstance: ReactWrapper<ICampaignCRUDProps, ICampaignCRUDState, CampaignCRUD>;

	const basicResponse: ICampaignGetOneResponse = {
		status: 201,
		messages: ['success'],
		content: {
			Id: 0,
			Name: 'Basic Campaign',
		}
	}

	describe('Redirect if submitted', () => {

		let browserInstance: ReactWrapper<any, any, BrowserRouter>;

		beforeEach(() => {
			nock.disableNetConnect();
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
			// This makes it so there isn't a warning about redirecting to the same page.
			browserInstance = mount<BrowserRouter, any, any>(
				<BrowserRouter >
					<Switch>
						<Route exact path='/create' render={() => (
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
			//console.log(browserInstance.debug())
			//browserInstance.find('Link').simulate('click', { button: 0 })
			campaignCRUDInstance = {} as any
			if(campaignCRUDInstance)
				campaignCRUDInstance = {} as any
		});

		afterEach( () => {
			nock.cleanAll();
			//browserInstance.find('Link').simulate('click', { button: 0 })
		});

		it('renders without crashing', () => {
			if (browserInstance.find(Link).text() == 'Create')
				browserInstance.find(Link).simulate('click',{button: 0});
			expect(browserInstance.find(Link).text()).toEqual('Home');
			expect(browserInstance.find(CampaignCRUD)).toBeDefined();
		});

		it('should redirect', () => {
			if (browserInstance.find(Link).text() == 'Create')
				browserInstance.find(Link).simulate('click',{button: 0});
			expect(browserInstance.find(Link).text()).toEqual('Home');
			expect(browserInstance.find(Redirect)).toHaveLength(0);
			browserInstance.find(CampaignCRUD).setState({ submitted: true });
			expect(browserInstance.find(Redirect)).toHaveLength(1);
		});

		it('should redirect and back button', () => {
			if (browserInstance.find(Link).text() == 'Create')
				browserInstance.find(Link).simulate('click',{button: 0});
			expect(browserInstance.find(Link).text()).toEqual('Home');
			browserInstance.find(Link).simulate('click',{button: 0});
			expect(browserInstance.find(Link).text()).toEqual('Create');
			browserInstance.find(Link).simulate('click',{button: 0});
			expect(browserInstance.find(Link).text()).toEqual('Home');
			browserInstance.find("Button#BackButton").simulate('click', { button: 0 });
			// TODO: fix test so it actually checks that we went back
			//expect(browserInstance.find(Link).text()).toEqual('Create');
		});
	});

	const originalCampaign: ICampaignData = {
		Id: 0,
		Name: "Hello Original",
        Summary: "This is legit.",
        Notes: "The best around",
        Encounters: []
	}

	describe('render campaign from database', () => {
		beforeEach(async (done) => {
			nock.disableNetConnect();
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
			nock(API_URL)
			.get('/campaign/0')
			.reply(200, {
				status: 201,
				messages: ['success'],
				content: originalCampaign
			});
			campaignCRUDInstance = mount<CampaignCRUD, ICampaignCRUDProps, ICampaignCRUDState>(<CampaignCRUD Process={CRUDProcess.Edit} Id={0} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the CampaignCRUD to request the campaign from the database.
			expect(nock.isDone()).toEqual(true);
			done();
		});

		afterEach( () => {
			nock.cleanAll();
		});

		it('renders without crashing', () => {
			expect(campaignCRUDInstance).toBeDefined();
			expect(campaignCRUDInstance.state('Campaign')).toEqual(originalCampaign);
		});

		it('when no changes it sends the campaign back as it was', async (done) => {
			nock(API_URL)
			.post('/campaign/edit', originalCampaign)
			.reply(201, { status: 201, messages: ['success'] });
			campaignCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			campaignCRUDInstance.update();
			expect(campaignCRUDInstance.find('#ModalMessage').text()).toEqual("Campaign successfully updated.");
			expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});
	});

	describe('Server request Path for get', () => {

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
			.get('/campaign/0')
			.reply(404);
			campaignCRUDInstance = mount<CampaignCRUD, ICampaignCRUDProps, ICampaignCRUDState>(<CampaignCRUD Process={CRUDProcess.Edit} Id={0} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the CampaignCRUD to request the mosnter from the database.
			campaignCRUDInstance.update();
			expect(campaignCRUDInstance.find('#ModalMessage').text()).toEqual("There was an error sending your request.");
			expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you', async (done) => {
			nock(API_URL)
			.get('/campaign/0')
			.reply(200, { status: 400, messages: ["Campaign not found."]});
			campaignCRUDInstance = mount<CampaignCRUD, ICampaignCRUDProps, ICampaignCRUDState>(<CampaignCRUD Process={CRUDProcess.Edit} Id={0} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the CampaignCRUD to request the mosnter from the database.
			campaignCRUDInstance.update();
			expect(campaignCRUDInstance.find('#ModalMessage').text()).toEqual("Error finding campaign: Campaign not found.");
			expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you without any messages', async (done) => {
			nock(API_URL)
			.get('/campaign/0')
			.reply(200, { status: 401 });
			campaignCRUDInstance = mount<CampaignCRUD, ICampaignCRUDProps, ICampaignCRUDState>(<CampaignCRUD Process={CRUDProcess.Edit} Id={0} />);
			// THREE IS REQUIRED, SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the CampaignCRUD to request the mosnter from the database.
			campaignCRUDInstance.update();
			expect(campaignCRUDInstance.find('#ModalMessage').text()).toEqual("There was an error retreiving the campaign. Please try again later.");
			expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});
	});

	describe('Server request Path for submit', () => {

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
			campaignCRUDInstance = mount<CampaignCRUD, ICampaignCRUDProps, ICampaignCRUDState>(<CampaignCRUD Process={CRUDProcess.Edit} Id={0} />);
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
		});

		it('should be able to send campaign name only to edit', async (done) => {
			campaignCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/campaign/edit', {
				"Id": 0,
                "Name": "Hello",
                "Encounters": []
			})
			.reply(201, { status: 201, messages: ['success'] });
			campaignCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			campaignCRUDInstance.update();
			//expect(campaignCRUDInstance.find('#ModalMessage').text()).toEqual("Campaign successfully updated.");
			//expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when API route not found', async (done) => {
			campaignCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/campaign/edit', {
				"Id": 0,
                "Name": "Hello",
                "Encounters": []
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
			.post('/campaign/edit', {
				"Id": 0,
                "Name": "Hello",
                "Encounters": []
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
			.post('/campaign/edit', {
				"Id": 0,
                "Name": "Hello",
                "Encounters": []
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

		it('should show payload error message when campaign has an invalid field', async (done) => {
			campaignCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			campaignCRUDInstance.find('CampaignDetails').setState({ "InvalidEntry": 100 })
			campaignCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			campaignCRUDInstance.update();
			expect(campaignCRUDInstance.find('#ModalMessage').text()).toEqual("\"InvalidEntry\" is not allowed");
			expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			done();
		});
	});

	describe('Server request Path for props change', () => {

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
			campaignCRUDInstance = mount<CampaignCRUD, ICampaignCRUDProps, ICampaignCRUDState>(<CampaignCRUD Process={CRUDProcess.Edit} Id={0} />);
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
		});

		it('should show error message when API route not found', async (done) => {
			nock(API_URL)
			.get('/campaign/1')
			.reply(404);
			campaignCRUDInstance.setProps({Id: 1})
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
			nock(API_URL)
			.get('/campaign/1')
			.reply(200, { status: 400, messages: ["Invalid campaign id"]});
			campaignCRUDInstance.setProps({Id: 1})
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			campaignCRUDInstance.update();
			expect(campaignCRUDInstance.find('#ModalMessage').text()).toEqual("Error finding campaign: Invalid campaign id");
			expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you without any messages', async (done) => {
			nock(API_URL)
			.get('/campaign/1')
			.reply(200, { status: 401 });
			campaignCRUDInstance.setProps({Id: 1})
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			campaignCRUDInstance.update();
			expect(campaignCRUDInstance.find('#ModalMessage').text()).toEqual("There was an error retreiving the campaign. Please try again later.");
			expect(campaignCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should allow new campaign from server by new props', async (done) => {
			nock(API_URL)
			.get('/campaign/1')
			.reply(200, basicResponse);
			campaignCRUDInstance.setProps({Id: 1})
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			campaignCRUDInstance.update();
			expect(campaignCRUDInstance.state().Campaign).toEqual(basicResponse.content)
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
			.get('/campaign/0')
			.reply(200, {
				status: 201,
				messages: ['success'],
				content: originalCampaign
			});
			campaignCRUDInstance = mount<CampaignCRUD, ICampaignCRUDProps, ICampaignCRUDState>(<CampaignCRUD Process={CRUDProcess.Edit} Id={0} />);
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
		});

		it('renders correctly when the page is loaded', async (done) => {
			nock(API_URL)
			.get('/campaign/0')
			.reply(200, {
				status: 201,
				messages: ['success'],
				content: originalCampaign
			});
			const shallowCampaignCRUD = shallow<CampaignCRUD, ICampaignCRUDProps, ICampaignCRUDState>(<CampaignCRUD Process={CRUDProcess.Edit} Id={0} />);
			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			// expect the CampaignCRUD to request the mosnter from the database.
			expect(nock.isDone()).toEqual(true);
			expect(shallowCampaignCRUD).toMatchSnapshot();
			done();

		});

		it('should be able to edit all and send campaign to server edit', async (done) => {
			campaignCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			campaignCRUDInstance.find('textarea#Summary').simulate('change', { target: { value: "Gnome" } })
			campaignCRUDInstance.find('textarea#Notes').simulate('change', { target: { value: 'Very weak and sly' } })
			expect(campaignCRUDInstance.state()).toEqual({
				Process: CRUDProcess.Edit,
				Id: 0,
				submitted: false,
				modal: {
					open: false,
					message: ""
				},
				Campaign: originalCampaign
			})
			nock(API_URL)
			.post('/campaign/edit', {
				"Id": 0,
				"Name": "Hello",
				"Summary": "Gnome",
                "Notes": "Very weak and sly",
                "Encounters": []
			})
			.reply(201, { status: 201, messages: ['success'] });
			campaignCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			campaignCRUDInstance.update();
			expect(campaignCRUDInstance.find('#ModalMessage').text()).toEqual("Campaign successfully updated.");
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