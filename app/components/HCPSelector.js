import React from 'react';
import { Checkbox } from 'react-bootstrap';
import SmartSelector from './SmartSelector';

const HCPSelector = (props) => (
  <SmartSelector
    {...props}
    placeholder={props.placeholder || 'Search HCPs ...'}
    btnLabel={props.btnLabel || 'New HCP'}
    renderItem={HCPItem}
  />
);

HCPSelector.propTypes = SmartSelector.propTypes;

export default HCPSelector;

const HCPItem = (
  { multiple, item, handleSelect, selectedItems } // eslint-disable-line react/prop-types
) => (
  <div
    key={item.id}
    className="SmartSelector__ListItems__Item HCPSelector__ListItems__Item"
    role="button"
    tabIndex={0}
    onClick={() => handleSelect(item.id)}
  >
    {multiple && (
      <div className="SmartSelector__ListItems__Item__selected HCPSelector__ListItems__Item__selected">
        <Checkbox inline readOnly checked={!!selectedItems.get(item.id)} />
      </div>
    )}

    <div
      className={`SmartSelector__ListItems__Item__consent HCPSelector__ListItems__Item__consent SmartSelector__ListItems__Item__consent--${
        item.has_consented ? 'yes' : 'no'
      }`}
    >
      <span
        className={item.has_consented ? 'icon-consent-yes' : 'icon-consent-no'}
      />
    </div>

    <div className="SmartSelector__ListItems__Item__name HCPSelector__ListItems__Item__name">
      {item.first_name} {item.last_name}
    </div>

    <div className="SmartSelector__ListItems__Item__institution HCPSelector__ListItems__Item__institution">
      {item.institution_name}
    </div>

    <div className="SmartSelector__ListItems__Item__location SmartSelector__location HCPSelector__ListItems__Item__location">
      <span className="icon-hcp-location" />
      <span className="SmartSelector__location__city">{item.city}</span>
      {', '}
      <span className="SmartSelector__location__country HCPSelector__location__country">
        {item.country}
      </span>
    </div>

    <div className="SmartSelector__ListItems__Item__tas HCPSelector__ListItems__Item__tas">
      {item.ta_names.join(', ')}
    </div>
  </div>
);
