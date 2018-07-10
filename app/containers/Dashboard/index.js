import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  Grid, Button,
} from 'react-bootstrap';


import routes from 'routes';

import injectReducer from 'utils/injectReducer';
// import injectSaga from 'utils/injectSaga';
import reducer from './reducer';

// import saga from './saga';

export class Dashboard extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Grid>
        <Helmet>
          <title>OTSK - Dashboard</title>
        </Helmet>

        <h2>Dashboard</h2>

        <h4>WIP:</h4>

        <Link to={routes.RECORD_INTERACTION.path}>
          <Button>Record Interaction</Button>
        </Link>
        {' '}
        <Link to={routes.RECORD_INTERACTION_FOR_EP.make(1)}>
          <Button>Record Interaction for EP #1</Button>
        </Link>

      </Grid>
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
