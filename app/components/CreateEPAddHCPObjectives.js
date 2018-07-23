/* eslint-disable */
import React from 'react';
import {
  Grid,
  // Col,
  // Row,
  Button,
  // Panel,
} from 'react-bootstrap';

export default class CreateEPAddHCPObjectives extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedHCPId: null,
    };
  }

  render() {
    const {
      selectedHCPs,
      hcpItems,
      addHCPObjective,
      updateHCPObjective,
    } = this.props;
    // const hcp = selectedHCPs.get(this.state.selectedHCPId);

    return (
      <div className="CreateEPAddHCPObjectives">
        <h2>Step 2: HCP Objectives</h2>

        {hcpItems.map((hcpItem) => (

          <div key={hcpItem.hcp_id} className="CreateEPAddHCPObjectives__hcpItem">

            <div className="CreateEPAddHCPObjectives__hcpItem__hcp">
              {hcpItem.hcp.first_name} {hcpItem.hcp.last_name}
            </div>

            {/*<div className="CreateEPAddHCPObjectives__objectives">*/}
              {/*{hcpItem.objectives.map((objective, objectiveIdx) => (*/}
                {/*<div className="CreateEPAddHCPObjectives__objective">*/}
                  {/*<textarea*/}
                    {/*onChange={(ev) => updateHCPObjective(*/}
                      {/*objectiveIdx,*/}
                      {/*{ description: ev.target.value }*/}
                    {/*)}*/}
                  {/*/>*/}
                  {/*{objective.deliverables.map((deliverable) => (*/}
                    {/*<div className="CreateEPAddHCPObjectives__deliverable">*/}
                    {/*</div>*/}
                  {/*)).toJS()}*/}
                {/*</div>*/}
              {/*)).toJS()}*/}
            {/*</div>*/}

            {/*<Button onClick={addHCPObjective}>*/}
              {/*Add Objective*/}
            {/*</Button>*/}

          </div>

        ))}
      </div>
    );
  }
}
