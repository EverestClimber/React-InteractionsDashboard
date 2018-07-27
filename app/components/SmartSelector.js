import React from 'react';
import {
  Grid,
  Col,
  Row,
  FormControl,
  Button,
  Checkbox,
} from 'react-bootstrap';
import PropTypes from 'prop-types';


export default class SmartSelector extends React.Component {
  static propTypes = {
    // supplied by Field
    input: PropTypes.object, // { onChange, value, ...}
    meta: PropTypes.object, // { error, ... }
    // other
    // hcps: PropTypes.array,
    items: PropTypes.array,
    // selectedHCPs: PropTypes.object,
    selectedItems: PropTypes.object,
    // searchHCPs: PropTypes.func,
    searchItems: PropTypes.func,
    // fetchHCP: PropTypes.func,
    fetchItem: PropTypes.func,
    // removeHCP: PropTypes.func,
    removeItem: PropTypes.func,
    // onHCPSelected: PropTypes.func,
    onItemSelected: PropTypes.func,
    // renderSelectedHCP: PropTypes.func,
    renderSelectedItem: PropTypes.func,
    multiple: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      showList: false,
    };
    this.containerRef = React.createRef();
    this.inputRef = React.createRef();
  }

  componentDidMount() {

    document.body.addEventListener('click', this.handleBodyClick);

    // when value is received from outside
    const itemId = this.props.input.value;
    if (itemId) {
      this.props.fetchItem(itemId);
      if (this.props.onItemSelected) {
        this.props.onItemSelected(itemId);
      }
    }
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleBodyClick);
  }

  handleBodyClick = (event) => {
    if (this.inputRef.current && this.inputRef.current.contains(event.target)) {
      this.setState({ showList: true });
    } else {
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

  handleSearchInputChange = (event) => {
    this.setState({ searchText: event.target.value });
    this.props.searchItems(event.target.value);
  };

  searchKeyPressed = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.props.searchItems(this.state.searchText);
    }
  };

  handleItemSelection = (itemId) => {
    if (!this.props.multiple) {
      this.props.input.onChange(itemId);
      this.props.fetchItem(itemId);
      if (this.props.onItemSelected) {
        this.props.onItemSelected(itemId);
      }
    } else {
      const newSelectedItems = this.props.selectedItems.get(itemId)
        ? this.props.selectedItems.delete(itemId)
        : this.props.selectedItems.set(itemId, this.props.items.find((hcp) => hcp.id === itemId));
      this.props.input.onChange(newSelectedItems);
    }
  };

  handleItemRemoval = (itemId) => {
    if (!this.props.multiple) {
      this.props.input.onChange(null);
      this.props.removeItem(itemId);
    } else {
      this.props.input.onChange(this.props.selectedItems.delete(itemId));
    }
  };

  showAll = () => {
    this.setState({ searchText: '' });
    this.props.searchItems('');
    setTimeout(
      () => this.setState({ showList: true }),
      500
    );
  };

  render() {
    const { items, selectedItems, meta, multiple, renderSelectedItem } = this.props;
    const RenderSelectedHCP = renderSelectedItem;

    return (
      <div
        className={`HCPSelector ${(meta && meta.touched && meta.error) ? 'HCPSelector--error' : ''} ${multiple ? 'HCPSelector--multiple' : ''}`}
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
                onChange={this.handleSearchInputChange}
                onKeyPress={this.searchKeyPressed}
                className="form-control--primary"
                value={this.state.searchText}
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

        {(this.state.showList && items && items.length) ? (
          <ListItems
            items={items}
            handleSelect={this.handleItemSelection}
            multiple={multiple}
            selectedItems={selectedItems}
          />
        ) : null}

        {(renderSelectedItem && selectedItems && selectedItems.size) ? (
          <div className="SelectedHCPs">
            {Array.from(selectedItems.values()).map((hcp) =>
              <RenderSelectedHCP key={hcp.id} hcp={hcp} handleRemove={this.handleItemRemoval} />
            )}
          </div>
        ) : null}
      </div>
    );
  }
}


const ListItems = ({ multiple, items, handleSelect, selectedItems }) => ( // eslint-disable-line react/prop-types
  <Grid className="HCPSelector__ListHCPs__container">
    <Row>
      <Col sm={10}>
        <div className="HCPSelector__ListHCPs__content">
          <div className="HCPSelector__ListHCPs__box">
            <div className="HCPSelector__ListHCPs__list">
              {items.map((hcp) => (
                <div
                  key={hcp.id}
                  className="HCPSelector__ListHCPs__HCP"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelect(hcp.id)}
                >
                  {multiple && (
                    <div className="HCPSelector__ListHCPs__HCP__selected">
                      <Checkbox inline readOnly checked={!!selectedItems.get(hcp.id)} />
                    </div>
                  )}

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
