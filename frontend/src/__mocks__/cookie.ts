export class CookieManager {

	static data:any = {};

	public static UserToken(cookieToCheck:string) {
		return CookieManager.data[cookieToCheck];
	}

	public static SetStringCookie(name:string, data:string) {
		CookieManager.data[name] = data;
	}

	public static RemoveCookie(name:string) {
		CookieManager.data[name] = undefined;
	}
}