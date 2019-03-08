import * as React from 'react';

//import '../css/login_header.css';
import 'bulma/css/bulma.css';
import { Input, Button, Modal, ModalContent, Control, Field, Box, ModalBackground } from 'bloomer';
import { NavbarItem } from 'bloomer/lib/components/Navbar/NavbarItem';
import { IAuthProviderState, AuthContext } from './AuthContext';

export interface ILoginState {
	user: {
		username: string,
		password: string
	}
	modal: {
		open: boolean,
		message: string
	}
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

	loginControl = (auth: IAuthProviderState) => {
		const login = (event: React.FormEvent) => {
			event.preventDefault();
			this.closeModal();
			auth.login(
				this.state.user,
				(message: string) => {
					this.openModal(message);
				});
		}

		const logout = (event: React.FormEvent) => {
			event.preventDefault();
			this.closeModal();
			auth.logout(
				(message: string) => {
					this.setState({
						user: {
							// Todo: Reset e-mail address as username (i.e. as a way to login)
							username: "",
							password: ""
						}
					})
					this.openModal(message);
				});
		}
		if (auth.isAuth){
			return (
				<NavbarItem>
					<Field>
						<Control>
							<Button id='logout' isColor ='dark' onClick={logout} isLoading={false}>Logout</Button>
						</Control>
					</Field>
				</NavbarItem>
			);
		} else {
			return (
				<form id="loginForm" onSubmit={login} className='navbar-item'>
					<Field isGrouped isHorizontal>
						<Control isExpanded>
							<Input
								id='username'
								type='text'
								placeholder='Username'
								autoComplete='username'
								value={this.state.user.username}
								onChange={this.handleUsernameChange}
								autoFocus
								required />
						</Control>
						<Control isExpanded>
							<Input
								id='password'
								type='password'
								placeholder='Password'
								autoComplete='current-password'
								value={this.state.user.password}
								onChange={this.handlePasswordChange}
								required />
						</Control>
						<Control>
							<Button isColor='dark' type="submit" isLoading={false}>Login</Button>
						</Control>
					</Field>
				</form>
			);
		}
	}

	render() {
		return (
			<React.Fragment>
				<AuthContext.Consumer>
					{this.loginControl}
				</AuthContext.Consumer>
				<Modal id='loginModal' isActive={this.state.modal.open}>
					<ModalBackground id='modalBackground' onClick={()=>{
						this.closeModal();
					}}/>
					<ModalContent>
						<Box>
							<span id="ModalMessage">{this.state.modal.message}</span>
						</Box>
					</ModalContent>
				</Modal>
			</React.Fragment>
		);
	}
}