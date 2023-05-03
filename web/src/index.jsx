import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './styles/sidebar.scss';
import AdmHomePage from './Users/Admin/AdmHomePage';
import AdmAccountsPage from './Users/Admin/AdmAccountsPage';
import SchoolAdmHomePage from './Users/SchoolAdmin/SchoolAdmHomePage';
import SchoolAdmAccountsPage from './Users/SchoolAdmin/SchoolAdmAccountsPage';
import LandingPage from './Users/Public/LandingPage';
import ForgottenPasswordPage from './Users/Public/ForgottenPasswordPage';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <Router>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/Adm/Home" component={AdmHomePage} />
        <Route exact path="/Adm/Accounts" component={AdmAccountsPage} />
        <Route exact path="/School/Home" component={SchoolAdmHomePage} />
        <Route exact path="/School/Accounts" component={SchoolAdmAccountsPage} />
        <Route exact path="/request" component={ForgottenPasswordPage} />
      </Switch>
    </Router>
  );
}
