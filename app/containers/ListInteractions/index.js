import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import {
  Grid,
  Button,
  Panel,
  Table,
  FormControl,
  FormGroup,
  InputGroup,
} from 'react-bootstrap';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Interaction from 'records/Interaction';
import { CenteredAlert } from 'components/forms';
import reducer from './reducer';
import saga from './saga';
import { listInteractionsActions } from './actions';


export class ListInteractions extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    listInteractions: PropTypes.func.isRequired,
    interactions: PropTypes.array,
    serverError: PropTypes.string,
  };

  state = {
    searchText: '',
  };

  componentDidMount() {
    this.props.listInteractions();
  }

  handleSearchChange = (event) => {
    this.setState({ searchText: event.target.value.toLowerCase() });
  };

  filterInteractions(interactions, searchText) {
    return interactions.filter((inter) =>
      this.interactionToText(inter).indexOf(searchText) !== -1
    );
  }

  interactionToText(inter) {
    return Object.keys(inter).map((k) => {
      if (!inter[k]) return '';
      if (typeof inter[k] !== 'object') {
        return String(inter[k]);
      }
      return Object.keys(inter[k]).map((kk) => String(inter[k][kk])).join(' ');
    }).join(' ').toLowerCase();
  }

  handleInteractionClick = (interactionId) => { // DEBUG
    const prefix = (window.location.host.indexOf('localhost:') !== -1)
      ? 'http://localhost:8000'
      : '';
    window.open(`${prefix}/djadmin/interactionscore/interaction/${interactionId}/change/`);
  };

  render() {
    const {
      interactions,
      serverError,
    } = this.props;

    const { searchText } = this.state;

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

            <FormGroup>
              <InputGroup>
                <InputGroup.Addon>
                  <i className="fas fa-search" />
                </InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="Search..."
                  value={this.state.searchText}
                  onChange={this.handleSearchChange}
                />
                <InputGroup.Button>
                  <Button>Search</Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date / Time</th>
                  <th>MSL Name</th>
                  <th>HCP Name</th>
                  <th>Consent</th>
                  <th>Joint Visit</th>
                  <th>Interaction Type</th>
                  <th>Adverse Event</th>
                  <th>PV Followed</th>
                </tr>
              </thead>
              <tbody>
                {interactions && this.filterInteractions(interactions, searchText).map((interaction) => (
                  <tr
                    key={interaction.id}
                    onClick={() => this.handleInteractionClick(interaction.id)}
                  >
                    <td>{new Date(interaction.created_at).toLocaleString()}</td>
                    <td>{interaction.user ? `${interaction.user.first_name} ${interaction.user.last_name}` : ''}</td>
                    <td>{interaction.hcp ? `${interaction.hcp.first_name} ${interaction.hcp.last_name}` : ''}</td>
                    <td>{interaction.has_consented ? 'Yes' : 'No'}</td>
                    <td>{interaction.is_joint_visit ? 'Yes' : 'No'}</td>
                    <td>{Interaction.type_of_interaction_choices[interaction.type_of_interaction]}</td>
                    <td>{interaction.is_adverse_event ? 'Yes' : 'No'}</td>
                    <td>{interaction.appropriate_pv_procedures_followed ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
    interactions: listInteractionsState.get('interactions') && listInteractionsState.get('interactions').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    listInteractions: listInteractionsActions.request,
  }, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'listInteractions', reducer });
const withSaga = injectSaga({ key: 'listInteractions', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ListInteractions);
