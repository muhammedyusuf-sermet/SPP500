import * as React from "react"
import * as nock from 'nock';
import {shallow, ShallowWrapper} from 'enzyme';
import { Registration, IRegisterState } from "../src/renderer/components/Registration";
import { API_URL } from "../src/config";

jest.mock('../src/cookie');

describe('Register Component', () => {
	let registerInstance: ShallowWrapper<any, IRegisterState, Registration>;

	beforeEach(() => {
		registerInstance = shallow(<Registration/>);
	});

	it ('matches snapshot', () => {
		expect(registerInstance).toMatchSnapshot();
	});

	it('renders without crashing', () => {
		expect(registerInstance).toBeDefined();
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

	describe('should show and hide modal', () => {
		it('show modal', () => {
			registerInstance.instance().closeModal();
			expect(registerInstance.find('#registerModal').prop('isActive')).toEqual(false);
			registerInstance.instance().openModal('TestMessage');
			expect(registerInstance.find('#ModalMessage').text()).toEqual('TestMessage');
			expect(registerInstance.find('#registerModal').prop('isActive')).toEqual(true);
		})

		it('close modal', () => {
			registerInstance.instance().openModal('TestMessage');
			expect(registerInstance.find('#ModalMessage').text()).toEqual('TestMessage');
			expect(registerInstance.find('#registerModal').prop('isActive')).toEqual(true);
			registerInstance.instance().closeModal();
			expect(registerInstance.find('#registerModal').prop('isActive')).toEqual(false);
		})

		it('close modal by click', () => {
			registerInstance.instance().openModal('TestMessage');
			expect(registerInstance.find('#ModalMessage').text().length).toBeGreaterThan(0);
			expect(registerInstance.find('#registerModal').prop('isActive')).toEqual(true);
			let background = registerInstance.find('#modalBackground')
			background.simulate('click');
			expect(registerInstance.find('#registerModal').prop('isActive')).toEqual(false);
		})
	});

	describe('makes a server request to register the user', () => {

		beforeEach(async (done) => {
			nock.disableNetConnect();
			//let scope: nock.Scope;
			nock(API_URL)
			.post('/register', {
					username: "test_username",
					password: "test_password",
					email   : "test_email",
					name    : "test_name"
				})
			.reply(201,
				{ status: 201, messages: 'success' },
			);
			
		});

		afterEach(() => {
			/*
			This works to detect when the nock is not used.
			However the register function is async so getting
				an expect to do anything useful was impossible.
			if(scope)
				expect(scope.pendingMocks()).toEqual([]);
			*/
		})

		it('successfully register with correct credentials', async (done) => {
			var usernameBox = registerInstance.find('#username');
			var passwordBox = registerInstance.find('#password');
			var emailBox = registerInstance.find('#email');
			var nameBox = registerInstance.find('#name');
			//var registerForm = registerInstance.find('form');

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

				// requestRegister
			registerInstance.instance().requestRegister({ preventDefault() {} } as React.FormEvent);
			//registerForm.simulate('submit', {preventDefault: () => {}});
			await new Promise(resolve => setImmediate(resolve));
			registerInstance.update();
			//expect(monsterCRUDInstance.find('#ModalMessage').text()).toEqual("Monster successfully updated.");
			//expect(monsterCRUDInstance.find('Modal#monsterCRUDModal').prop('isActive')).toEqual(true);
			expect(nock.isDone()).toEqual(true);
			done();
			
		});
	});
});
