import * as React from 'react';
import * as nock from 'nock';
import { mount, ReactWrapper, shallow } from 'enzyme';
import { CampaignCRUD, ICampaignCRUDState, ICampaignCRUDProps } from "../src/renderer/components/CampaignCRUD";

import {API_URL} from '../src/config'
import { CookieManager as CookieManagerMock } from "../src/__mocks__/cookie";
import { CookieManager } from "../src/cookie";
import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom';
import { CRUDProcess } from '../src/renderer/components/MonsterCRUD';

jest.mock('../src/cookie');

////// Happy Path //////


describe('Campaign CRUD create', () => {

	let characterCRUDInstance: ReactWrapper<ICampaignCRUDProps, ICampaignCRUDState, CampaignCRUD>;

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
			characterCRUDInstance = {} as any
			if(characterCRUDInstance)
				characterCRUDInstance = {} as any
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

	describe('Happy Path', () => {

		beforeEach(() => {
			nock.disableNetConnect();
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
			characterCRUDInstance = mount<CampaignCRUD, ICampaignCRUDProps, ICampaignCRUDState>(<CampaignCRUD Process={CRUDProcess.Create} />);
		})

		it('renders without crashing', () => {
			expect(characterCRUDInstance).toBeDefined();
		});

		it('renders correctly when the page is loaded', () => {
			const shallowCampaignCRUD = shallow<CampaignCRUD, ICampaignCRUDProps, ICampaignCRUDState>(<CampaignCRUD Process={CRUDProcess.Create} />);

			expect(shallowCampaignCRUD).toMatchSnapshot();
		});

		it('should be able to send campaign name only to create', async (done) => {
			characterCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/campaign/create', {
				"Name": "Hello",
				"Encounters": [],
				"Characters": []
			})
			.reply(201, { status: 201, messages: ['success'] });
			characterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			characterCRUDInstance.update();
			expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual("Campaign successfully created.");
			expect(characterCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when API route not found', async (done) => {
			characterCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/campaign/create', {
				"Name": "Hello",
				"Encounters": [],
				"Characters": []
			})
			.reply(404);
			characterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			characterCRUDInstance.update();
			expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual("There was an error sending your request.");
			expect(characterCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you', async (done) => {
			characterCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/campaign/create', {
				"Name": "Hello",
				"Encounters": [],
				"Characters": []
			})
			.reply(200, { status: 400, messages: ["Invalid campaign object"]});
			characterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			characterCRUDInstance.update();
			expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual("Invalid campaign object");
			expect(characterCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you without any messages', async (done) => {
			characterCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/campaign/create', {
				"Name": "Hello",
				"Encounters": [],
				"Characters": []
			})
			.reply(200, { status: 401 });
			characterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			characterCRUDInstance.update();
			expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual("There was an error submitting your request. Please try again later.");
			expect(characterCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show payload error message when campaign is not properly formed', async (done) => {
			characterCRUDInstance.find('input#Name').simulate('change', { target: { value: '' } })
			characterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			characterCRUDInstance.update();
			expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual("\"Name\" is required");
			expect(characterCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			done();
		});

		it('should show payload error message when campaign has an invalid Name', async (done) => {
			characterCRUDInstance.find('input#Name').simulate('change', { target: { value: '' } })
			characterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			characterCRUDInstance.update();
			expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual("\"Name\" is required");
			expect(characterCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			done();
		});

		it('should show payload error message when campaign has an extra field', async (done) => {
			characterCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			characterCRUDInstance.find('CampaignDetails').setState({ Extra: "InvalidField" })
			characterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			characterCRUDInstance.update();
			expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual("\"Extra\" is not allowed");
			expect(characterCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			done();
		});

		it('should be able to send campaign to create', async (done) => {
			characterCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			characterCRUDInstance.find('textarea#Summary').simulate('change', { target: { value: "Winner takes all." } })
			characterCRUDInstance.find('textarea#Notes').simulate('change', { target: { value: "Kill small creatures first." } })
			characterCRUDInstance.find('textarea#Encounters').simulate('change', { target: { value: "1,2" } })
			characterCRUDInstance.find('textarea#Characters').simulate('change', { target: { value: "1" } })
			expect(characterCRUDInstance.state()).toEqual({
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
			characterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			characterCRUDInstance.update();
			expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual("Campaign successfully created.");
			expect(characterCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});
		
		describe('should show and hide modal', () => {
			it('show modal', () => {
				characterCRUDInstance.instance().closeModal();
				characterCRUDInstance.update();
				expect(characterCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(false);
				characterCRUDInstance.instance().openModal('TestMessage');
				characterCRUDInstance.update();
				expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				expect(characterCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			});

			it('close modal', () => {
				characterCRUDInstance.instance().openModal('TestMessage');
				characterCRUDInstance.update();
				expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				expect(characterCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
				characterCRUDInstance.instance().closeModal();
				characterCRUDInstance.update();
				expect(characterCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(false);
			});

			it('close modal by click', () => {
				characterCRUDInstance.instance().openModal('TestMessage');
				characterCRUDInstance.update();
				expect(characterCRUDInstance.find('#ModalMessage').text().length).toBeGreaterThan(0);
				expect(characterCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
				let background = characterCRUDInstance.find('ModalBackground#modalBackground')
				background.simulate('click');
				characterCRUDInstance.update();
				expect(characterCRUDInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(false);
			});
		});
	});
});