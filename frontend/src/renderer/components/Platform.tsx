import * as React from 'react';
import {Redirect} from 'react-router-dom';
import {CookieManager} from "../../cookie";

export class Platform extends React.Component<{}> {
	render() {
		if (!CookieManager.UserToken("session_token"))
			return (<Redirect to='/'/>);

		return (
			<React.Fragment>
				<div className="PlatformComponent"/>
				<p>You are logged in, welcome to the D&D Tools!</p>
			</React.Fragment>
		);
	}
}
