import * as React from 'react';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {Redirect} from 'react-router-dom';
import {CookieManager} from "../../cookie";

import '../css/login_header.css';

type AppProps = {}

interface LoginStateInterface {
	redirectToPlatform: boolean,
	user: {
		username: string,
		password: string
	}
	snackbar: {
		open: boolean,
		message: string
	}
}

interface LoginResponceInterface {
	status: number,
	message: string, 
	token: string
}

export class LoginHeader extends React.Component<{}, LoginStateInterface> {
	constructor(props: AppProps) {
		super(props);
		this.state = {
			redirectToPlatform: false,
			user: {
				// Todo: Accept e-mail address as username (i.e. as a way to login)
				username: "",
				password: ""
			},

			snackbar: {
				open: false,
				message: ""
			}
		}
	}

	handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const user = this.state.user
		this.setState({
			user: { ...user, username: event.target.value }
		})
	}

	handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const user = this.state.user
		this.setState({
			user: { ...user, password: event.target.value }
		})
	}

	openSnackbar = (messageText: string) => {
		const snackbar = this.state.snackbar
		this.setState({ snackbar: {...snackbar, open: true, message: messageText }});
	};

	closeSnackbar = () => {
		const snackbar = this.state.snackbar
		this.setState({ snackbar: {...snackbar, open: false }});
	};

	handleRedirectToPlatform = () => {
		this.setState({ redirectToPlatform: true});
	}

	requestLogin(cookieManager: CookieManager) {
		var context = this;
		var request = require("request");
		var options = { method: 'POST',
			url: 'http://3.18.65.138:3000/login',
			timeout: 2000,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json'
			},
			body:
			{
				username: this.state.user.username,
				password: this.state.user.password
			},
			json: true
		};

		request(options, function (error: string, response: string, body: LoginResponceInterface) {
			if (error) {
				context.openSnackbar("There has been a server error when logging in. Please try again later.");
			}
			else {
				var token = "";
				var status = body.status;
				var message = body.message;
				context.openSnackbar(message);

				if (status == 201) { // Success
					token = body.token;
					cookieManager.SetStringCookie(token, "session_token");
					context.handleRedirectToPlatform();
				}
			}
		});
	}

	render() {
		let cookieManager = new CookieManager();
		if (cookieManager.UserAuthenticated(cookieManager.GetCookie("session_token"))) {
			// User is already logged in; redirect to the main page
			this.handleRedirectToPlatform();
		}

		const login = (event: React.FormEvent) => {
			event.preventDefault();
			this.closeSnackbar();
			this.requestLogin(cookieManager);
		}

		if (this.state.redirectToPlatform) {
			return (<Redirect to='/platform'/>);
		}

		return (
			<div className="login-header-container">
				<div className="left-block">
					<img src={require('../../../../doc/art/DM-Tools-Logo.png')} className="logo"></img>
				</div>
				<div className="right-block">
				<form id="loginForm" onSubmit={login}>
					<Input className="input" id="username" placeholder="Username" name="username" autoComplete="username" value={this.state.user.username} onChange={this.handleUsernameChange} autoFocus required/>
					<Input className="input" id="password" placeholder="Password" name="password" type="password" autoComplete="current-password" value={this.state.user.password} onChange={this.handlePasswordChange} required/>
					<Button className="button" id="loginButton" variant="contained" color="primary" type="submit">Login</Button>
				</form>
				</div>
				<Snackbar
					id="snackbarLogin"
					open={this.state.snackbar.open}
					autoHideDuration={6000}
					message={<span id="message-id">{this.state.snackbar.message}</span>}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left'
					}}
					action={[
						<IconButton
							key="close"
							aria-label="Close"
							color="inherit"
							onClick={this.closeSnackbar}
						>
							<CloseIcon/>
						</IconButton>
					]}
				/>
			</div>
		);
	}
}
