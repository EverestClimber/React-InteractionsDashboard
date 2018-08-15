import React from 'react';
import { Panel } from 'react-bootstrap';

const SelectedHCP = (
  { hcp, handleRemove, children } // eslint-disable-line react/prop-types
) => (
  <Panel
    className={`SelectedHCP SelectedHCP--${
      hcp.has_consented ? 'consentYes' : 'consentNo'
    }`}
  >
    <Panel.Body>
      <div className="SelectedHCP__heading">
        <span className="SelectedHCP__name">
          Dr. {hcp.first_name} {hcp.last_name}
        </span>

        <span
          className={`SelectedHCP__consent SelectedHCP__consent--${
            hcp.has_consented ? 'yes' : 'no'
          }`}
        >
          <span
            className={
              hcp.has_consented ? 'icon-consent-yes' : 'icon-consent-no'
            }
          />
          <span className="SelectedHCP__consent__label">
            {hcp.has_consented ? '' : 'NO CONSENT'}
          </span>
        </span>

        <div className="SelectedHCP__details pull-right">
          <div className="SelectedHCP__location location">
            <span className="icon-hcp-location" />
            <span className="SelectedHCP__location__city">{hcp.city}</span>
            {', '}
            <span className="SelectedHCP__location__country">
              {hcp.country}
            </span>
          </div>
          <div className="SelectedHCP__institution_name">
            <span className="icon-hcp-hospital" /> {hcp.institution_name}
          </div>
        </div>

        <div
          className="SelectedHCP__remove icon-delete"
          role="button"
          tabIndex={0}
          onClick={() => handleRemove(hcp.id)}
        />
      </div>

      <div className="SelectedHCP__tas">{hcp.ta_names.join(', ')}</div>

      {children && <div className="SelectedHCP__children">{children}</div>}
    </Panel.Body>
  </Panel>
);

export default SelectedHCP;
