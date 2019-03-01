const Store = require('electron-store');
const store = new Store();

export function userAuthenticated(cookieToCheck:string) {
	return getCookie("session_token") != undefined
}

export function setStringCookie(data:string, name:string) {
	store.set(name, data);
}
export function getCookie(name:string) {
	return store.get(name);
}

export function removeCookie(name:string) {
	store.delete(name);
}