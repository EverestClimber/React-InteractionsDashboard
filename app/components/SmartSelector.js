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
        className={`SmartSelector ${(meta && meta.touched && meta.error) ? 'SmartSelector--error' : ''} ${multiple ? 'SmartSelector--multiple' : ''}`}
        ref={this.containerRef}
      >
        <Row>
          <Col sm={10}>
            <div
              className="SmartSelector__Search"
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
                className="SmartSelector__Search__ShowAll"
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
          <Grid className="SmartSelector__ListItems__container">
            <Row>
              <Col sm={10}>
                <div className="SmartSelector__ListItems__content">
                  <div className="SmartSelector__ListItems__box">
                    <div className="SmartSelector__ListItems__list">
                      {items.map((item) => (
                        <Item
                          key={item.id}
                          multiple={multiple}
                          item={item}
                          handleSelect={this.handleItemSelection}
                          selectedItems={selectedItems}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Grid>
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

const Item = ({ multiple, item, handleSelect, selectedItems }) => ( // eslint-disable-line react/prop-types
  <div
    key={item.id}
    className="SmartSelector__ListItems__Item"
    role="button"
    tabIndex={0}
    onClick={() => handleSelect(item.id)}
  >
    {multiple && (
      <div className="SmartSelector__ListItems__Item__selected">
        <Checkbox inline readOnly checked={!!selectedItems.get(item.id)} />
      </div>
    )}

    <div className="SmartSelector__ListItems__Item__name">
      {item.first_name} {item.last_name}
    </div>

    <div className="SmartSelector__ListItems__Item__institution">
      {item.institution_name}
    </div>

    <div className="SmartSelector__ListItems__Item__location SmartSelector__location">
      <span className="icon-hcp-location" />
      <span className="SmartSelector__location__city">
        {item.city}
      </span>
      {', '}
      <span className="SmartSelector__location__country">
        {item.country}
      </span>
    </div>

    <div className="SmartSelector__ListItems__Item__tas">
      {item.ta_names.join(', ')}
    </div>
  </div>
);
