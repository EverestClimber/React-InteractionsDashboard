import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import { Button, Grid } from 'react-bootstrap';

import routes from 'routes';
import { logout } from 'containers/App/actions';

export class TopBar extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    user: PropTypes.object,
    location: PropTypes.object,
    logout: PropTypes.func,
  };

  renderRoute(title, path, icon) {
    const currentLocation = this.props.location.pathname;
    const activeClass =
      currentLocation === path ? 'topbar-nav__item--active' : '';

    return (
      <Link to={path} className={`topbar-nav__item ${activeClass}`}>
        <span className={`fi-icon icon-${icon}`} />
        {title}
      </Link>
    );
  }

  render() {
    const { user } = this.props;

    return (
      <div className="topbar">
        <Grid className="topbar__container">
          <div className="topbar__section">
            <div className="topbar__logo" />
            {user && (
              <div className="topbar__nav topbar-nav">
                {this.renderRoute(
                  'MSL Dashboard',
                  routes.DASHBOARD.path,
                  'nav-dashboard'
                )}
                {this.renderRoute(
                  'HCP Directory',
                  routes.LIST_HCPS.path,
                  'nav-hcps'
                )}
                {this.renderRoute(
                  'Record Interaction',
                  routes.RECORD_INTERACTION.path,
                  'nav-record'
                )}
                {this.renderRoute(
                  'Report',
                  routes.LIST_INTERACTIONS.path,
                  'nav-report'
                )}
              </div>
            )}
          </div>
          <div className="topbar__section" />
          {user && (
            <div className="topbar__section">
              <div className="topbar__user topbar-user">
                <Link to={routes.PROFILE} className="topbar-user__name">
                  {user.email}
                </Link>
                <p className="topbar-user__ta">{user.ta_names.join(', ')}</p>
              </div>
              <Button
                className="topbar__logout"
                bsStyle="link"
                onClick={this.props.logout}
              >
                <i className="nav-icon nav-icon__logout nav-icon--left" />
                Log Out
              </Button>
            </div>
          )}
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.get('global').get('user'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withRouter,
  withConnect
)(TopBar);
