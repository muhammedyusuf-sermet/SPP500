import React from 'react';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

const validateForm = (event: React.FormEvent) => {
	console.log("Hello!")
	event.preventDefault();
}

export const MonsterCreation: React.StatelessComponent<{}> = () => {
	return (
		<div className="form-container">
			<form onSubmit={validateForm} >
				<h2>Sign up</h2>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<Input className="input" id="password" placeholder="Password" name="password" autoComplete="current-password" required/>
					<label htmlFor="password">Password</label>
				</div>
				<Button className="button" variant="contained" color="primary" type="submit"> Create Monster </Button>
			</form>
		</div>
	);
}