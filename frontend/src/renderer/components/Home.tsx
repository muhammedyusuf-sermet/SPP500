import * as React from 'react';
import {Footer} from './Footer';
import {LandingPage} from './LandingPage';
import {Registration} from './Registration';
import '../css/app.css';


export const HomePage: React.StatelessComponent<{}> = () => {
	return (
		<div id='HomePage' className="container-fluid">
			<div className="horizontal-block">
				<div className="align-left"><LandingPage/></div>
				<div className="align-right"><Registration/></div>
			</div>
			<div className="footer"><Footer/></div>
		</div>
	);
}

