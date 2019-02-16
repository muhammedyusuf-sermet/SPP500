import React from 'react';
import '../css/landing_page.css';

export const LandingPage: React.StatelessComponent<{}> = () => {
	return (
		<div className="landing-container">
			<img src={require('../../../../doc/art/DM-Tools-Logo.png')} className="logo"></img>
			<h3>One-stop platform for Dungeon Masters!</h3>
		</div>
	);
}
