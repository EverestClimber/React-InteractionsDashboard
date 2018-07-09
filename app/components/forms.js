import React from 'react';
import { Field } from 'redux-form/immutable';
import * as BS from 'react-bootstrap';
import PropTypes from 'prop-types';


export const FormControl = ({ input, type, ...rest }) => { // eslint-disable-line react/prop-types
  const componentClassByType = {
    select: 'select', textarea: 'textarea',
  };
  // react-bootstrap's FormControl expects empty value for multiple select
  // to be [] not undefined
  // if (type === 'select' && rest.multiple && !rest.value) {
  //   rest.value = [];  // eslint-disable-line
  // }
  return (
    <BS.FormControl
      {...input}
      componentClass={componentClassByType[type] || 'input'}
      {...rest}
    />
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


export class LabeledField extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
    label: PropTypes.string,
    options: PropTypes.array,
    helpText: PropTypes.string,
    validationState: PropTypes.string,
  }

  render() {
    const {
      name,
      id,
      type,
      label,
      options,
      helpText,
      validationState,
      ...rest
    } = this.props;

    let field;
    if (type === 'checkbox') {
      field = (
        <Field name={name} component={Checkbox} {...rest}>
          {label}
        </Field>
      );
    } else if (type === 'radio') {
      field = (
        <Field name={name} component={Radio} {...rest}>
          {label}
        </Field>
      );
    } else {
      let fieldChildren = null;
      if (type === 'select' && options.length) {
        fieldChildren = options.map(([val, text]) => (
          <option key={val} value={val}>
            {text}
          </option>
        ));
      }

      field = (
        <React.Fragment>
          <BS.ControlLabel>{label}</BS.ControlLabel>
          <Field
            name={name}
            type={type}
            component={FormControl}
            {...rest}
          >
            {fieldChildren}
          </Field>
          <BS.FormControl.Feedback />
        </React.Fragment>
      );
    }

    return (
      <BS.FormGroup controlId={id || name} validationState={validationState}>
        {field}
        <BS.HelpBlock>{helpText}</BS.HelpBlock>
      </BS.FormGroup>
    );
  }
}
