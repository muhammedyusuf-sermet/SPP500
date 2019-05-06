import * as React from 'react';
import '../css/landing_page.css';

export const LandingPage: React.StatelessComponent<{}> = () => {
	return (
		<div className="landing-container">
			<img src={require('../../../../docs/art/DM-Tools-Logo.png')} className="logo"></img>
			<h3>One-stop platform for Dungeon Masters!</h3>
		</div>
	);
}
