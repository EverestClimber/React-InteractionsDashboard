import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Loader from 'containers/Loader';
import Dashboard from 'containers/Dashboard';
import Login from 'containers/Login';
import PasswordReset from 'containers/PasswordReset';
import PasswordResetConfirm from 'containers/PasswordResetConfirm';
import RecordInteraction from 'containers/RecordInteraction';
import ListInteractions from 'containers/ListInteractions';
import NotFound from 'containers/NotFound';
import TopBar from 'components/TopBar';
import { CenteredAlert } from 'components/forms';

import routes, { pageDoesNotRequireLogin } from 'routes';
import injectSaga from 'utils/injectSaga';
import CreateEP from 'containers/CreateEP';
import UpdateEP from 'containers/UpdateEP';
import saga from './saga';
import {
  refreshToken,
  getCurrentUserActions,
  fetchCommonDataActions,
} from './actions';

export class App extends React.PureComponent {
  static propTypes = {
    refreshToken: PropTypes.func,
    fetchCommonData: PropTypes.func,
    getCurrentUser: PropTypes.func,
    user: PropTypes.object,
    loadedCommonData: PropTypes.bool,
  };

  componentDidMount() {
    // token expires in 14 days
    // so there is no reason for more frequent token refresh
    const minute = 1000 * 60;
    const fiveMinutes = minute * 5;

    this.interval = setInterval(() => {
      this.props.refreshToken();
    }, fiveMinutes);

    if (!pageDoesNotRequireLogin() && localStorage.getItem('token')) {
      this.props.getCurrentUser();
      this.props.fetchCommonData();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { user, loadedCommonData } = this.props;

    return (
      <React.Fragment>
        <TopBar />
        <Loader />

        {this.props.flashMessage.get('text') && (
          <div>
            <br />
            <CenteredAlert
              bsStyle={
                { error: 'danger', success: 'success' }[
                  this.props.flashMessage.get('type')
                ] || 'info'
              }
            >
              {this.props.flashMessage.get('text')}
            </CenteredAlert>
          </div>
        )}

        {pageDoesNotRequireLogin() || loadedCommonData ? (
          <Switch>
            <Route exact path={routes.LOGIN.path} component={Login} />
            <Route
              exact
              path={routes.PASSWORD_RESET.path}
              component={PasswordReset}
            />
            <Route
              path={routes.PASSWORD_RESET_CONFIRM.path}
              component={PasswordResetConfirm}
            />
            {user && (
              <Switch>
                <Route
                  exact
                  path={routes.DASHBOARD.path}
                  component={Dashboard}
                />
                <Route
                  exact
                  path={routes.RECORD_INTERACTION.path}
                  component={RecordInteraction}
                />
                <Route
                  exact
                  path={routes.LIST_INTERACTIONS.path}
                  component={ListInteractions}
                />
                <Route
                  exact
                  path={routes.CREATE_EP.path}
                  component={CreateEP}
                />
                <Route
                  exact
                  path={routes.UPDATE_EP.path}
                  component={UpdateEP}
                />
                <Route path={routes.NOT_FOUND.path} component={NotFound} />
              </Switch>
            )}
            <Route path={routes.NOT_FOUND.path} component={NotFound} />
          </Switch>
        ) : (
          <div>LOADING...</div>
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.get('global').get('user'),
    loading: state
      .get('global')
      .get('ui')
      .get('loading'),
    loadedCommonData: state.get('global').get('loadedCommonData'),
    flashMessage: state.get('global').get('flashMessage'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      refreshToken,
      fetchCommonData: fetchCommonDataActions.request,
      getCurrentUser: getCurrentUserActions.request,
    },
    dispatch
  );
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withSaga = injectSaga({ key: 'global', saga });

export default withRouter(
  compose(
    withSaga,
    withConnect
  )(App)
);
