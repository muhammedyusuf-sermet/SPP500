import * as React from 'react';
import { Title, Modal, ModalBackground, ModalContent, Box, Field, Control, Input, Button } from 'bloomer';

import 'bulma/css/bulma.css';

export interface IRegisterState {
	user: {
		username: string,
		password: string,
		email: string,
		name: string
	}
	modal: {
		open: boolean,
		message: string
	}
}

interface IRegisterResponce {
	status: number,
	messages: string[]
}

export class Registration extends React.Component<any, IRegisterState> {
	constructor(props: any) {
		super(props);
		this.state = {
			user: {
				username: "",
				password: "",
				email: "",
				name: ""
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

	handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const user = this.state.user
		this.setState({
			user: { ...user, email: event.target.value }
		})
	}

	handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const user = this.state.user
		this.setState({
			user: { ...user, name: event.target.value }
		})
	}

	/*Todo: Create a new helper component for Snackbars - reuse it*/
	openModal = (messageText: string) => {
		const modal = this.state.modal
		this.setState({ modal: {...modal, open: true, message: messageText }});
	};

	closeModal = () => {
		const modal = this.state.modal
		this.setState({ modal: {...modal, open: false }});
	};

	requestRegister = (event: React.FormEvent) => {
		event.preventDefault();
		var request = require("request");
		var options = { method: 'POST',
			url: 'http://3.18.65.138:3000/register',
			timeout: 2000,
			headers:
			{
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json'
			},
			body:
			{
				username: this.state.user.username,
				password: this.state.user.password,
				email: this.state.user.email,
				name: this.state.user.name
			},
			json: true
		};
		request(options, (error: string, response: string, body: IRegisterResponce) => {
			if (error) {
				this.openModal("There has been a server error. Please try again later.");
				throw new Error(error);
			}

			let { status, messages } = body;
			var finalMessage = "";
			if (messages)
				finalMessage = messages[0];

			if (status == 201)
				finalMessage = "Welcome aboard! You can now login with your username and password.";

			this.openModal(finalMessage);
		});
	}

	render() {
		return (
			<React.Fragment>
				<form onSubmit={this.requestRegister}>
					<Title>Register Now!</Title>
					<Field>
						<Control>
							<Input
								id='name'
								type='text'
								placeholder='First and Last name'
								autoComplete='name'
								value={this.state.user.name}
								onChange={this.handleNameChange}
								required />
						</Control>
					</Field>
					<Field>
						<Control>
							<Input
								id='email'
								type='email'
								placeholder='E-mail Address'
								autoComplete='email'
								value={this.state.user.email}
								onChange={this.handleEmailChange}
								required />
						</Control>
					</Field>
					<Field isGrouped='centered' isHorizontal>
						<Control isExpanded>
							<Input
								id='username'
								type='username'
								placeholder='Username'
								autoComplete='username'
								value={this.state.user.username}
								onChange={this.handleUsernameChange}
								required />
						</Control>
						<Control isExpanded>
							<Input
								id='password'
								type='password'
								placeholder='Password'
								autoComplete='password'
								value={this.state.user.password}
								onChange={this.handlePasswordChange}
								required />
						</Control>
					</Field>
					<Field>
						<Button isColor='primary' type="submit" isLoading={false}>Register</Button>
					</Field>
				</form>
				<Modal id='registerModal' isActive={this.state.modal.open}>
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
