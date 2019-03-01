import * as React from 'react';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './css/app.css';
import { HomePage } from './components/Home';
import { MonsterCreation } from './components/MonsterCreation';
import { ViewCatalog } from './components/platform/pages/ViewCatalog';

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
							<Link to="/catalog">View Catalog</Link>
						</li>
					</ul>
					<hr />

					<Route exact path="/" component={HomePage} />
					<Route path="/monster_creation" component={MonsterCreation} />
					<Route path="/catalog" component={ViewCatalog} />
				</div>
			</Router>
		);
	}
}
