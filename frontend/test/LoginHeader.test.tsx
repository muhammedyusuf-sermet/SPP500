import * as React from "react";
// import * as nock from 'nock';
import {shallow, ShallowWrapper} from 'enzyme';
import { LoginHeader } from "../src/renderer/components/LoginHeader";

describe('Login Component', () => {
	let loginInstance: ShallowWrapper<LoginHeader>;

	beforeEach(() => {
		loginInstance = shallow(<LoginHeader/>);
	});

	it('renders a login-header-container classed component', () => {
		expect(loginInstance.find('.login-header-container')).toExist();
	});

	describe('should respond to change event and change the state of the Login Component', () => {
		it('username and password fields work', () => {
			loginInstance.find('#username').simulate('change', {target: {name: 'username', value: 'johndoe'}});
			loginInstance.find('#password').simulate('change', {target: {name: 'password', value: 'johndoe'}});
			expect(loginInstance.state('user')).toEqual({
				password: 'johndoe',
				username: 'johndoe'
			});
		});
	});

	describe('makes a server request to log the user in', () => {
		it('renders a warning message when credentials are wrong', () => {
			// loginInstance.find('#username').simulate('change', {target: {name: 'username', value: 'yusuftest'}});
			// loginInstance.find('#password').simulate('change', {target: {name: 'password', value: 'yusuftest'}});
			
			// nock('http://3.18.65.138:3000')
			// 	.post('/login', {
			// 			"username": "yusuftest",
			// 			"password": "yusuftest"
			// 		})
			// 	.reply(201, {
			// 		error: "asd",
			// 		response: "asds",
			// 		body: [{ status: 201, message: 'Success', token: 'exampletoken' }],
			// 	});
			// loginInstance.find('form').simulate('submit', {preventDefault() {}});
			// expect(loginInstance.state('redirectToPlatform')).toEqual(true);
			// // expect(loginInstance.state('snackbar')).toEqual({
			// // 	open: true,
			// // 	message: 'johndoe'
			// // });
			// console.log(loginInstance.debug());
			// //expect(wrapper.find('#snackbarLogin').prop('open')).toEqual(true);
		});
	});
});
