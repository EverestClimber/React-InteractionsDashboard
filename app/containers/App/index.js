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

    if (window.location.pathname !== '/login') {
      this.props.getCurrentUser();
      this.props.fetchCommonData();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // get tokenExist() {
  //   return !!localStorage.getItem('token');
  // }

  render() {
    const { user, loadedCommonData } = this.props;

    return (
      <React.Fragment>
        {user && <TopBar />}
        <Loader />
        {/* <pre>{JSON.stringify(queryString.parse(this.props.location.search), null, 2)}</pre> */}
        {(loadedCommonData || window.location.pathname === '/login') ? (
          <Switch>
            <Route exact path={routes.LOGIN.path} component={Login} />
            {user && (
              <Switch>
                <Route exact path={routes.DASHBOARD.path} component={Dashboard} />
                <Route exact path={routes.RECORD_INTERACTION.path} component={RecordInteraction} />
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
    loading: state.get('global').get('ui').get('loading'),
    loadedCommonData: state.get('global').get('loadedCommonData'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    refreshToken,
    fetchCommonData: fetchCommonDataActions.request,
    getCurrentUser: getCurrentUserActions.request,
  }, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withSaga = injectSaga({ key: 'global', saga });

export default withRouter(compose(
  withSaga,
  withConnect
)(App));
