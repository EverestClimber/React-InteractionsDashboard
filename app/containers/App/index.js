import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Loader from 'containers/Loader';
import Dashboard from 'containers/Dashboard';
import Login from 'containers/Login';
import RecordInteraction from 'containers/RecordInteraction';
import NotFound from 'containers/NotFound';
import TopBar from 'components/TopBar';

import routes from 'routes';
import injectSaga from 'utils/injectSaga';
import saga from './saga';
import { refreshToken } from './actions';

export class App extends React.PureComponent {
  static propTypes = {
    refreshToken: PropTypes.func,
    user: PropTypes.object,
  };

  componentDidMount() {
    // token expires in 14 days
    // so there is no reason for more frequent token refresh
    const minute = 1000 * 60;
    const fiveMinutes = minute * 5;

    this.interval = setInterval(() => {
      this.props.refreshToken();
    }, fiveMinutes);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  get tokenExist() {
    return !!localStorage.getItem('token');
  }

  render() {
    const { user } = this.props;

    return (
      <React.Fragment>
        {this.tokenExist && <TopBar />}
        <Loader />
        <Switch>
          <Route exact path={routes.LOGIN} component={Login} />
          {user && [
            // React.Fragment doesn't work with Route component
            // don't forget to specify unique key for a route
            <Route key={routes.DASHBOARD} exact path={routes.DASHBOARD} component={Dashboard} />,
            <Route key={routes.RECORD_INTERACTION} exact path={routes.RECORD_INTERACTION} component={RecordInteraction} />,
            <Route key={routes.NOT_FOUND} path={routes.NOT_FOUND} component={NotFound} />,
            <Route key={routes.NOT_FOUND} path={routes.NOT_FOUND} component={NotFound} />,
          ]}
        </Switch>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.get('global').get('user'),
    loading: state.get('global').get('ui').get('loading'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    refreshToken,
  }, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withSaga = injectSaga({ key: 'global', saga });

export default withRouter(compose(
  withSaga,
  withConnect
)(App));
