export class CookieManager {

	public UserAuthenticated(cookieToCheck:string) {
		return true
	}

	public SetStringCookie(data:string, name:string) {	}
	public GetCookie(name:string) {
		return "session_token"
	}

	public RemoveCookie(name:string) {	}
}