import * as React from 'react';
import * as nock from 'nock';
import { mount, ReactWrapper, shallow } from 'enzyme';
import { CharacterCRUD, ICharacterCRUDState, ICharacterCRUDProps, CharacterCRUDProcess } from "../src/renderer/components/CharacterCRUD";

import {API_URL} from '../src/config'
import { CookieManager as CookieManagerMock } from "../src/__mocks__/cookie";
import { CookieManager } from "../src/cookie";
import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom';

jest.mock('../src/cookie');

////// Happy Path //////


describe('Character CRUD create', () => {

	let characterCRUDInstance: ReactWrapper<ICharacterCRUDProps, ICharacterCRUDState, CharacterCRUD>;

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
								<CharacterCRUD Process={CharacterCRUDProcess.Create} />
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
			expect(browserInstance.find(CharacterCRUD)).toBeDefined();
		});

		it('should redirect', () => {
			if (browserInstance.find(Link).text() == 'Create')
				browserInstance.find(Link).simulate('click',{button: 0});
			expect(browserInstance.find(Link).text()).toEqual('Home');
			expect(browserInstance.find(Redirect)).toHaveLength(0);
			browserInstance.find(CharacterCRUD).setState({ submitted: true });
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
			characterCRUDInstance = mount<CharacterCRUD, ICharacterCRUDProps, ICharacterCRUDState>(<CharacterCRUD Process={CharacterCRUDProcess.Create} />);
		})

		it('renders without crashing', () => {
			expect(characterCRUDInstance).toBeDefined();
		});

		it('renders correctly when the page is loaded', () => {
			const shallowCharacterCRUD = shallow<CharacterCRUD, ICharacterCRUDProps, ICharacterCRUDState>(<CharacterCRUD Process={CharacterCRUDProcess.Create} />);

			expect(shallowCharacterCRUD).toMatchSnapshot();
		});

		it('should be able to send character name only to create', async (done) => {
			characterCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/character/create', {
				"Name": "Hello"
			})
			.reply(201, { status: 201, messages: ['success'] });
			characterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			characterCRUDInstance.update();
			expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual("Character successfully created.");
			expect(characterCRUDInstance.find('Modal#characterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when API route not found', async (done) => {
			characterCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/character/create', {
				"Name": "Hello"
			})
			.reply(404);
			characterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			characterCRUDInstance.update();
			expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual("There was an error sending your request.");
			expect(characterCRUDInstance.find('Modal#characterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you', async (done) => {
			characterCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/character/create', {
				"Name": "Hello"
			})
			.reply(200, { status: 400, messages: ["Invalid character object"]});
			characterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			characterCRUDInstance.update();
			expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual("Invalid character object");
			expect(characterCRUDInstance.find('Modal#characterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you without any messages', async (done) => {
			characterCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			nock(API_URL)
			.post('/character/create', {
				"Name": "Hello"
			})
			.reply(200, { status: 401 });
			characterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			characterCRUDInstance.update();
			expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual("There was an error submitting your request. Please try again later.");
			expect(characterCRUDInstance.find('Modal#characterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show payload error message when character is not properly formed', async (done) => {
			characterCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			characterCRUDInstance.find('input#MaxHealth').simulate('change', { target: { value: -1 } })
			characterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			characterCRUDInstance.update();
			expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual("\"MaxHealth\" must be greater than 0");
			expect(characterCRUDInstance.find('Modal#characterCRUDModal').prop('isActive')).toEqual(true);
			done();
		});

		it('should show payload error message when character has an invalid Race', async (done) => {
			characterCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			characterCRUDInstance.find('CharacterDetails').setState({ Race: "InvalidRace" })
			characterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			characterCRUDInstance.update();
			expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual("\"Race\" must be one of Dragonborn,Dwarf,Elf,Gnome,HalfElf,Halfling,HalfOrc,Human,Tiefling");
			expect(characterCRUDInstance.find('Modal#characterCRUDModal').prop('isActive')).toEqual(true);
			done();
		});

		it('should show payload error message when character has an extra field', async (done) => {
			characterCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			characterCRUDInstance.find('CharacterDetails').setState({ Extra: "InvalidField" })
			characterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			characterCRUDInstance.update();
			expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual("\"Extra\" is not allowed");
			expect(characterCRUDInstance.find('Modal#characterCRUDModal').prop('isActive')).toEqual(true);
			done();
		});

		it('should be able to send character to create', async (done) => {
			characterCRUDInstance.find('input#Name').simulate('change', { target: { value: 'Hello' } })
			characterCRUDInstance.find('select#Race').simulate('change', { target: { value: "Gnome" } })
			characterCRUDInstance.find('select#Class').simulate('change', { target: { value: "Ranger" } })
			characterCRUDInstance.find('input#Level').simulate('change', { target: { value: 3 } })
			characterCRUDInstance.find('input#ArmorClass').simulate('change', { target: { value: 15 } })
			characterCRUDInstance.find('input#MaxHealth').simulate('change', { target: { value: 40 } })
			characterCRUDInstance.find('textarea#Notes').simulate('change', { target: { value: 'Very weak and sly' } })
			expect(characterCRUDInstance.state()).toEqual({
				Process: CharacterCRUDProcess.Create,
				Id: undefined,
				submitted: false,
				modal: {
					open: false,
					message: ""
				},
				Character: {
					Name: '',
				},
			})
			nock(API_URL)
			.post('/character/create', {
				"Name": "Hello",
				"Race": "Gnome",
				"Class": "Ranger",
				"Level": 3,
				"ArmorClass": 15,
				"MaxHealth": 40,
				"Notes": "Very weak and sly",
			})
			.reply(201, { status: 201, message: 'success' });
			characterCRUDInstance.instance().submitForm({ preventDefault() {} } as React.FormEvent);
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			characterCRUDInstance.update();
			expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual("Character successfully created.");
			expect(characterCRUDInstance.find('Modal#characterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
		});

		describe('should show and hide modal', () => {
			it('show modal', () => {
				characterCRUDInstance.instance().closeModal();
				characterCRUDInstance.update();
				expect(characterCRUDInstance.find('Modal#characterCRUDModal').prop('isActive')).toEqual(false);
				characterCRUDInstance.instance().openModal('TestMessage');
				characterCRUDInstance.update();
				expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				expect(characterCRUDInstance.find('Modal#characterCRUDModal').prop('isActive')).toEqual(true);
			});

			it('close modal', () => {
				characterCRUDInstance.instance().openModal('TestMessage');
				characterCRUDInstance.update();
				expect(characterCRUDInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				expect(characterCRUDInstance.find('Modal#characterCRUDModal').prop('isActive')).toEqual(true);
				characterCRUDInstance.instance().closeModal();
				characterCRUDInstance.update();
				expect(characterCRUDInstance.find('Modal#characterCRUDModal').prop('isActive')).toEqual(false);
			});

			it('close modal by click', () => {
				characterCRUDInstance.instance().openModal('TestMessage');
				characterCRUDInstance.update();
				expect(characterCRUDInstance.find('#ModalMessage').text().length).toBeGreaterThan(0);
				expect(characterCRUDInstance.find('Modal#characterCRUDModal').prop('isActive')).toEqual(true);
				let background = characterCRUDInstance.find('ModalBackground#modalBackground')
				background.simulate('click');
				characterCRUDInstance.update();
				expect(characterCRUDInstance.find('Modal#characterCRUDModal').prop('isActive')).toEqual(false);
			});
		});
	});
});