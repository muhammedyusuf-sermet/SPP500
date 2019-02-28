import * as React from 'react';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

import '../css/login_header.css';

type AppProps = {}

export class LoginHeader extends React.Component<{}> {
	constructor(props: AppProps) {
		super(props);
	}
	render() {
		return (
			<div className="login-header-container">
				<div className="left-block">
					<img src={require('../../../../doc/art/DM-Tools-Logo.png')} className="logo"></img>
				</div>
				<div className="right-block">
					<Input className="input" id="email" placeholder="Username" name="email" autoComplete="email" autoFocus required/>
					<Input className="input" id="password" placeholder="Password" name="password" type="password" autoComplete="current-password" required/>
					<Button className="button" variant="contained" color="primary">Login</Button>
				</div>
			</div>
		);
	}
}
