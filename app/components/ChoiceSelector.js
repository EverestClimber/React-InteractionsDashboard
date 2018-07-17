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
    className: PropTypes.string,
    children: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIdx: null,
    };
  }

  handleCbChange = (event, idx, value) => {
    // event.preventDefault();
    // console.log('^_^ selected option:', value, idx);
    this.props.input.onChange(value);
    this.setState({ selectedIdx: idx });
  };

  render() {
    // console.log('***props', this.props);
    const { choices, meta, disabled, label, className, children } = this.props;
    return (
      <BS.FormGroup
        className={`ChoiceSelector ${label ? 'ChoiceSelector--labeled' : ''} ${children ? 'ChoiceSelector--withSecondary' : ''} ${(meta.touched && meta.error) ? 'ChoiceSelector--error' : ''}  ${className}`}
        validationState={(meta.touched && meta.error) ? 'error' : null}
      >
        <div className="ChoiceSelector__primary">
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
        </div>
        {children && (
          <div className="ChoiceSelector__secondary">
            {children}
          </div>
        )}
      </BS.FormGroup>
    );
  }
}
