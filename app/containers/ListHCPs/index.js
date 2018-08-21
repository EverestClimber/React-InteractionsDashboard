import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { Grid } from 'react-bootstrap';
import * as _ from 'underscore';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
// import HCP from 'records/HCP';
import { CenteredAlert } from 'components/forms';
import SmartTable from 'components/SmartTable';
import reducer from './reducer';
import saga from './saga';
import { listHCPsActions } from './actions';

export class ListHCPs extends React.PureComponent {
  static propTypes = {
    listHCPs: PropTypes.func.isRequired,
    hcps: PropTypes.array,
    serverError: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      hcps: props.hcps, // filtered and sorted
    };
  }

  componentDidMount() {
    this.props.listHCPs();
  }

  componentDidUpdate(prevProps) {
    if (this.props.hcps !== prevProps.hcps) {
      this.setState({ hcps: this.props.hcps }); // eslint-disable-line
    }
  }

  handleSearchChange = (searchText) => {
    this.setState({
      hcps: this.filterHCPs(
        this.props.hcps,
        searchText
      ),
    });
  };

  handleSort = (field, direction) => {
    this.setState({
      hcps: this.sortInteractions(
        this.props.hcps,
        field,
        direction
      ),
    });
  };

  filterHCPs(hcps, searchText) {
    const words = searchText.split(/[,\s]+/).filter((s) => s);
    return hcps.filter((hcp) =>
      _.every(words.map((w) => this.hcpToText(hcp).indexOf(w) !== -1))
    );
  }

  getFieldForSorting(hcp, field) {
    if (typeof field === 'string') {
      return hcp[field];
    } else if (typeof field === 'function') {
      return field(hcp);
    } else if (field.sortField) {
      return typeof field.sortField === 'string'
        ? hcp[field.sortField]
        : field.sortField(hcp);
    }
    return field.render(hcp);
  }

  sortInteractions(hcps, field, direction) {
    return hcps
      .sort((i1, i2) => {
        const f1 = this.getFieldForSorting(i1, field);
        const f2 = this.getFieldForSorting(i2, field);
        // console.log(`comparing ${f1} <> ${f2} ~ ${direction}`);
        if (f1 === f2) {
          return i1.last_interaction <= i2.last_interaction ? 1 : -1;
        }
        return f1 < f2 ? -1 * direction : 1 * direction;
      })
      .slice();
  }

  hcpToText(hcp) {
    return Object.keys(hcp)
      .map((k) => {
        if (!hcp[k]) return '';
        if (typeof hcp[k] !== 'object') {
          return String(hcp[k]);
        }
        return Object.keys(hcp[k])
          .map((kk) => String(hcp[k][kk]))
          .join(' ');
      })
      .join(' ')
      .toLowerCase();
  }

  // handleInteractionClick = (interaction) => {
  //   // DEBUG
  //   const prefix =
  //     window.location.host.indexOf('localhost:') !== -1
  //       ? 'http://localhost:8000'
  //       : '';
  //   window.open(
  //     `${prefix}/djadmin/interactionscore/interaction/${interaction.id}/change/`
  //   );
  // };

  render() {
    const { serverError } = this.props;

    return (
      <Grid>
        <Helmet>
          <title>MSL Interactions - HCPs Directory</title>
        </Helmet>

        <h2>HCPs directory</h2>

        {serverError && (
          <CenteredAlert bsStyle="danger">
            An error has occurred. Please refresh the page or try again later.
            <pre>{serverError}</pre>
          </CenteredAlert>
        )}

        { <SmartTable
          title="HCPs"
          items={this.state.hcps}
          btnLabel="New HCP"
          fields={{
            '': {
              render: (it) => (
                <span
                  className={`SelectedHCP__consent SelectedHCP__consent--${
                    it.has_consented ? 'yes' : 'no'
                  }`}
                >
                  <span
                    className={
                      it.has_consented ? 'icon-consent-yes' : 'icon-consent-no'
                    }
                  />
                </span>
              ),
              sortField: (it) => it.has_consented,
            },
            'HCP Name': {
              render: (it) => (
                <span style={{ whiteSpace: 'nowrap' }}>
                  {`${it.first_name} ${it.last_name}`}
                </span>
              ),
              sortField: (it) =>
                it ? `${it.first_name} ${it.last_name}` : '',
            },
            Interactions: (it) => it.interactions_count,
            Organisation: (it) => it.institution_name,
            City: {
              render: (it) => it.city,
            },
            TA: (it) => it.tas_names,
            'Last Interaction': {
              render: (it) => (
                it.last_interaction ?
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {moment(it.last_interaction, 'YYYY-MM-DDTHH:mm:ss.T').format('D MMM Y, h:mm A')}
                  </span>
                : ''
              ),
              sortField: (it) => it.last_interaction,
            },
          }}
          searchItems={this.handleSearchChange}
          sortItems={this.handleSort}
          onItemClick={this.handleInteractionClick}
        /> }
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  const listHCPsState = state.get('listHCPs');
  return {
    serverError: listHCPsState.get('serverError'),
    hcps: listHCPsState.get('hcps') && listHCPsState.get('hcps').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      listHCPs: listHCPsActions.request,
    },
    dispatch
  );
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: 'listHCPs', reducer });
const withSaga = injectSaga({ key: 'listHCPs', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(ListHCPs);
