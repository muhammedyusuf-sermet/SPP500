import * as React from 'react';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './css/app.css';
import { HomePage } from './components/Home';
import { Registration } from './components/Registration';
import { Platform } from './components/Platform';

type AppProps = {}

export class App extends React.Component<{}> {
	constructor(props: AppProps) {
		super(props);
	}

	/* Todo: Return home page if user is not logged in, return main platform page otherwise */
	render() {
		return (
			<Router>
				<div>
					<ul>
						<li>
							<Link to="/">Home</Link>
							<Link to="/registration">Registration</Link>
						</li>
					</ul>
					<hr />

					<Route exact path="/" component={HomePage} />
					<Route path="/registration" component={Registration} />
					<Route path="/platform" component={Platform} />
				</div>
			</Router>
		);
	}
}
