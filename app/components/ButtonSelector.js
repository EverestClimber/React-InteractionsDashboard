import React from 'react';
import * as BS from 'react-bootstrap';
import PropTypes from 'prop-types';

import { IconButton } from './buttons';


export class ButtonsSelector extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    options: PropTypes.array,
    disabled: PropTypes.bool,
    meta: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIdx: null,
    };
  }


  handleBtnClick = (event, idx, value) => {
    this.props.input.onChange(value);
    this.setState({ selectedIdx: idx });
  };


  render() {
    // console.log('%%% props:', this.props);
    const {
      options,
      disabled,
      meta,
    } = this.props;

    return (
      <BS.FormGroup
        validationState={(meta.touched && meta.error) ? 'error' : null}
      >
        <BS.ButtonGroup>
          {options.map((opt, i) => (
            <IconButton
              className={i === this.state.selectedIdx && 'IconButton--active'}
              key={opt.value}
              disabled={disabled}
              {...opt}
              onClick={(ev) => this.handleBtnClick(ev, i, opt.value)}
            />
          ))}
        </BS.ButtonGroup>
      </BS.FormGroup>
    );
  }
}
