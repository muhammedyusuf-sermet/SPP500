import * as React from 'react';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

import '../css/login_header.css';

type AppProps = {}

export class LoginHeader extends React.Component<{}> {
	constructor(props: AppProps) {
		super(props);
		this.state = {
			user: {
				// Todo: Accept e-mail address as username (i.e. as a way to login)
				username: "",
				password: "",
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

	render() {
		const login = (event: React.FormEvent) => {
			event.preventDefault();
			console.log(this.state.user.username);
			requestLogin();
		}

		return (
			<div className="login-header-container">
				<div className="left-block">
					<img src={require('../../../../doc/art/DM-Tools-Logo.png')} className="logo"></img>
				</div>
				<div className="right-block">
				<form onSubmit={login}>
					<Input className="input" id="username" placeholder="Username" name="username" autoComplete="username" value={this.state.user.username} onChange={this.handleUsernameChange} autoFocus required/>
					<Input className="input" id="password" placeholder="Password" name="password" type="password" autoComplete="current-password" value={this.state.user.password} onChange={this.handlePasswordChange} required/>
					<Button className="button" variant="contained" color="primary" type="submit">Login</Button>
				</form>
				</div>
			</div>
		);
	}


	requestLogin() {
		
	}
}
