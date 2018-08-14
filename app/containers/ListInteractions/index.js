import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Grid, Panel } from 'react-bootstrap';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Interaction from 'records/Interaction';
import { CenteredAlert } from 'components/forms';
import SmartTable from 'components/SmartTable';
import reducer from './reducer';
import saga from './saga';
import { listInteractionsActions } from './actions';

export class ListInteractions extends React.PureComponent {
  static propTypes = {
    listInteractions: PropTypes.func.isRequired,
    interactions: PropTypes.array,
    serverError: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      interactions: props.interactions, // filtered and sorted
    };
  }

  componentDidMount() {
    this.props.listInteractions();
  }

  componentDidUpdate(prevProps) {
    if (this.props.interactions !== prevProps.interactions) {
      this.setState({ interactions: this.props.interactions }); // eslint-disable-line
    }
  }

  handleSearchChange = (searchText) => {
    this.setState({
      interactions: this.filterInteractions(
        this.props.interactions,
        searchText
      ),
    });
  };

  handleSort = (field) => {
    console.log('=== sort by:', field);
    this.setState({
      interactions: this.sortInteractions(this.props.interactions, field),
    });
  };

  filterInteractions(interactions, searchText) {
    return interactions.filter(
      (inter) => this.interactionToText(inter).indexOf(searchText) !== -1
    );
  }

  sortInteractions(interactions, field) {
    return interactions
      .sort((i1, i2) => {
        const [f1, f2] =
          typeof field === 'string'
            ? [i1[field], i2[field]]
            : [field(i1), field(i2)];
        if (f1 === f2) return 0;
        return f1 < f2 ? -1 : 1;
      })
      .slice();
  }

  interactionToText(inter) {
    return Object.keys(inter)
      .map((k) => {
        if (!inter[k]) return '';
        if (typeof inter[k] !== 'object') {
          return String(inter[k]);
        }
        return Object.keys(inter[k])
          .map((kk) => String(inter[k][kk]))
          .join(' ');
      })
      .join(' ')
      .toLowerCase();
  }

  handleInteractionClick = (interaction) => {
    // DEBUG
    const prefix =
      window.location.host.indexOf('localhost:') !== -1
        ? 'http://localhost:8000'
        : '';
    window.open(
      `${prefix}/djadmin/interactionscore/interaction/${interaction.id}/change/`
    );
  };

  render() {
    const { serverError } = this.props;

    return (
      <Grid>
        <h2>Interactions</h2>

        {serverError && (
          <CenteredAlert bsStyle="danger">
            An error has occurred. Please refresh the page or try again later.
            <pre>{serverError}</pre>
          </CenteredAlert>
        )}

        <Panel>
          <Panel.Body>
            <SmartTable
              items={this.state.interactions}
              fields={{
                'Date / Time': (it) => new Date(it.created_at).toLocaleString(),
                'MSL Name': (it) =>
                  it.user ? `${it.user.first_name} ${it.user.last_name}` : '',
                'HCP Name': (it) =>
                  it.hcp ? `${it.hcp.first_name} ${it.hcp.last_name}` : '',
                Consent: (it) => (it.has_consented ? 'Yes' : 'No'),
                'Joint Visit': (it) => (it.is_joint_visit ? 'Yes' : 'No'),
                'Interaction Type': (it) =>
                  Interaction.type_of_interaction_choices[
                    it.type_of_interaction
                  ],
                'Adverse Event': (it) => (it.is_adverse_event ? 'Yes' : 'No'),
                'PV Followed': (it) =>
                  it.appropriate_pv_procedures_followed ? 'Yes' : 'No',
              }}
              searchItems={this.handleSearchChange}
              sortItems={this.handleSort}
              onItemClick={this.handleInteractionClick}
            />
          </Panel.Body>
        </Panel>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  const listInteractionsState = state.get('listInteractions');
  return {
    serverError: listInteractionsState.get('serverError'),
    interactions:
      listInteractionsState.get('interactions') &&
      listInteractionsState.get('interactions').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      listInteractions: listInteractionsActions.request,
    },
    dispatch
  );
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'listInteractions', reducer });
const withSaga = injectSaga({ key: 'listInteractions', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(ListInteractions);
