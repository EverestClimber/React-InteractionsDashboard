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

import injectSaga from 'utils/injectSaga';
import saga from './saga';
import { refreshToken } from './actions';

export class App extends React.PureComponent {
  static propTypes = {
    refreshToken: PropTypes.func,
    userId: PropTypes.number,
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

  render() {
    const { userId } = this.props;
    return (
      <React.Fragment>
        <Loader />
        {userId && <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/record-interaction" component={RecordInteraction} />
          <Route path="" component={NotFound} />
        </Switch>}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    userId: state.get('global').get('user').get('id'),
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
