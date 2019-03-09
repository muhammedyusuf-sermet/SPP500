import * as React from 'react';
import { CookieManager } from '../../cookie';
import {API_URL} from "../../config"

export const AuthContext = React.createContext<IAuthProviderState>({
	isAuth: undefined,
	login: () => {},
	logout: () => {}
});

interface ILoginResponce {
	status: number,
	message: string,
	token: string
}

export interface IAuthProviderState {
	isAuth?: string,
	login: (user: {username: string, password: string}, callback?: (message: string) => void) => void,
	logout: (callback?: (message: string) => void) => void
}

export class AuthProvider extends React.Component<any, IAuthProviderState>{
	constructor(props: any){
		super(props);
		this.state = {
			isAuth: CookieManager.UserToken('session_token'),
			login: this.login,
			logout: this.logout
		}
	}

	login = (user: {username: string, password: string}, callback?: (message: string) => void) => {
		const request = require("request");
		const options = { method: 'POST',
			url: API_URL + '/login',
			timeout: 2000,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json'
			},
			body:
			{
				username: user.username,
				password: user.password
			},
			json: true
		};
		request(options, (error: string, response: string, body: ILoginResponce) => {
			if (error) {
				if(callback)
					callback("There has been a server error when logging in. Please try again later.");
			} else {
				let { token, status, message } = body
				if (status == 201)
					CookieManager.SetStringCookie('session_token', token);
					this.setState({
						isAuth: token
					})
				if (callback)
					callback(message);
			}
		});
	}

	logout = (callback?: (message: string) => void) => {
		CookieManager.RemoveCookie('session_token');
		this.setState({
			isAuth: undefined
		})
		if (callback)
			callback("Logged out successfully.");
	}

	render() {
		return (
			<AuthContext.Provider value={this.state} >
				{this.props.children}
			</AuthContext.Provider>
		);
	}
}