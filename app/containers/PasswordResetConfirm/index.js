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

export class PasswordResetConfirm extends React.Component {
  render() {
    const { handleSubmit } = this.props;

    console.log('--- PasswordResetConfirm.render');

    console.log(this.props);

    return (
      <div className="PasswordReset auth-form">
        <Helmet>
          <title>Otsuka - MSL Interactions</title>
        </Helmet>
        <Grid>
          <div className="PasswordReset__form auth-form__form">
            <form onSubmit={handleSubmit}>
              <h2>Password Reset Confirmation</h2>
              <Field
                name="new_password1"
                component={LabeledFormControl}
                type="password"
                placeholder="Password"
                label="Password*"
              />
              <Field
                name="new_password2"
                component={LabeledFormControl}
                type="password"
                placeholder="Confirm Password"
                label="Confirm Password*"
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
  }
}

PasswordResetConfirm.propTypes = {
  passwordReset: PropTypes.func,
  handleSubmit: PropTypes.func,
};

function mapStateToProps(state) {
  const listInteractionsState = state.get('passwordResetConfirm');
  return {
    serverError: listInteractionsState.get('serverError'),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(
    {
      passwordResetConfirm: actions.passwordResetConfirmActions.request.bind(
        null,
        ownProps.match.params.uid,
        ownProps.match.params.token
      ),
    },
    dispatch
  );
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'passwordResetConfirm', reducer });
const withSaga = injectSaga({ key: 'passwordResetConfirm', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  reduxForm({
    form: 'passwordResetConfirm',
    onSubmit: (data, dispatch, props) => {
      props.passwordResetConfirm(data.new_password1, data.new_password2);
    },
  })
)(PasswordResetConfirm);
