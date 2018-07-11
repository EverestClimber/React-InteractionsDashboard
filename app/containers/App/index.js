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
          <Route exact path={routes.LOGIN.path} component={Login} />
          {user && (
            <Switch>
              <Route exact path={routes.DASHBOARD.path} component={Dashboard} />
              <Route exact path={routes.RECORD_INTERACTION.path} component={RecordInteraction} />
              <Route path={routes.RECORD_INTERACTION_FOR_EP.path} component={RecordInteraction} />
              <Route path={routes.RECORD_INTERACTION_FOR_HCP.path} component={RecordInteraction} />
              <Route path={routes.NOT_FOUND.path} component={NotFound} />
            </Switch>
          )}
          <Route kpath={routes.NOT_FOUND.path} component={NotFound} />
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
