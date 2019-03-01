import * as React from 'react';

type AppProps = {}

export class Platform extends React.Component<{}> {
	constructor(props: AppProps) {
		super(props);
	}

	render() {
		return (
			<div className="platform-container">
				You are logged in, welcome to the D&D Tools!
			</div>
		);
	}
}
