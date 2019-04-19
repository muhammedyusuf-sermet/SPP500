import * as React from 'react';
import * as nock from 'nock';
import { mount, ReactWrapper } from 'enzyme';
import {CampaignCRUD, ICampaignCRUDState, ICampaignCRUDProps, CampaignCRUDState } from "../src/renderer/components/CampaignCreation";
//import {API_URL} from '../src/config'
import { CookieManager as CookieManagerMock } from "../src/__mocks__/cookie";
import { CookieManager } from "../src/cookie";
import { BrowserRouter } from 'react-router-dom';
jest.mock('../src/cookie');

////// Happy Path //////


describe('Campaign CRUD', () => {

	let campaignCreationInstance: ReactWrapper<ICampaignCRUDProps, ICampaignCRUDState, CampaignCRUD>;

	describe('Redirect if submitted', () => {
		beforeEach(() => {
			nock.disableNetConnect();
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
			campaignCreationInstance = mount<CampaignCRUD, ICampaignCRUDProps, ICampaignCRUDState>(<BrowserRouter><CampaignCRUD Process={CampaignCRUDState.Create} /></BrowserRouter>);
		})

		it('renders without crashing', () => {
			expect(campaignCreationInstance).toBeDefined();
		});

		it('should redirect', () => {
			expect(campaignCreationInstance.find('Redirect')).toHaveLength(0);
			campaignCreationInstance.find("CampaignCRUD").setState({ submitted: true });
			campaignCreationInstance.update();
			expect(campaignCreationInstance.find('Redirect')).toHaveLength(1);
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
			campaignCreationInstance = mount<CampaignCRUD, ICampaignCRUDProps, ICampaignCRUDState>(<CampaignCRUD Process={CampaignCRUDState.Create}/>);
		})

		it('renders without crashing', () => {
			expect(campaignCreationInstance).toBeDefined();
		});

		/*it('renders correctly when the page is loaded', () => {
			expect(campaignCreationInstance).toMatchSnapshot();
		});*/

		// it('should be able to send campaign name only to create', async (done) => {
        //     campaignCreationInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
        //     campaignCreationInstance.find('Input#Summary').simulate('change', { target: { value: 'Something in here.' } })
        //     campaignCreationInstance.find('Input#Notes').simulate('change', { target: { value: 'no' } })
		// 	nock(API_URL)
		// 	.post('/campaign/create', {
        //         "Name": "Hello",
        //         "Summary": "Something in here.",
        //         "Notes": "no",
        //         "Encounters": []
		// 	})
		// 	.reply(201, { status: 201, messages: ['success'] });
		// 	campaignCreationInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	campaignCreationInstance.update();
		// 	expect(campaignCreationInstance.find('#ModalMessage').text()).toEqual("Campaign successfully created.");
		// 	expect(campaignCreationInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
		// 	expect(nock.isDone()).toEqual(true);
		// 	done();
		// });

		// it('should show error message when API route not found', async (done) => {
		// 	campaignCreationInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
        //     campaignCreationInstance.find('Input#Summary').simulate('change', { target: { value: 'Something in here.' } })
        //     campaignCreationInstance.find('Input#Notes').simulate('change', { target: { value: 'no' } })
		// 	nock(API_URL)
		// 	.post('/campaign/create', {
        //         "Name": "Hello",
        //         "Summary": "Something in here.",
        //         "Notes": "no"
		// 	})
		// 	.reply(404);
		// 	campaignCreationInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	campaignCreationInstance.update();
		// 	expect(campaignCreationInstance.find('#ModalMessage').text()).toEqual("There was an error sending your request.");
		// 	expect(campaignCreationInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
		// 	expect(nock.isDone()).toEqual(true);
		// 	done();
		// });

		// it('should show error message when server denies you', async (done) => {
		// 	campaignCreationInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
        //     campaignCreationInstance.find('Input#Summary').simulate('change', { target: { value: 'Something in here.' } })
        //     campaignCreationInstance.find('Input#Notes').simulate('change', { target: { value: 'no' } })
		// 	nock(API_URL)
		// 	.post('/campaign/create', {
        //         "Name": "Hello",
        //         "Summary": "Something in here.",
        //         "Notes": "no"
		// 	})
		// 	.reply(200, { status: 400, messages: ["Invalid campaign object"]});
		// 	campaignCreationInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	campaignCreationInstance.update();
		// 	expect(campaignCreationInstance.find('#ModalMessage').text()).toEqual("Invalid campaign object");
		// 	expect(campaignCreationInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
		// 	expect(nock.isDone()).toEqual(true);
		// 	done();
		// });

		// it('should show error message when server denies you without any messages', async (done) => {
		// 	campaignCreationInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
        //     campaignCreationInstance.find('Input#Summary').simulate('change', { target: { value: 'Something in here.' } })
        //     campaignCreationInstance.find('Input#Notes').simulate('change', { target: { value: 'no' } })
		// 	nock(API_URL)
		// 	.post('/campaign/create', {
        //         "Name": "Hello",
        //         "Summary": "Something in here.",
        //         "Notes": "no"
		// 	})
		// 	.reply(200, { status: 401 });
		// 	campaignCreationInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	campaignCreationInstance.update();
		// 	expect(campaignCreationInstance.find('#ModalMessage').text()).toEqual("There was an error submitting your request. Please try again later.");
		// 	expect(campaignCreationInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
		// 	expect(nock.isDone()).toEqual(true);
		// 	done();
		// });

		// it('should show payload error message when campaign is not properly formed', async (done) => {
		// 	campaignCreationInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
        //     campaignCreationInstance.find('Input#Summary').simulate('change', { target: { value: 'Something in here.' } })
        //     campaignCreationInstance.find('Input#Notes').simulate('change', { target: { value: 'no' } });
		// 	nock(API_URL)
		// 	.post('/campaign/create', {
        //         "Name": "Hello",
        //         "Summary": "Something in here.",
        //         "Notes": "no"
		// 	})
		// 	.reply(200, { status: 401 });
		// 	campaignCreationInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	campaignCreationInstance.update();
		// 	expect(campaignCreationInstance.find('#ModalMessage').text()).toEqual("\"Strength\" must be greater than 0");
		// 	expect(campaignCreationInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
		// 	done();
		// });

		// it('should show payload error message when campaign has an invalid skill', async (done) => {
		// 	campaignCreationInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
        //     campaignCreationInstance.find('Input#Summary').simulate('change', { target: { value: 'Something in here.' } })
        //     campaignCreationInstance.find('Input#Notes').simulate('change', { target: { value: 'no' } });
		// 	nock(API_URL)
		// 	.post('/campaign/create', {
        //         "Name": "Hello",
        //         "Summary": "Something in here.",
        //         "Notes": "no"
		// 	})
		// 	.reply(200, { status: 401 });
		// 	campaignCreationInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	campaignCreationInstance.update();
		// 	expect(campaignCreationInstance.find('#ModalMessage').text()).toEqual("\"InvalidSkillName\" is not allowed");
		// 	expect(campaignCreationInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
		// 	done();
		// });

		// it('should show payload error message when campaign has an invalid Size', async (done) => {
		// 	campaignCreationInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
        //     campaignCreationInstance.find('Input#Summary').simulate('change', { target: { value: 'Something in here.' } })
        //     campaignCreationInstance.find('Input#Notes').simulate('change', { target: { value: 'no' } });
		// 	nock(API_URL)
		// 	.post('/campaign/create', {
        //         "Name": "Hello",
        //         "Summary": "Something in here.",
        //         "Notes": "no"
		// 	})
		// 	.reply(200, { status: 401 });
		// 	campaignCreationInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	campaignCreationInstance.update();
		// 	expect(campaignCreationInstance.find('#ModalMessage').text()).toEqual("\"Size\" must be one of Tiny,Small,Medium,Large,Huge,Gargantuan");
		// 	expect(campaignCreationInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
		// 	done();
		// });

		// it('should be able to send campaign to create', async (done) => {
		// 	campaignCreationInstance.find('Input#Name').simulate('change', { target: { value: 'Hello' } })
        //     campaignCreationInstance.find('Input#Summary').simulate('change', { target: { value: 'Something in here.' } })
        //     campaignCreationInstance.find('Input#Notes').simulate('change', { target: { value: 'no' } })
		// 	nock(API_URL)
		// 	.post('/campaign/create', {
        //         "Name": "Hello",
        //         "Summary": "Something in here.",
        //         "Notes": "no"
		// 	})
		// 	.reply(200, { status: 401 });
		// 	campaignCreationInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			
		// 	//console.log(campaignCreationInstance.state())
		// 	expect(campaignCreationInstance.state()).toEqual({
		// 		Id: undefined,
		// 		Name: 'Hello',
		// 		NameError: undefined,
		// 		Summary: "Something in here.",
		// 		SummaryError: undefined,
		// 		Notes: "no",
		// 		NotesError: undefined,
		// 		submitted: false,
		// 		modal: {
		// 			open: false,
		// 			message: ""
		// 		},
		// 	})
		// 	nock(API_URL)
		// 	.post('/campaign/create', {
        //         "Name": "Hello",
        //         "Summary": "Something in here.",
        //         "Notes": "no"
		// 	})
		// 	.reply(201, { status: 201, message: 'success' });
		// 	campaignCreationInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	await new Promise(resolve => setImmediate(resolve));
		// 	campaignCreationInstance.update();
		// 	expect(campaignCreationInstance.find('#ModalMessage').text()).toEqual("Campaign successfully created.");
		// 	expect(campaignCreationInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
		// 	expect(nock.isDone()).toEqual(true);
		// 	done();
		// });

		describe('should show and hide modal', () => {
			it('show modal', () => {
				campaignCreationInstance.instance().closeModal();
				campaignCreationInstance.update();
				expect(campaignCreationInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(false);
				campaignCreationInstance.instance().openModal('TestMessage');
				campaignCreationInstance.update();
				expect(campaignCreationInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				expect(campaignCreationInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
			});

			it('close modal', () => {
				campaignCreationInstance.instance().openModal('TestMessage');
				campaignCreationInstance.update();
				expect(campaignCreationInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				expect(campaignCreationInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
				campaignCreationInstance.instance().closeModal();
				campaignCreationInstance.update();
				expect(campaignCreationInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(false);
			});

			it('close modal by click', () => {
				campaignCreationInstance.instance().openModal('TestMessage');
				campaignCreationInstance.update();
				expect(campaignCreationInstance.find('#ModalMessage').text().length).toBeGreaterThan(0);
				expect(campaignCreationInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(true);
				let background = campaignCreationInstance.find('ModalBackground#modalBackground')
				background.simulate('click');
				campaignCreationInstance.update();
				expect(campaignCreationInstance.find('Modal#CampaignCRUDModal').prop('isActive')).toEqual(false);
			});
		});
	})
	// input.simulate('change', { target: { value: 'Hello' } })

////// Sad Paths: To Fix Later, Enzyme is not Cooperating//////

	describe("Sad paths", () => {
			
		})
})