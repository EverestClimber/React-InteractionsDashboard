import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Helmet } from 'react-helmet';

import injectReducer from 'utils/injectReducer';
// import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
// import saga from './saga';

export class Dashboard extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet>
          <title>OTSK - Dashboard</title>
        </Helmet>
        Dashboard
      </div>
    );
  }
}

Dashboard.propTypes = {};

export function mapDispatchToProps() {
  return {};
}

const mapStateToProps = createStructuredSelector({});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });
// const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  // withSaga,
  withConnect,
)(Dashboard);
