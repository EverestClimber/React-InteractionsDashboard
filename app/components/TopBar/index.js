import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import routes from 'routes';
import { logout } from 'containers/App/actions';

export class TopBar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    user: PropTypes.object,
    location: PropTypes.object,
    logout: PropTypes.func,
  };

  renderRoute(title, path, icon) {
    const currentLocation = this.props.location.pathname;
    const activeClass = currentLocation === path ? 'topbar-nav__item--active' : '';

    return (
      <Link to={path} className={`topbar-nav__item ${activeClass}`}>
        <i className={`nav-icon nav-icon__${icon} nav-icon--left`}></i>
        {title}
      </Link>
    );
  }

  render() {
    const { user } = this.props;
    const email = user.get('email');

    // @todo: get therapeutic areas from user instance
    // const ta = user.get('ta').map((ta) => `${ta.charAt(0).toUpperCase()}${ta.slice(1)}`).join(', ');
    const ta = 'Psychiatry, Speciality';

    return (
      <div className="topbar">
        <div className="topbar__container">
          <div className="topbar__section">
            <div className="topbar__logo"></div>
            <div className="topbar__nav topbar-nav">
              {this.renderRoute('MSL Dashboard', routes.DASHBOARD.path, 'folder')}
              {this.renderRoute('HCP Directory', routes.HCP_DIRECTORY.path, 'folder')}
              {this.renderRoute('Record Interaction', routes.RECORD_INTERACTION.path, 'folder')}
              {this.renderRoute('Report', routes.REPORT.path, 'folder')}
            </div>
          </div>
          <div className="topbar__section">
            <div className="topbar__user topbar-user">
              <Link to={routes.PROFILE} className="topbar-user__name">
                {email}
              </Link>
              <p className="topbar-user__ta">{ta}</p>
            </div>
            <Button
              className="topbar__logout"
              bsStyle="link"
              onClick={this.props.logout}
            >
              <i className="nav-icon nav-icon__logout nav-icon--left"></i>
              Log Out
            </Button>
          </div>
        </div>
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

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withRouter,
  withConnect,
)(TopBar);
