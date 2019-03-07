import * as React from 'react';
import {CookieManager} from "../../cookie";

//import '../css/login_header.css';
import 'bulma/css/bulma.css';
import { Input, Button, Modal, ModalContent, Control, Field, Box, ModalBackground } from 'bloomer';
import { NavbarItem } from 'bloomer/lib/components/Navbar/NavbarItem';

interface ILoginState {
	user: {
		username: string,
		password: string
	}
	modal: {
		open: boolean,
		message: string
	}
}

interface ILoginResponce {
	status: number,
	message: string,
	token: string
}

export class LoginHeader extends React.Component<any, ILoginState> {
	constructor(props: any) {
		super(props);
		this.state = {
			user: {
				// Todo: Accept e-mail address as username (i.e. as a way to login)
				username: "",
				password: ""
			},
			modal: {
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

	openModal = (messageText: string) => {
		const modal = this.state.modal
		this.setState({ modal: {...modal, open: true, message: messageText }});
	};

	closeModal = () => {
		const modal = this.state.modal
		this.setState({ modal: {...modal, open: false }});
	};

	requestLogin() {
		const context = this;
		const request = require("request");
		const options = { method: 'POST',
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

		request(options, function (error: string, response: string, body: ILoginResponce) {
			if (error) {
				context.openModal("There has been a server error when logging in. Please try again later.");
			} else {
				let { token, status, message } = body

				if (status == 201)
					CookieManager.SetStringCookie("session_token", token);
					context.openModal(message);
			}
		});
	}

	render() {
		const login = (event: React.FormEvent) => {
			event.preventDefault();
			this.closeModal();
			this.requestLogin();
		}

		const logout = (event: React.FormEvent) => {
			event.preventDefault();
			CookieManager.RemoveCookie("session_token");
			this.setState({
				user: {
					// Todo: Reset e-mail address as username (i.e. as a way to login)
					username: "",
					password: ""
				}
			})
			this.openModal("Logged out successfully.");
		}

		let loginControl;
		if (CookieManager.UserToken("session_token")){
			loginControl =
				<NavbarItem>
					<Field>
						<Control>
							<Button  isColor ='dark' onClick={logout} isLoading={false}>Logout</Button>
						</Control>
					</Field>
				</NavbarItem>
		} else {
			loginControl =
				<form id="loginForm" onSubmit={login} className='navbar-item'>
					<Field isGrouped isHorizontal>
						<Control isExpanded>
							<Input type='text' placeholder='Username' autoComplete="username" value={this.state.user.username} onChange={this.handleUsernameChange} autoFocus required />
						</Control>
						<Control isExpanded>
							<Input type='password' placeholder='Password' autoComplete='current-password' value={this.state.user.password} onChange={this.handlePasswordChange} required />
						</Control>
						<Control>
							<Button isColor='dark' type="submit" isLoading={false}>Login</Button>
						</Control>
					</Field>
				</form>
		}

		return (
			<React.Fragment>
				{loginControl}
				<Modal id='loginModal' isActive={this.state.modal.open}>
					<ModalBackground onClick={()=>{
						this.closeModal();
					}}/>
					<ModalContent>
						<Box>
							<p>{this.state.modal.message}</p>
						</Box>
					</ModalContent>
				</Modal>
			</React.Fragment>
		);
	}
}
