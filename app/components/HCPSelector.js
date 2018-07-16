import React from 'react';
import {
  Col,
  Row,
  Panel,
  Table,
  FormControl,
  Button,
} from 'react-bootstrap';
import PropTypes from 'prop-types';


export default class HCPSelector extends React.Component {
  static propTypes = {
    // supplied by Field
    input: PropTypes.object, // { onChange, value, ...}
    // meta: PropTypes.object, // { error, ... }
    // other
    hcps: PropTypes.array,
    hcp: PropTypes.object,
    searchHCPs: PropTypes.func,
    fetchHCP: PropTypes.func,
    onHCPSelected: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchHCPsText: '',
    };
  }

  componentDidMount() {
    console.log('=== props', this.props);
    const hcpId = this.props.input.value;
    if (hcpId) {
      this.props.fetchHCP(hcpId);
    }
  }

  handleSearchHCPsInputChange = (event) => {
    this.setState({ searchHCPsText: event.target.value });
  };

  searchHCPsKeyPressed = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      console.log('...will search for HCPs');
      this.props.searchHCPs(this.state.searchHCPsText);
    }
  };

  handleHCPSelection = (event) => {
    // console.log('=== props:', this.props);
    const hcpId = event.target.value;
    this.props.input.onChange(hcpId);
    this.props.fetchHCP(hcpId);
    this.props.onHCPSelected(hcpId);
  };

  render() {
    const { hcps, hcp } = this.props;

    return (
      <div className="HCPSelector">
        <Row>
          <Col sm={10}>
            <FormControl
              type="text"
              placeholder="Search HCPs ..."
              onChange={this.handleSearchHCPsInputChange}
              onKeyPress={this.searchHCPsKeyPressed}
              className="form-control--primary"
            />
          </Col>
          <Col sm={2}>
            <Button type="submit" block>
              <span className="fi-icon icon-nav-hcps" />
              {' '}New HCP
            </Button>
          </Col>
        </Row>
        <br />

        <Row>
          <Col xs={12}>
            <Table bordered condensed hover>
              <tbody>
                {hcps.map((it) => (
                  <tr key={it.id}>
                    <td>
                      <input type="radio" name="hcp" value={it.id} onChange={this.handleHCPSelection} />
                    </td>
                    <td>{it.first_name} {it.last_name}</td>
                    <td>{it.institution_name}</td>
                    <td>{it.city}, {it.country}</td>
                    <td>{it.ta_names.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <br />

        {hcp && <SelectedHCP hcp={hcp} />}
      </div>
    );
  }
}


const SelectedHCP = ({ hcp }) => ( // eslint-disable-line react/prop-types
  <Panel className="HCPSelector__SelectedHCP">
    <Panel.Body>
      <div className="HCPSelector__SelectedHCP__heading">
        <span className="HCPSelector__SelectedHCP__name">
          Dr. {hcp.first_name} {hcp.last_name}
        </span>
        <span className={`HCPSelector__SelectedHCP__consent HCPSelector__SelectedHCP__consent--${hcp.has_consented ? 'yes' : 'no'}`}>
          <span className={hcp.has_consented ? 'icon-consent-yes' : 'icon-consent-no'} />
        </span>
        <div className="HCPSelector__SelectedHCP__institution_name">
          {hcp.institution_name}
        </div>
        <div className="HCPSelector__SelectedHCP__location">
          <div className="HCPSelector__SelectedHCP__location__city">
            {hcp.city}
          </div>
          <div className="HCPSelector__SelectedHCP__location__country">
            {hcp.country}
          </div>
        </div>
        <div className="HCPSelector__SelectedHCP__tas">
          {hcp.ta_names.join(', ')}
        </div>
      </div>
    </Panel.Body>
  </Panel>
);
