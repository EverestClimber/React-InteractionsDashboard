import React from 'react';
import {
  Button,
  Table,
  FormControl,
  FormGroup,
  InputGroup,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import * as classNames from 'classnames';

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
      sortDirection: 1,
    };
  }

  handleSearchChange = (event) => {
    const searchText = event.target.value.toLowerCase();
    this.setState({ searchText });
    this.props.searchItems(searchText);
  };

  handleSort = (fieldName, field) => {
    this.setState((prevState) => {
      let direction = 1;
      // when clicking same column header...
      if (fieldName === prevState.sortBy) {
        // if it was sorted in reverse we cancel sorting
        if (prevState.sortDirection === -1) {
          this.props.sortItems('created_at', -1);
          return { sortBy: null, sortDirection: 1 };
        }
        // otherwise we sort in reverse
        direction = -1;
      }
      this.props.sortItems(field, direction);
      return {
        sortBy: fieldName,
        sortDirection: direction,
      };
    });
  };

  renderField(item, field) {
    if (typeof field === 'string') {
      return item[field];
    } else if (typeof field === 'function') {
      return field(item);
    }
    // field = {field, render, sortBy, sortParamName}
    return this.renderField(item, field.render || field.field);
  }

  render() {
    const baseClass = 'SmartTable';

    const { items, fields } = this.props;
    console.log('\n--- rending');

    return (
      <div className={baseClass}>
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

        <pre>
          sort by: {this.state.sortBy} {this.state.sortDirection}
        </pre>

        <Table striped bordered hover>
          <thead>
            <tr>
              {Object.entries(fields).map(([fieldName, field]) => (
                <th
                  key={fieldName}
                  onClick={() => this.handleSort(fieldName, field)}
                  className={classNames({
                    [`${baseClass}__tblHead`]: true,
                    [`${baseClass}__tblHead--active`]:
                      this.state.sortBy === fieldName,
                    [`${baseClass}__tblHead--asc`]:
                      this.state.sortDirection === 1,
                    [`${baseClass}__tblHead--desc`]:
                      this.state.sortDirection === -1,
                  })}
                >
                  {fieldName}{' '}
                  {this.state.sortBy &&
                    this.state.sortBy === fieldName &&
                    (this.state.sortDirection === 1 ? '▲' : '▼')}
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
      </div>
    );
  }
}
