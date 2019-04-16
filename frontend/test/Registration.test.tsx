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
			emailBox.simulate('change', {target: {name: 'email', value: 'test_email'}});
			nameBox.simulate('change', {target: {name: 'name', value: 'test_name'}});

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

		it('opens and closes modals properly', () => {
			registerInstance.instance().openModal("This is a test");
			expect(registerInstance.find('#ModalMessage').text()).toEqual("This is a test");
			registerInstance.instance().closeModal();
			expect(registerInstance.state().modal.open).toBeFalsy();
		})
	});

	describe('makes a server request to register the user', () => {

		beforeEach(async (done) => {
			jest.setTimeout(10000);
			nock.disableNetConnect();
			done();
			//let scope: nock.Scope;
		});

		afterEach(() => {
			/*
			This works to detect when the nock is not used.
			However the register function is async so getting
				an expect to do anything useful was impossible.
			if(scope)
				expect(scope.pendingMocks()).toEqual([]);
			*/

			//console.log(nock.pendingMocks());
			nock.cleanAll();
			//console.log(nock.pendingMocks());
		})

		it('successfully register with correct credentials', async (done) => {

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

			var usernameBox = registerInstance.find('#username');
			var passwordBox = registerInstance.find('#password');
			var emailBox = registerInstance.find('#email');
			var nameBox = registerInstance.find('#name');

			usernameBox.simulate('change', {target: {name: 'username', value: 'test_username'}});
			passwordBox.simulate('change', {target: {name: 'password', value: 'test_password'}});
			emailBox.simulate('change', {target: {name: 'email', value: 'test_email'}});
			nameBox.simulate('change', {target: {name: 'name', value: 'test_name'}});

			registerInstance.instance().requestRegister({ preventDefault() {} } as React.FormEvent);

			// Promises are weird and need 3 app.
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));

			registerInstance.update();
			expect(registerInstance.find('#ModalMessage').text()).toEqual("Welcome aboard! You can now login with your username and password.");
			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when API route not found', async (done) => {

			nock(API_URL)
			.post('/register', {
					username: "test_username",
					password: "test_password",
					email   : "test_email",
					name    : "test_name"
				})
			.reply(404
			);

			var usernameBox = registerInstance.find('#username');
			var passwordBox = registerInstance.find('#password');
			var emailBox = registerInstance.find('#email');
			var nameBox = registerInstance.find('#name');

			usernameBox.simulate('change', {target: {name: 'username', value: 'test_username'}});
			passwordBox.simulate('change', {target: {name: 'password', value: 'test_password'}});
			emailBox.simulate('change', {target: {name: 'email', value: 'test_email'}});
			nameBox.simulate('change', {target: {name: 'name', value: 'test_name'}});

			registerInstance.instance().requestRegister({ preventDefault() {} } as React.FormEvent);

			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));

			registerInstance.update();

			expect(registerInstance.find('#ModalMessage').text()).toEqual("There was an error sending your request. Please try again later.");

			expect(nock.isDone()).toEqual(true);
			done();
		});

		it('should show error message when server denies you', async (done) => {

			nock(API_URL)
			.post('/register', {
					username: "test_username",
					password: "test_password",
					email   : "test_email",
					name    : "test_name"
				})
			.reply(200, {status: 400, messages: ["Password error or other validation error."]}
			);

			var usernameBox = registerInstance.find('#username');
			var passwordBox = registerInstance.find('#password');
			var emailBox = registerInstance.find('#email');
			var nameBox = registerInstance.find('#name');

			usernameBox.simulate('change', {target: {name: 'username', value: 'test_username'}});
			passwordBox.simulate('change', {target: {name: 'password', value: 'test_password'}});
			emailBox.simulate('change', {target: {name: 'email', value: 'test_email'}});
			nameBox.simulate('change', {target: {name: 'name', value: 'test_name'}});

			registerInstance.instance().requestRegister({ preventDefault() {} } as React.FormEvent);

			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));

			registerInstance.update();

			expect(registerInstance.find('#ModalMessage').text()).toEqual("Error registering: Password error or other validation error.");

			expect(nock.isDone()).toEqual(true);
			done();

		});

		it('should show error message when server denies you without any messages', async (done) => {

			nock(API_URL)
			.post('/register', {
					username: "test_username",
					password: "test_password",
					email   : "test_email",
					name    : "test_name"
				})
			.reply(200, { status: 401 }
			);

			var usernameBox = registerInstance.find('#username');
			var passwordBox = registerInstance.find('#password');
			var emailBox = registerInstance.find('#email');
			var nameBox = registerInstance.find('#name');

			usernameBox.simulate('change', {target: {name: 'username', value: 'test_username'}});
			passwordBox.simulate('change', {target: {name: 'password', value: 'test_password'}});
			emailBox.simulate('change', {target: {name: 'email', value: 'test_email'}});
			nameBox.simulate('change', {target: {name: 'name', value: 'test_name'}});


			registerInstance.instance().requestRegister({ preventDefault() {} } as React.FormEvent);

			// THREE IS REQUIRED,SOMETHING TO DO WITH NESTING PROMISES
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));
			await new Promise(resolve => setImmediate(resolve));

			registerInstance.update();

			expect(registerInstance.find('#ModalMessage').text()).toEqual("There was an error creating your account. Please try again later.");

			expect(nock.isDone()).toEqual(true);
			done();
		});

	});
});