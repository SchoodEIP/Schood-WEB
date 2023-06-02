import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Sidebar from './pages/Dashboard_Student';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <Router>
      <Switch>
        <Route exact path="/" component={Sidebar} />
      </Switch>
    </Router>
  );
}