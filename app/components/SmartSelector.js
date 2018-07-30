import React from 'react';
import {
  Grid,
  Col,
  Row,
  FormControl,
  Button,
} from 'react-bootstrap';
import PropTypes from 'prop-types';


export default class SmartSelector extends React.Component {
  static propTypes = {
    // can be supplied by Field
    input: PropTypes.object, // { onChange, value, ...}
    meta: PropTypes.object, // { error, ... }
    // other
    items: PropTypes.array,
    selectedItems: PropTypes.object,
    searchItems: PropTypes.func,
    fetchItem: PropTypes.func,
    removeItem: PropTypes.func,
    onItemSelected: PropTypes.func,
    renderSelectedItem: PropTypes.func,
    multiple: PropTypes.bool,
    btnLabel: PropTypes.string,
    placeholder: PropTypes.string,
    // render component
    renderItem: PropTypes.func,
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
    const {
      items,
      selectedItems,
      meta,
      multiple,
      renderSelectedItem,
      renderItem,
      placeholder,
      btnLabel,
    } = this.props;
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
                placeholder={placeholder}
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
              {' '}{btnLabel}
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
                      {items.map((item) => renderItem({
                        key: item.id,
                        multiple,
                        item,
                        handleSelect: this.handleItemSelection,
                        selectedItems,
                      }))}
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
