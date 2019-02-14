import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import '../css/registration.css';

export const Registration: React.StatelessComponent<{}> = () => {
  return (
    <div className="registration-container">
	    <React.Fragment>
	      <Typography variant="h6" gutterBottom>
	        Register Now!
	      </Typography>
	      <Grid container spacing={24}>
	        <Grid item xs={12} sm={6}>
	          <TextField
	            required
	            id="firstName"
	            name="firstName"
	            label="First name"
	            fullWidth
	            autoComplete="fname"
	          />
	        </Grid>
	        <Grid item xs={12} sm={6}>
	          <TextField
	            required
	            id="lastName"
	            name="lastName"
	            label="Last name"
	            fullWidth
	            autoComplete="lname"
	          />
	        </Grid>
	        <Grid item xs={12}>
	          <TextField
	            required
	            id="email"
	            name="email"
	            label="E-mail Address"
	            fullWidth
	            autoComplete="email"
	          />
	        </Grid>
	        <Grid item xs={12} sm={6}>
	          <TextField
	            required
	            id="username"
	            name="username"
	            label="Username"
	            fullWidth
	            autoComplete="username"
	          />
	        </Grid>
	        <Grid item xs={12} sm={6}>
	          <TextField 
	            required
	            id="password"
	            name="password"
	            label="Password"
	            fullWidth />
	        </Grid>
	        <Grid item xs={12}>
	          <FormControlLabel
	            control={<Checkbox color="secondary" name="addMailingList" value="yes" />}
	            label="Keep me updated on the D&D Community!"
	          />
	        </Grid>
	      </Grid>
	      <Button className="button" variant="contained" color="primary">Register</Button>
	    </React.Fragment>
    </div>
  );
}
