import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from 'containers/Dashboard/Loadable';
import NotFound from 'containers/NotFound/Loadable';

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route path="" component={NotFound} />
    </Switch>
  );
}
