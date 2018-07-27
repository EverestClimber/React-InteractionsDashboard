import React from 'react';
import { Checkbox } from 'react-bootstrap';
import SmartSelector from './SmartSelector';


const ProjectSelector = (props) => (
  <SmartSelector {...props} renderItem={HCPItem} />
);

ProjectSelector.propTypes = SmartSelector.propTypes;

export default ProjectSelector;

const HCPItem = ({ multiple, item, handleSelect, selectedItems }) => ( // eslint-disable-line react/prop-types
  <div
    key={item.id}
    className="SmartSelector__ListItems__Item ProjectSelector__ListItems__Item"
    role="button"
    tabIndex={0}
    onClick={() => handleSelect(item.id)}
  >
    {multiple && (
      <div className="SmartSelector__ListItems__Item__selected ProjectSelector__ListItems__Item__selected">
        <Checkbox inline readOnly checked={!!selectedItems.get(item.id)} />
      </div>
    )}

    <div className="ProjectSelector__ListItems__Item__title">
      {item.title}
    </div>

    <div className="ProjectSelector__ListItems__Item__tas">
      {item.ta_names.join(', ')}
    </div>
  </div>
);
