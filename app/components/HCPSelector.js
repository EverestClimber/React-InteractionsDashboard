import React from 'react';
import {
  Grid,
  Col,
  Row,
  Panel,
  FormControl,
  Button,
} from 'react-bootstrap';
import PropTypes from 'prop-types';


export default class HCPSelector extends React.Component {
  static propTypes = {
    // supplied by Field
    input: PropTypes.object, // { onChange, value, ...}
    meta: PropTypes.object, // { error, ... }
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
      showList: false,
    };
    this.containerRef = React.createRef();
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    document.body.addEventListener('click', this.handleBodyClick);

    // when value is received from outside
    const hcpId = this.props.input.value;
    if (hcpId) {
      this.props.fetchHCP(hcpId);
      this.props.onHCPSelected(hcpId);
    }
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleBodyClick);
  }

  handleBodyClick = (event) => {
    if (this.inputRef.current && this.inputRef.current.contains(event.target)) {
      // console.log('*** clicked inside');
      this.setState({ showList: true });
    } else {
      // console.log('*** clicked outside');
      // when clicking inside leave time at lease for event to propagate
      if (this.containerRef.current && this.containerRef.current.contains(event.target)) {
        // TODO: replace this hack with toggling visibility instead of existence based on showList
        setTimeout(
          () => this.setState({ showList: false }),
          250
        );
      } else {
        this.setState({ showList: false });
      }
    }
  };

  handleSearchHCPsInputChange = (event) => {
    this.setState({ searchHCPsText: event.target.value });
    this.props.searchHCPs(event.target.value);
  };

  searchHCPsKeyPressed = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.props.searchHCPs(this.state.searchHCPsText);
    }
  };

  // searchHCPsFocused = () => {
  //   this.setState({ showList: true });
  // };
  //
  // searchHCPsBlured = () => {
  //   setTimeout(
  //     () => this.setState({ showList: false }),
  //     250
  //   );
  // };

  handleHCPSelection = (hcpId) => {
    console.log('^^^ handle hcp select');
    this.props.input.onChange(hcpId);
    this.props.fetchHCP(hcpId);
    this.props.onHCPSelected(hcpId);
  };

  showAll = () => {
    console.log('--- SHOW ALL ---');
    this.setState({ searchHCPsText: '' });
    this.props.searchHCPs('');
    setTimeout(
      () => this.setState({ showList: true }),
      500
    );
  };

  render() {
    const { hcps, hcp, meta } = this.props;

    return (
      <div
        className={`HCPSelector ${(meta.touched && meta.error) ? 'HCPSelector--error' : ''}`}
        ref={this.containerRef}
      >
        <Row>
          <Col sm={10}>
            <div
              className="HCPSelector__Search"
              ref={this.inputRef}
            >
              <FormControl
                type="text"
                placeholder="Search HCPs ..."
                onChange={this.handleSearchHCPsInputChange}
                onKeyPress={this.searchHCPsKeyPressed}
                // onFocus={this.searchHCPsFocused}
                // onBlur={this.searchHCPsBlured}
                className="form-control--primary"
                value={this.state.searchHCPsText}
              />
              <a
                className="HCPSelector__Search__ShowAll"
                role="button"
                tabIndex={0}
                onClick={this.showAll}
              >
                Show All
              </a>
            </div>
          </Col>
          <Col sm={2}>
            <Button type="submit" block>
              <span className="fi-icon icon-nav-hcps" />
              {' '}New HCP
            </Button>
          </Col>
        </Row>
        <br />

        {(this.state.showList && hcps && hcps.length) ? (
          <ListHCPs hcps={hcps} handleSelect={this.handleHCPSelection} />
        ) : null}

        {hcp && <SelectedHCP hcp={hcp} handleRemove={() => this.handleHCPSelection(null)} />}
      </div>
    );
  }
}


const ListHCPs = ({ hcps, handleSelect }) => ( // eslint-disable-line react/prop-types
  <Grid className="HCPSelector__ListHCPs__container">
    <Row>
      <Col sm={10}>
        <div className="HCPSelector__ListHCPs__content">
          <div className="HCPSelector__ListHCPs__box">
            <div className="HCPSelector__ListHCPs__list">
              {hcps.map((hcp) => (
                <div
                  key={hcp.id}
                  className="HCPSelector__ListHCPs__HCP"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelect(hcp.id)}
                >
                  <div className="HCPSelector__ListHCPs__HCP__name">
                    {hcp.first_name} {hcp.last_name}
                  </div>

                  <div className="HCPSelector__ListHCPs__HCP__institution">
                    {hcp.institution_name}
                  </div>

                  <div className="HCPSelector__ListHCPs__HCP__location HCPSelector__location">
                    <span className="icon-hcp-location" />
                    <span className="HCPSelector__location__city">
                      {hcp.city}
                    </span>
                    {', '}
                    <span className="HCPSelector__location__country">
                      {hcp.country}
                    </span>
                  </div>

                  <div className="HCPSelector__ListHCPs__HCP__tas">
                    {hcp.ta_names.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Col>
    </Row>
  </Grid>
);


const SelectedHCP = ({ hcp, handleRemove }) => ( // eslint-disable-line react/prop-types
  <Panel
    className={`HCPSelector__SelectedHCP HCPSelector__SelectedHCP--${hcp.has_consented ? 'consentYes' : 'consentNo'}`}
  >
    <Panel.Body>
      <div className="HCPSelector__SelectedHCP__heading">
        <span className="HCPSelector__SelectedHCP__name">
          Dr. {hcp.first_name} {hcp.last_name}
        </span>
        <span
          className={`HCPSelector__SelectedHCP__consent HCPSelector__SelectedHCP__consent--${hcp.has_consented ? 'yes' : 'no'}`}
        >
          <span className={hcp.has_consented ? 'icon-consent-yes' : 'icon-consent-no'} />
          <span className="HCPSelector__SelectedHCP__consent__label">
            {hcp.has_consented ? '' : 'NO CONSENT'}
          </span>
        </span>
        <span
          className="HCPSelector__SelectedHCP__remove icon-delete"
          role="button"
          tabIndex={0}
          onClick={handleRemove}
        />
      </div>
      <div className="HCPSelector__SelectedHCP__location HCPSelector__location">
        <span className="icon-hcp-location" />
        <span className="HCPSelector__SelectedHCP__location__city">
          {hcp.city}
        </span>
        {', '}
        <span className="HCPSelector__SelectedHCP__location__country">
          {hcp.country}
        </span>
      </div>
      <div className="HCPSelector__SelectedHCP__tas">
        {hcp.ta_names.join(', ')}
      </div>
      <div className="HCPSelector__SelectedHCP__institution_name">
        <span className="icon-hcp-hospital" />{' '}
        {hcp.institution_name}
      </div>
    </Panel.Body>
  </Panel>
);
