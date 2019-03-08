import * as React from "react"
import * as nock from 'nock';
import {shallow, ShallowWrapper} from 'enzyme';
import { Registration } from "../src/renderer/components/Registration";
import { API_URL } from "../src/config";

jest.mock('../src/cookie');

describe('Register Component', () => {
	let registerInstance: ShallowWrapper<Registration>;

	beforeEach(() => {
		registerInstance = shallow(<Registration/>);
	});

	it('renders without crashing', () => {
		expect(registerInstance).toBeDefined();
	});

	it('renders a registration-container classed component', () => {
		expect(registerInstance.find('.registration-container')).toExist();
	});

	describe('should respond to change event and change the state of the Register Component', () => {
		it('all input fields work', () => {
			var usernameBox = registerInstance.find('#username');
			var passwordBox = registerInstance.find('#password');
			var emailBox = registerInstance.find('#email');
			var nameBox = registerInstance.find('#name');

			usernameBox.simulate('change', {target: {name: 'username', value: 'test_username'}});
			passwordBox.simulate('change', {target: {name: 'password', value: 'test_password'}});
			emailBox.simulate('change', {target: {name: 'username', value: 'test_email'}});
			nameBox.simulate('change', {target: {name: 'password', value: 'test_name'}});

			expect(registerInstance.state('user')).toEqual({
				password: 'test_password',
				username: 'test_username',
				email: 'test_email',
				name: 'test_name'
			});
		});
	});

	describe('makes a server request to register the user', () => {

		it('successfully register with correct credentials', () => {
			var usernameBox = registerInstance.find('#username');
			var passwordBox = registerInstance.find('#password');
			var emailBox = registerInstance.find('#email');
			var nameBox = registerInstance.find('#name');
			var registerForm = registerInstance.find('form');

			usernameBox.simulate('change', {target: {name: 'username', value: 'test_username'}});
			passwordBox.simulate('change', {target: {name: 'password', value: 'test_password'}});
			emailBox.simulate('change', {target: {name: 'username', value: 'test_email'}});
			nameBox.simulate('change', {target: {name: 'password', value: 'test_name'}});

			nock(API_URL)
				.post('/register', {
						"username": "test_username",
						"password": "test_password",
						"email"   : "test_email",
						"name"    : "test_name"
					})
				.reply(201, {
					body: [{ status: 201, messages: 'success' }],
				});
			registerForm.simulate('submit', {preventDefault() {}});
		});
	});
});
