import * as React from "react";
import * as nock from 'nock';
import { mount, ReactWrapper } from 'enzyme';
import { LoginHeader, ILoginState } from "../src/renderer/components/LoginHeader";
import { context } from "./testHelpers";

jest.mock('../src/renderer/components/AuthContext');

describe('Login Component', () => {
	let loginInstance: ReactWrapper<any, ILoginState, LoginHeader>;

	describe('user has not logged in', () => {
		beforeEach(() => {
			nock.disableNetConnect();
			context.isAuth = undefined;
			loginInstance = mount<LoginHeader, any, ILoginState>(<LoginHeader/>);
		});

		it('renders without crashing', () => {
			expect(loginInstance).toBeDefined();
		});

		describe('should respond to change event and change the state of the Login Component', () => {
			it('username field works', () => {
				loginInstance.find('Input#username').simulate('change', {target: {value: 'test_username'}});
				expect(loginInstance.state().user.username).toEqual('test_username');
			});

			it('password field works', () => {
				loginInstance.find('Input#password').simulate('change', {target: {value: 'test_password'}});
				expect(loginInstance.state().user.password).toEqual('test_password');
			});
		});

		describe('makes a auth request to log the user in', () => {
			it('should pass the user to auth', () => {
				var usernameBox = loginInstance.find('Input#username');
				var passwordBox = loginInstance.find('Input#password');
				var loginForm = loginInstance.find('form');

				usernameBox.simulate('change', {target: {name: 'username', value: 'test_username'}});
				passwordBox.simulate('change', {target: {name: 'password', value: 'test_password'}});

				loginForm.simulate('submit', {preventDefault: () => {}});
				expect((context.login as jest.Mock<any, any>).mock.calls.length).toBe(1);
				expect((context.login as jest.Mock<any, any>).mock.calls[0][0]).toEqual({password: "test_password", username: "test_username"});
			});

			it('displays login message', () => {
				context.login = (user: any, callback?: (message: string) => void) => {
					if (callback)
						callback("Test Logged in successfuly.");
				}
				loginInstance = mount<LoginHeader, any, ILoginState>(<LoginHeader/>);
				var usernameBox = loginInstance.find('Input#username');
				var passwordBox = loginInstance.find('Input#password');
				var loginForm = loginInstance.find('form');

				usernameBox.simulate('change', {target: {name: 'username', value: 'test_username'}});
				passwordBox.simulate('change', {target: {name: 'password', value: 'test_password'}});

				loginForm.simulate('submit', {preventDefault: () => {}});

				loginInstance.update();
				expect(loginInstance.find('#ModalMessage').text()).toEqual("Test Logged in successfuly.");
				expect(loginInstance.find('Modal#loginModal').prop('isActive')).toEqual(true);
			});
		});

		describe('should show and hide modal', () => {
			it('show modal', () => {
				loginInstance.instance().closeModal();
				expect(loginInstance.find('Modal#loginModal').prop('isActive')).toEqual(false);
				loginInstance.instance().openModal('TestMessage');
				expect(loginInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				loginInstance.update();
				expect(loginInstance.find('Modal#loginModal').prop('isActive')).toEqual(true);
			})

			it('close modal', () => {
				loginInstance.instance().openModal('TestMessage');
				expect(loginInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				loginInstance.update();
				expect(loginInstance.find('Modal#loginModal').prop('isActive')).toEqual(true);
				loginInstance.instance().closeModal();
				loginInstance.update();
				expect(loginInstance.find('Modal#loginModal').prop('isActive')).toEqual(false);
			})

			it('close modal by click', () => {
				loginInstance.instance().openModal('TestMessage');
				expect(loginInstance.find('#ModalMessage').text().length).toBeGreaterThan(0);
				loginInstance.update();
				expect(loginInstance.find('Modal#loginModal').prop('isActive')).toEqual(true);
				let background = loginInstance.find('div#modalBackground')
				background.simulate('click');
				loginInstance.update();
				expect(loginInstance.find('Modal#loginModal').prop('isActive')).toEqual(false);
			})
		});
	});

	describe('user has logged in', () => {
		beforeEach(() => {
			nock.disableNetConnect();
			context.isAuth = 'testToken';
			loginInstance = mount<LoginHeader, any, ILoginState>(<LoginHeader/>);
		});

		describe('should respond to logout button', () => {
			it('logout button works', () => {
				loginInstance.find('Button#logout').simulate('click', {preventDefault: () => {}});
				expect((context.logout as jest.Mock<any, any>).mock.calls.length).toBe(1);
				expect((context.logout as jest.Mock<any, any>).mock.calls[0].length).toBe(1);
				loginInstance.update();
			});

			it('displays logout message', () => {
				context.isAuth = 'testToken';
				context.logout = (callback?: (message: string) => void) => {
					if (callback)
						callback("Test Logged out successfuly.");
				}
				loginInstance = mount<LoginHeader, any, ILoginState>(<LoginHeader/>);
				loginInstance.find('Button#logout').simulate('click', {preventDefault: () => {}});
				loginInstance.update();
				expect(loginInstance.find('#ModalMessage').text()).toEqual('Test Logged out successfuly.');
				expect(loginInstance.find('Modal#loginModal').prop('isActive')).toEqual(true);
			});
		});

		describe('should show and hide modal', () => {
			it('show modal', () => {
				loginInstance.instance().closeModal();
				expect(loginInstance.find('Modal#loginModal').prop('isActive')).toEqual(false);
				loginInstance.instance().openModal('TestMessage');
				expect(loginInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				loginInstance.update();
				expect(loginInstance.find('Modal#loginModal').prop('isActive')).toEqual(true);
			})

			it('close modal', () => {
				loginInstance.instance().openModal('TestMessage');
				expect(loginInstance.find('#ModalMessage').text()).toEqual('TestMessage');
				loginInstance.update();
				expect(loginInstance.find('Modal#loginModal').prop('isActive')).toEqual(true);
				loginInstance.instance().closeModal();
				loginInstance.update();
				expect(loginInstance.find('Modal#loginModal').prop('isActive')).toEqual(false);
			})

			it('close modal by click', () => {
				loginInstance.instance().openModal('TestMessage');
				expect(loginInstance.find('#ModalMessage').text().length).toBeGreaterThan(0);
				loginInstance.update();
				expect(loginInstance.find('Modal#loginModal').prop('isActive')).toEqual(true);
				let background = loginInstance.find('div#modalBackground')
				background.simulate('click');
				loginInstance.update();
				expect(loginInstance.find('Modal#loginModal').prop('isActive')).toEqual(false);
			})
		});
	});
});
