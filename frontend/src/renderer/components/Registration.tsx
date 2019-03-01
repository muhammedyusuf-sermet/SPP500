import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import '../css/registration.css';

type AppProps = {}

export class Registration extends React.Component<{}> {
	constructor(props: AppProps) {
		super(props);
		this.state = {
			user: {
				username: "",
				password: "",
				email: "",
				name: ""
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
	openSnackbar = (messageText: string) => {
		const snackbar = this.state.snackbar
		this.setState({ snackbar: {...snackbar, open: true, message: messageText }});
	};

	closeSnackbar = () => {
		const snackbar = this.state.snackbar
		this.setState({ snackbar: {...snackbar, open: false }});
	};

	requestRegister() {
		var context = this;
		var request = require("request");
		var options = { method: 'POST',
			url: 'http://3.17.173.229:3000/register',
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

		request(options, function (error:string, response:string, body:string) {
			if (error) {
				context.openSnackbar("There has been a server error. Please try again later.");
				throw new Error(error);
			}

			console.log(response);
			var messages = response.body.messages;
			var messagesStr = messages.join(' ');
			context.openSnackbar(messagesStr);
		});
	}

	render() {
		const register = (event: React.FormEvent) => {
			event.preventDefault();
			this.closeSnackbar();
			this.requestRegister();
		}

		return (
			<div className="registration-container">
				<form onSubmit={register}>
					<React.Fragment>
						<Typography variant="h6" gutterBottom>
							Register Now!
						</Typography>
						<Grid container spacing={24}>
							<Grid item xs={12}>
								<TextField
									required
									id="name"
									name="name"
									label="First and Last name"
									fullWidth
									autoComplete="name"
									value={this.state.user.name}
									onChange={this.handleNameChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									id="email"
									name="email"
									label="E-mail Address"
									type="email"
									fullWidth
									autoComplete="email"
									value={this.state.user.email}
									onChange={this.handleEmailChange}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									id="username"
									name="username"
									label="Username"
									fullWidth
									autoComplete="username"
									value={this.state.user.username}
									onChange={this.handleUsernameChange}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField 
									required
									id="password"
									name="password"
									label="Password"
									type="password"
									fullWidth
									value={this.state.user.password}
									onChange={this.handlePasswordChange}
								/>
							</Grid>
							<Grid item xs={12}>
								{/*Needed for spacing purposes - No functionality*/}
							</Grid>
						</Grid>
						<Button className="button" variant="contained" color="primary" type="submit">Register</Button>
					</React.Fragment>
				</form>
				<Snackbar
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
