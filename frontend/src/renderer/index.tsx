import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {App} from './app';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';

ReactDOM.render(
	<AuthProvider>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</AuthProvider>,
	document.getElementById('app')
);
