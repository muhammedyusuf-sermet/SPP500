export class CookieManager {

	static Data:any = {};

	public static UserToken(cookieToCheck:string) {
		return CookieManager.Data[cookieToCheck];
	}

	public static SetStringCookie(name:string, data:string) {
		CookieManager.Data[name] = data;
	}

	public static RemoveCookie(name:string) {
		CookieManager.Data[name] = undefined;
	}
}