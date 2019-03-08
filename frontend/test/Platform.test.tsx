import * as React from "react"
import {shallow, ShallowWrapper} from 'enzyme';
import { Platform } from "../src/renderer/components/Platform";
import { CookieManager as CookieManagerMock } from "../src/__mocks__/cookie";
import { CookieManager } from "../src/cookie";

jest.mock('../src/cookie');

describe('Platform Component', () => {
	let platformInstance: ShallowWrapper<Platform>;

	describe('user is logged in.', () => {

		beforeEach(() => {
			CookieManagerMock.SetStringCookie("session_token", "testToken");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
			platformInstance = shallow(<Platform/>);
		});

		it('renders without crashing', () => {
			expect(platformInstance).toBeDefined();
		});

		it('renders a registration-container classed component', () => {
			expect(platformInstance.find('.PlatformComponent')).toExist();
		});
	});
	describe('user is not logged in.', () => {

		beforeEach(() => {
			CookieManagerMock.RemoveCookie("session_token");
			// bind the normal user token function to the mock.
			CookieManager.UserToken = CookieManagerMock.UserToken.bind(CookieManager);
			CookieManager.RemoveCookie = CookieManagerMock.RemoveCookie.bind(CookieManager);
			CookieManager.SetStringCookie = CookieManagerMock.SetStringCookie.bind(CookieManager);
			platformInstance = shallow(<Platform/>);
		});

		it('redirects if user is not logged in', () => {
			expect(platformInstance.find('Redirect')).toExist();
		});
	});
});
