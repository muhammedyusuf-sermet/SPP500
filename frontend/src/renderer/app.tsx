import React from 'react';
import {LoginHeader} from './components/LoginHeader';
import {LandingPage} from './components/LandingPage';
import {Registration} from './components/Registration';

import './css/app.css';

export const App: React.StatelessComponent<{}> = () => {
  return (
    <div className="container-fluid">
      <div className="header"><LoginHeader/></div>
      
      <div className="horizontal-block">
      	<div className="align-left"><LandingPage/></div>
      	<div className="align-right"><Registration/></div>
      </div>
    </div>
  );
}