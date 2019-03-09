import { API_URL } from "./config";

const Store = require('electron-store');
const store = new Store();

export class CookieManager {

	public UserAuthenticated(cookieToCheck:string) {

		var request = require("request");
		var options = { method: 'POST',
			url: API_URL + '/verify',
			timeout: 2000,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json',
				'Authorization': cookieToCheck
			},
			body: {},
			json: true
		};

		request(options, function (error: string, response: string, body: {status: number, message: string}) {
			if (error) {
				return false
			}
			else {
				return (body.status === 201) // Success
			}
		});

		return cookieToCheck !== undefined
	}

	public SetStringCookie(data:string, name:string) {
		store.set(name, data);
	}
	public GetCookie(name:string) {
		return store.get(name);
	}

	public RemoveCookie(name:string) {
		store.delete(name);
	}
}