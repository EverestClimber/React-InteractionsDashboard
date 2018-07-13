import React from 'react';
import * as BS from 'react-bootstrap';
// import PropTypes from 'prop-types';


export const IconButton = ({ icon, label, className, ...rest }) => ( // eslint-disable-line react/prop-types
  <BS.Button className={`IconButton ${className}`} {...rest}>
    {icon && (<span className={`IconButton__icon ${icon}`} />)}
    {label && (
      <div className="IconButton__label">
        {label}
      </div>
    )}
  </BS.Button>
);
