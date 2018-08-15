import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Grid } from 'react-bootstrap';
import moment from 'moment';
import * as _ from 'underscore';

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

  handleSort = (field, direction) => {
    console.log('=== sort by:', field);
    this.setState({
      interactions: this.sortInteractions(
        this.props.interactions,
        field,
        direction
      ),
    });
  };

  filterInteractions(interactions, searchText) {
    const words = searchText.split(/[,\s]+/).filter((s) => s);
    return interactions.filter((inter) =>
      _.every(words.map((w) => this.interactionToText(inter).indexOf(w) !== -1))
    );
  }

  getField(interaction, field, sorting) {
    if (typeof field === 'string') {
      return interaction[field];
    } else if (typeof field === 'function') {
      return field(interaction);
    }
    return this.getField(
      interaction,
      sorting ? field.sortBy || field.render : field.render
    );
  }

  sortInteractions(interactions, field, direction) {
    return interactions
      .sort((i1, i2) => {
        const f1 = this.getField(i1, field, true);
        const f2 = this.getField(i2, field);
        console.log(`comparing ${f1} <> ${f2}`);
        if (f1 === f2) {
          return i1.time_of_interaction <= i2.time_of_interaction ? 1 : -1;
        }
        return f1 < f2 ? -1 * direction : 1 * direction;
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
        <h2>Interactions Report</h2>

        {serverError && (
          <CenteredAlert bsStyle="danger">
            An error has occurred. Please refresh the page or try again later.
            <pre>{serverError}</pre>
          </CenteredAlert>
        )}

        <SmartTable
          title="Recorded Interactions"
          items={this.state.interactions}
          fields={{
            'Date / Time': {
              render: (it) => (
                <span style={{ 'white-space': 'nowrap' }}>
                  {moment(it.time_of_interaction).format('D MMM Y, h:mm A')}
                </span>
              ),
              sortField: 'time_of_interaction',
            },
            'MSL Name': (it) => (
              <span style={{ 'white-space': 'nowrap' }}>
                {it.user ? `${it.user.first_name} ${it.user.last_name}` : ''}
              </span>
            ),
            'HCP Name': (it) => (
              <span style={{ 'white-space': 'nowrap' }}>
                {it.hcp ? `${it.hcp.first_name} ${it.hcp.last_name}` : ''}{' '}
              </span>
            ),
            Consent: (it) => (it.has_consented ? 'Yes' : 'No'),
            Project: (it) => it.project.title,
            'Joint Visit': (it) => (it.is_joint_visit ? 'Yes' : 'No'),
            'Interaction Type': (it) =>
              Interaction.type_of_interaction_choices[it.type_of_interaction] ||
              '',
            'Adverse Event': (it) => (it.is_adverse_event ? 'Yes' : 'No'),
            'PV Followed': (it) =>
              it.appropriate_pv_procedures_followed ? 'Yes' : 'No',
          }}
          searchItems={this.handleSearchChange}
          sortItems={this.handleSort}
          onItemClick={this.handleInteractionClick}
        />
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
