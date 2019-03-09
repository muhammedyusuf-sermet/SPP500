import { API_URL } from "./config";
import Store from 'electron-store';

export class CookieManager {
	private constructor(){
	}

	private static store = new Store<string>();

	public static UserToken(cookieToCheck:string):string {
		// undefined if user is not logged in.
		var cookieVal = CookieManager.store.get(cookieToCheck);

		if (cookieVal === undefined)
			return cookieVal

		var request = require("request");
		var options = { method: 'GET',
			url: API_URL + '/verify',
			timeout: 2000,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json',
				'Authorization': cookieVal
			},
			body: {},
			json: true
		};

		request(options, function (error: string, response: string, body: {status: number, message: string}) {
			if (error) {
				return undefined
			}
			else {
				return (body.status === 201) ? "Valid cookie" : undefined // Success
			}
		});
		return CookieManager.store.get(cookieToCheck);
	}

	public static SetStringCookie(name:string, data:string) {
		CookieManager.store.set(name, data);
	}

	public static RemoveCookie(name:string) {
		CookieManager.store.delete(name);
	}
}
