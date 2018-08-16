import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Grid, Button } from 'react-bootstrap';

import routes from 'routes';
import injectReducer from 'utils/injectReducer';
import { MSLUserDashboard } from 'containers/MSLUserDashboard';
// import injectSaga from 'utils/injectSaga';
import reducer from './reducer';

// import saga from './saga';

export class Dashboard extends React.PureComponent {
  render() {
    const { engagementPlans, user } = this.props;

    // debugger;

    return (
      <Grid>
        <Helmet>
          <title>OTSK - Dashboard</title>
        </Helmet>

        {user.group_names.contains('Role MSL') && <MSLUserDashboard />}

        <h2>Dashboard</h2>
        <br />
        <br />
        <hr />
        <h4>WIP:</h4>
        <p>
          <Link to={routes.RECORD_INTERACTION.path}>
            <Button>Record Interaction</Button>
          </Link>
        </p>
        <p>
          <Link to={`${routes.RECORD_INTERACTION.path}?hcp=2`}>
            <Button>Record Interaction for HCP #2</Button>
          </Link>
        </p>
        <p>
          <Link
            to={`${
              routes.RECORD_INTERACTION.path
            }?origin_of_interaction=engagement_plan`}
          >
            <Button>Record Interaction from EP</Button>
          </Link>
        </p>
        <p>
          <Link to={routes.LIST_INTERACTIONS.path}>
            <Button>List Interactions</Button>
          </Link>
        </p>
        <p>
          <Link to={routes.CREATE_EP.path}>
            <Button>Create Engagement Plan</Button>
          </Link>
        </p>
        <h3>Edit EP:</h3>
        <ul>
          {engagementPlans.map((ep) => (
            <li key={ep.id}>
              <Link to={routes.UPDATE_EP.makePath(ep.id)}>EP #{ep.id}</Link>
            </li>
          ))}
        </ul>
      </Grid>
    );
  }
}

Dashboard.propTypes = {
  user: PropTypes.object,
  engagementPlans: PropTypes.object,
};

export function mapDispatchToProps() {
  return {};
}

function mapStateToProps(state) {
  return {
    user: state.get('global').get('user'),
    engagementPlans: state.get('global').get('engagementPlans'),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'home', reducer });
// const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  // withSaga,
  withConnect
)(Dashboard);
