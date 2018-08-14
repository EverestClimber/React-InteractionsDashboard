import React from 'react';
import {
  Button,
  Table,
  FormControl,
  FormGroup,
  InputGroup,
} from 'react-bootstrap';
import PropTypes from 'prop-types';

export default class SmartTable extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    fields: PropTypes.object.isRequired,
    searchItems: PropTypes.func.isRequired,
    sortItems: PropTypes.func.isRequired,
    onItemClick: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      sortBy: null,
    };
  }

  handleSearchChange = (event) => {
    const searchText = event.target.value.toLowerCase();
    this.setState({ searchText });
    this.props.searchItems(searchText);
  };

  renderField(item, field) {
    if (typeof field === 'string') {
      return item[field];
    } else if (typeof field === 'function') {
      return field(item);
    } else if (Array.isArray(field)) {
      // field = [field, sortParamName]
      return this.renderField(item, field[0]);
    }
    return null;
  }

  render() {
    const { items, fields } = this.props;
    console.log('\n--- rending');

    return (
      <React.Fragment>
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
              {Object.entries(fields).map(([fieldName, field]) => (
                <th key={fieldName} onClick={() => this.props.sortItems(field)}>
                  {fieldName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} onClick={() => this.props.onItemClick(item)}>
                {Object.entries(fields).map(([fieldName, field]) => (
                  <td key={fieldName}>{this.renderField(item, field)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    );
  }
}
