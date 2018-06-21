import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectLogin from './selectors';
import reducer from './reducer';
import saga from './saga';
import { loginActions } from './actions';

export class Login extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();

    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value.trim();

    this.props.loginActions.request(email, password);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input ref={(c) => { this.emailInput = c; }} type="email" placeholder="Email" />
        <input ref={(c) => { this.passwordInput = c; }} type="password" placeholder="Password" />
        <button type="submit">Submit</button>
      </form>
    );
  }
}

Login.propTypes = {
  loginActions: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  login: makeSelectLogin(),
});

function mapDispatchToProps(dispatch) {
  return {
    loginActions: bindActionCreators(loginActions, dispatch),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'login', reducer });
const withSaga = injectSaga({ key: 'login', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Login);
