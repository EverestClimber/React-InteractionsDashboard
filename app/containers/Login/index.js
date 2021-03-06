import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form/immutable';
import { Button, Grid } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import routes from 'routes';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { LabeledFormControl } from 'components/forms';
import makeSelectLogin from './selectors';
import reducer from './reducer';
import saga from './saga';
import { loginActions } from './actions';

export const Login = (props) => {
  const { handleSubmit } = props;

  // debugger;

  return (
    <div className="Login auth-form">
      <Helmet>
        <title>OTSK - Login</title>
      </Helmet>
      <Grid>
        <div className="Login__form auth-form__form">
          <form onSubmit={handleSubmit}>
            <h2>
              Sign in to <strong>Interactions</strong>
            </h2>
            <Field
              name="email"
              component={LabeledFormControl}
              type="text"
              placeholder="Email"
              label="EMAIL*"
            />
            <Link to={routes.PASSWORD_RESET.path} className="pull-right">
              Forgot your password?
            </Link>
            <br />
            <Field
              name="password"
              component={LabeledFormControl}
              type="password"
              placeholder="Password"
              label="PASSWORD*"
            />
            <br />
            <div className="text-center">
              <Button type="submit" bsStyle="primary" bsSize="large">
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </Grid>
    </div>
  );
};

Login.propTypes = {
  // loginActions: PropTypes.object,
  handleSubmit: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  login: makeSelectLogin(),
});

function mapDispatchToProps(dispatch) {
  return {
    loginActions: bindActionCreators(loginActions, dispatch),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'login', reducer });
const withSaga = injectSaga({ key: 'login', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  reduxForm({
    form: 'login',
    onSubmit: (data, dispatch, props) => {
      props.loginActions.request(data.email, data.password);
    },
  })
)(Login);
