import React from 'react';
import * as BS from 'react-bootstrap';
import PropTypes from 'prop-types';


export class ChoiceSelector extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    choices: PropTypes.array,
    disabled: PropTypes.bool,
    meta: PropTypes.object,
    label: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIdx: null,
    };
  }

  handleCbChange = (event, idx, value) => {
    // event.preventDefault();
    console.log('^_^ selected option:', value, idx);
    this.props.input.onChange(value);
    this.setState({ selectedIdx: idx });
  };

  render() {
    console.log('***props', this.props);
    const { choices, meta, disabled, label } = this.props;
    return (
      <BS.FormGroup
        className="ChoiceSelector"
        validationState={(meta.touched && meta.error) ? 'error' : null}
      >
        {label && (
          <BS.ControlLabel>{label}</BS.ControlLabel>
        )}
        {choices.map((opt, i) => (
          <BS.Checkbox
            inline
            key={opt[0]}
            value={opt[0]}
            onChange={(ev) => this.handleCbChange(ev, i, opt[0])}
            checked={i === this.state.selectedIdx}
            disabled={disabled}
          >
            {opt[1]}
          </BS.Checkbox>
        ))}
      </BS.FormGroup>
    );
  }
}
