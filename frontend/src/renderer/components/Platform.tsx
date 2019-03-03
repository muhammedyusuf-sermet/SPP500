import * as React from 'react';
import Button from '@material-ui/core/Button';
import {Redirect} from 'react-router-dom';
import {CookieManager} from "../../cookie";

type AppProps = {}

interface PlatformStateInterface {
	redirectToHome: boolean
}

export class Platform extends React.Component<{}, PlatformStateInterface> {
	constructor(props: AppProps) {
		super(props);
		this.state = {
			redirectToHome: false
		}
	}

	handleRedirectToHome = () => {
		this.setState({ redirectToHome: true});
	}

	render() {
		let cookieManager = new CookieManager();

		const logout = (event: React.FormEvent) => {
			event.preventDefault();
			cookieManager.RemoveCookie("session_token");
			this.handleRedirectToHome();
		}

		if (!cookieManager.UserAuthenticated(cookieManager.GetCookie("session_token"))) {
			return (<Redirect to='/'/>);
		}
		else if (this.state.redirectToHome) {
			return (<Redirect to='/'/>);
		}

		return (
			<div className="platform-container">
				You are logged in, welcome to the D&D Tools!
				<form onSubmit={logout}>
					<Button className="button" id="loginButton" variant="contained" color="primary" type="submit">Logout</Button>
				</form>
			</div>
		);
	}
}
