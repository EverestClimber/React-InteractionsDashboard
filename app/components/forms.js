import React from 'react';
import * as BS from 'react-bootstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';
import Flatpickr from 'react-flatpickr';


export const FormControl = ({ input, type, ...rest }) => { // eslint-disable-line react/prop-types
  const componentClassByType = {
    select: 'select', textarea: 'textarea',
  };
  return (
    <React.Fragment>
      <BS.FormControl
        {...input}
        componentClass={componentClassByType[type] || 'input'}
        {...rest}
      />
      {/* <pre>{JSON.stringify(rest.meta, null, 2)}</pre> */}
    </React.Fragment>
  );
};

export const Checkbox = ({ input, children, ...rest }) => ( // eslint-disable-line react/prop-types
  <BS.Checkbox {...input} {...rest}>
    {children}
  </BS.Checkbox>
);


export const Radio = ({ input, children, ...rest }) => ( // eslint-disable-line react/prop-types
  <BS.Radio {...input} {...rest}>
    {children}
  </BS.Radio>
);


export const Options = ({ choices }) => choices.map(([val, text]) => ( // eslint-disable-line react/prop-types
  <option key={val} value={val}>
    {text}
  </option>
));


export const SearchSelect = ({ input, meta, options, label, isMulti, ...rest }) => { // eslint-disable-line
  // NOTE: react-select's Select expects the value to be of form
  //  `{label, value}` or `null` (NOT undefined! if it receives undefined, it keeps
  //  showing the old selected value instead!)

  const onSelectChange = (selected) => {
    if (!isMulti) {
      input.onChange(selected.value);
    } else {
      input.onChange(selected.map((opt) => opt.value));
    }
  };

  let selectValue;
  if (!isMulti) {
    selectValue = options.find((opt) => String(opt.value) === String(input.value)) || null;
  } else {
    selectValue = input.value.map((v) => options.find(
      (opt) => String(opt.value) === String(v)
    )).filter((x) => x);
    if (!selectValue.length) {
      selectValue = null;
    }
  }

  return (
    <BS.FormGroup
      controlId={input.id || input.name}
      validationState={(meta.touched && meta.error) ? 'error' : null}
      className="SearchSelect"
    >
      {label && (
        <BS.ControlLabel>{label}</BS.ControlLabel>
      )}
      <Select
        value={selectValue}
        onChange={onSelectChange}
        options={options}
        isMulti={isMulti}
        {...rest}
      />
    </BS.FormGroup>
  );
};


export const FlatpickrDateTime = ({ input, meta, options, label, className, ...rest }) => ( // eslint-disable-line react/prop-types
  <BS.FormGroup
    controlId={input.id || input.name}
    validationState={(meta.touched && meta.error) ? 'error' : null}
    className="FlatpickrDateTime"
  >
    {label && (
      <BS.ControlLabel>{label}</BS.ControlLabel>
    )}
    <Flatpickr
      value={input.value}
      onChange={(val) => input.onChange(val[0])}
      className={className}
      {...rest}
    />
    <span className="FlatpickrDateTime__icon icon-calendar" />
  </BS.FormGroup>
);


export class LabeledFormControl extends React.PureComponent {
  static propTypes = {
    input: PropTypes.object,
    type: PropTypes.string,
    meta: PropTypes.object,
    label: PropTypes.string,
    helpText: PropTypes.string,
    children: PropTypes.node,
  };

  render() {
    const {
      input,
      type,
      meta,
      label,
      helpText,
      children,
      ...rest
    } = this.props;

    let field;
    if (type === 'checkbox') {
      field = (
        <BS.Checkbox {...input}>
          {label}
        </BS.Checkbox>
      );
    } else if (type === 'radio') {
      field = (
        <BS.Radio {...input}>
          {label}
        </BS.Radio>
      );
    } else {
      const componentClassByType = {
        select: 'select',
        textarea: 'textarea',
      };

      field = (
        <React.Fragment>
          {label && (
            <BS.ControlLabel>{label}</BS.ControlLabel>
          )}
          <BS.FormControl
            {...input}
            componentClass={componentClassByType[type] || 'input'}
            type={type}
            {...rest}
          >
            {children}
          </BS.FormControl>
          <BS.FormControl.Feedback />
          {/* <pre>{JSON.stringify(meta, null, 2)}</pre> */}
        </React.Fragment>
      );
    }

    return (
      <BS.FormGroup
        controlId={input.id || input.name}
        validationState={(meta.touched && meta.error) ? 'error' : null}
      >
        {field}
        <BS.HelpBlock>{helpText}</BS.HelpBlock>
        {/* meta.touched && meta.error && (
          <BS.Alert bsStyle="danger">{meta.error}</BS.Alert>
        ) */}
      </BS.FormGroup>
    );
  }
}


export const CenteredAlert = (props) => ( // eslint-disable-line react/prop-types
  <div className="CenteredAlert">
    <BS.Alert {...props} />
  </div>
);
