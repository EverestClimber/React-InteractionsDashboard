import React from 'react';
import { Switch, Route } from 'react-router-dom';
// import { compose } from 'redux';

import Dashboard from 'containers/Dashboard';
import Login from 'containers/Login';
import NotFound from 'containers/NotFound';

// import injectSaga from 'utils/injectSaga';
// import saga from './saga';

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

// const withSaga = injectSaga({ key: 'app', saga });
//
// export default compose(
//   withSaga
// )(App);
