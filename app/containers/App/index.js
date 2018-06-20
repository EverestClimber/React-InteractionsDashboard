import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from 'containers/Dashboard';
import Login from 'containers/Login';
import NotFound from 'containers/NotFound';

export default class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/login" component={Login} />
        <Route path="" component={NotFound} />
      </Switch>
    );
  }
}
