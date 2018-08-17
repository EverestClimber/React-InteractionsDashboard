import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Field, reduxForm } from 'redux-form/immutable';
import { Button, Grid } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { LabeledFormControl } from 'components/forms';
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';

export const PasswordReset = (props) => {
  const { handleSubmit } = props;

  // debugger;

  console.log('--- PasswordReset.render');

  return (
    <div className="PasswordReset auth-form">
      <Helmet>
        <title>Otsuka - MSL Interactions</title>
      </Helmet>
      <Grid>
        <div className="PasswordReset__form auth-form__form">
          <form onSubmit={handleSubmit}>
            <h2>Password Reset</h2>
            <p>
              {`Forgotten your password? Enter your e-mail address below, and
              we'll send you an e-mail allowing you to reset it.`}
            </p>
            <Field
              name="email"
              component={LabeledFormControl}
              type="text"
              placeholder="Email"
              label="EMAIL*"
            />
            <br />
            <div className="text-center">
              <Button type="submit" bsStyle="primary" bsSize="large">
                Reset My Password
              </Button>
            </div>
          </form>
        </div>
      </Grid>
    </div>
  );
};

PasswordReset.propTypes = {
  passwordReset: PropTypes.func,
  handleSubmit: PropTypes.func,
};

function mapStateToProps(state) {
  const listInteractionsState = state.get('passwordReset');
  return {
    serverError: listInteractionsState.get('serverError'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      passwordReset: actions.passwordResetActions.request,
    },
    dispatch
  );
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'passwordReset', reducer });
const withSaga = injectSaga({ key: 'passwordReset', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  reduxForm({
    form: 'passwordReset',
    onSubmit: (data, dispatch, props) => {
      props.passwordReset(data.email);
    },
  })
)(PasswordReset);
