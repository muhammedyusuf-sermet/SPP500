var session = require('electron').remote.session;
var ses = session.fromPartition('persist:name');

const Store = require('electron-store');
const store = new Store();

export function userAuthenticated(cookieToCheck:string) {
	return true
}

export function setStringCookie(data:string, name:string) {
	store.set(name, data);
}
export function getCookie(name:string) {
	return store.get(name);
}