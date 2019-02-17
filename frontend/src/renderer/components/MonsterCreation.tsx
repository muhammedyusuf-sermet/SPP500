import React from 'react';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import "../css/create_monster.css"

const validateForm = (event: React.FormEvent) => {
	//console.log("Hello!")
	event.preventDefault();
}

export const MonsterCreation: React.StatelessComponent<{}> = () => {
	return (
		<div className="monster-creation-container">
			<form onSubmit={validateForm} >
				<h1 className="page-title">Create a Monster</h1>
				<div className="form-group">
					<TextField autoFocus margin="dense" id="name" label="Email Address" helperText="Test" fullWidth required/>
				</div>
				<Button className="button" variant="contained" color="primary" type="submit"> Create Monster </Button>
			</form>
		</div>
	);
}