import * as React from 'react';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './css/app.css';
import { HomePage } from './components/Home';
import { MonsterCreation } from './components/MonsterCreation';

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
							<Link to="/monster_creation">Monster Creation</Link>
						</li>
					</ul>
					<hr />

					<Route exact path="/" component={HomePage} />
					<Route path="/monster_creation" component={MonsterCreation} />
				</div>
			</Router>
		);
	}
}
