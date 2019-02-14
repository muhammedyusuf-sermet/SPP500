import React from 'react';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

import '../css/login_header.css';

export const LoginHeader: React.StatelessComponent<{}> = () => {
  return (
    <div className="login-header-container">
        <div className="left-block">
        	<img src={require('../images/dndlogo.png')} className="logo"></img>
        </div>
      	<div className="right-block">
      		<Input className="input" id="email" placeholder="Username" name="email" autoComplete="email" autoFocus required/>
      		<Input className="input" id="password" placeholder="Password" name="password" type="password" autoComplete="current-password" required/>
  		    <Button className="button" variant="contained" color="primary">Login</Button>
      	</div>
    </div>
  );
}