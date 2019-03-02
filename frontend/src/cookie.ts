const Store = require('electron-store');
const store = new Store();

export class CookieManager {

	public UserAuthenticated(cookieToCheck:string) {
		return this.GetCookie("session_token") != undefined
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