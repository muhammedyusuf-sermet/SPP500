import Store from 'electron-store';

export class CookieManager {
	private constructor(){
	}

	private static store = new Store<string>();

	public static UserToken(cookieToCheck:string):string {
		// undefined if user is not logged in.
		return CookieManager.store.get(cookieToCheck);
	}

	public static SetStringCookie(name:string, data:string) {
		CookieManager.store.set(name, data);
	}

	public static RemoveCookie(name:string) {
		CookieManager.store.delete(name);
	}
}