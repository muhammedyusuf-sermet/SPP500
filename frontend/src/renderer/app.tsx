import * as React from 'react';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './css/app.css';
import { HomePage } from './components/Home';
import { Registration } from './components/Registration';

type AppProps = {}

export class App extends React.Component<{}> {
	constructor(props: AppProps) {
		super(props);
	}
	render() {
		return (
			<Router>
				<div>
					<ul>
						<li>
							<Link to="/">Home</Link>
							<Link to="/registration">Home</Link>
						</li>
					</ul>
					<hr />

					<Route exact path="/" component={HomePage} />
					<Route path="/registration" component={Registration} />
				</div>
			</Router>
		);
	}
}