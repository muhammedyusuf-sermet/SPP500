import * as React from 'react';
import {LoginHeader} from './components/LoginHeader';
import {Footer} from './components/Footer';
import {LandingPage} from './components/LandingPage';
import {Registration} from './components/Registration';
import {MonsterCreation} from "./components/MonsterCreation";

import './css/app.css';

export const App: React.StatelessComponent<{}> = () => {
  return (
    <div className="container-fluid">
      <div className="header"><LoginHeader/></div>
        <div><MonsterCreation/></div>
      </div>
  );
}
