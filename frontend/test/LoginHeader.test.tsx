import * as React from "react";
import * as nock from 'nock';
import {shallow, ShallowWrapper} from 'enzyme';
import { LoginHeader } from "../src/renderer/components/LoginHeader";

jest.mock('../src/cookie');

describe('Login Component', () => {
	let loginInstance: ShallowWrapper<LoginHeader>;

	beforeEach(() => {
		loginInstance = shallow(<LoginHeader/>);
	});

	it('renders without crashing', () => {
		expect(loginInstance).toBeDefined();
	});

	it('renders a login-header-container classed component', () => {
		expect(loginInstance.find('.login-header-container')).toExist();
	});

	describe('should respond to change event and change the state of the Login Component', () => {
		it('username field works', () => {
			loginInstance.find('#username').simulate('change', {target: {value: 'test_username'}});
			expect(loginInstance.state('user')).toEqual({
				password: '',
				username: 'test_username'
			});
		});

		it('password field works', () => {
			loginInstance.find('#password').simulate('change', {target: {value: 'test_password'}});
			expect(loginInstance.state('user')).toEqual({
				password: 'test_password',
				username: ''
			});
		});
	});

	describe('makes a server request to log the user in', () => {

		it('successfully log in with correct credentials', () => {
			var usernameBox = loginInstance.find('#username');
			var passwordBox = loginInstance.find('#password');
			var loginForm = loginInstance.find('form');

			usernameBox.simulate('change', {target: {name: 'username', value: 'test_username'}});
			passwordBox.simulate('change', {target: {name: 'password', value: 'test_password'}});
			
			nock('http://3.18.65.138:3000')
				.post('/login', {
						"username": "test_username",
						"password": "test_password"
					})
				.reply(201, {
					body: [{ status: 201, message: 'Logged in successfully.', token: 'exampletoken' }],
				});
			loginForm.simulate('submit', {preventDefault() {}});
			expect(loginInstance.state('redirectToPlatform')).toEqual(true);
			expect(loginInstance.find('Redirect')).toExist();
		});

		// it('try to log in with wrong credentials', () => {
		// 	var usernameBox = loginInstance.find('#username');
		// 	var passwordBox = loginInstance.find('#password');
		// 	var loginForm = loginInstance.find('form');

		// 	usernameBox.simulate('change', {target: {name: 'username', value: 'test_username'}});
		// 	passwordBox.simulate('change', {target: {name: 'password', value: 'test_password'}});
		// 	//console.log(loginInstance.debug());
		// 	nock('http://3.18.65.138:3000')
		// 		.post('/login', {
		// 				"username": "test_username",
		// 				"password": "test_password"
		// 			})
		// 		.reply(400, {
		// 			body: [{ status: 400, message: 'Given credentials do not match with our records.'}],
		// 		});
		// 	loginForm.simulate('submit', {preventDefault() {}});
		// });
	});
});
