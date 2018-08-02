import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  FormControl,
  Button,
  Panel,
  Col,
  Row,
} from 'react-bootstrap';
import { EngagementPlanHCPItem } from 'records/EngagementPlan';
import { HCPDeliverable } from 'records/HCPObjective';
import { EPFormObjective } from 'components/EPFormObjective';
import { Options } from './forms';
import HCPSelector from './HCPSelector';
// import SelectedHCP from './SelectedHCP';

const makeKey = (obj, idx) => `${obj.id || ''}.${idx}`;

const EPFormAddHCPs = ({
  mode,
  currentQuarter,
  hcps,
  selectedHCPs,
  engagementPlan,
  fetchHCP,
  searchHCPs,
  selectHCPs,
  removeHCP,
  updateHCPItem,
  // objectives:
  bcsfs,
  medicalPlanObjectives,
  addHCPObjective,
  updateHCPObjective,
  removeHCPObjective,
  addHCPObjectiveDeliverable,
  updateHCPObjectiveDeliverable,
  removeHCPObjectiveDeliverable,
}) => (
  <div>
    <h2>Step 1: Add HCPs</h2>

    <HCPSelector
      items={hcps.toJS()}
      selectedItems={selectedHCPs}
      searchItems={searchHCPs}
      fetchItem={fetchHCP}
      removeItem={removeHCP}
      input={{ onChange: selectHCPs }}
      multiple
    />

    {!!engagementPlan.hcp_items.size &&
      engagementPlan.hcp_items
        .map((hcpItem) => (
          <HCPItem
            key={hcpItem.hcp_id}
            {...{
              mode,
              currentQuarter,
              hcpItem,
              // handleRemove: () =>
              //   mode === 'create' || !hcpItem.id
              //     ? selectHCPs(selectedHCPs.delete(hcpItem.hcp_id))
              //     : updateHCPItem(hcpItem.hcp_id, {
              //       removed_at: hcpItem.removed_at
              //           ? null
              //           : new Date().toISOString(),
              //     }),
              // simply remove an unsaved HCP
              remove: () => selectHCPs(selectedHCPs.delete(hcpItem.hcp_id)),
              // for saved HCP, we set it as removed and save a reason
              setRemoved: () =>
                updateHCPItem(hcpItem.hcp_id, {
                  removed_at: new Date().toISOString(),
                }),
              unsetRemoved: () =>
                updateHCPItem(hcpItem.hcp_id, { removed_at: null }),
              onReasonChange: (reason) =>
                updateHCPItem(hcpItem.hcp_id, { reason }),
              onReasonOtherChange: (reason_other) =>
                updateHCPItem(hcpItem.hcp_id, { reason_other }),
              onReasonRemovedChange: (reason_removed) =>
                updateHCPItem(hcpItem.hcp_id, { reason_removed }),
              bcsfs,
              medicalPlanObjectives,
              hcps,
              addHCPObjective,
              updateHCPObjective,
              removeHCPObjective,
              addHCPObjectiveDeliverable,
              updateHCPObjectiveDeliverable,
              removeHCPObjectiveDeliverable,
            }}
          />
        ))
        .toJS()}
  </div>
);

EPFormAddHCPs.propTypes = {
  mode: PropTypes.string,
  currentQuarter: PropTypes.number,
  hcps: PropTypes.object,
  selectedHCPs: PropTypes.object,
  engagementPlan: PropTypes.object,
  fetchHCP: PropTypes.func,
  searchHCPs: PropTypes.func,
  selectHCPs: PropTypes.func,
  removeHCP: PropTypes.func,
  updateHCPItem: PropTypes.func,
  // objectives:
  bcsfs: PropTypes.object,
  medicalPlanObjectives: PropTypes.object,
  addHCPObjective: PropTypes.func,
  updateHCPObjective: PropTypes.func,
  removeHCPObjective: PropTypes.func,
  addHCPObjectiveDeliverable: PropTypes.func,
  updateHCPObjectiveDeliverable: PropTypes.func,
  removeHCPObjectiveDeliverable: PropTypes.func,
};

export default EPFormAddHCPs;

class HCPItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 'yes', 'no', 'pending'
      removed: props.hcpItem.removed_at ? 'yes' : 'no',
    };
  }

  handleClickRemoveBtn = () => {
    if (this.state.removed === 'no') {
      if (this.props.hcpItem.id) {
        this.setState({ removed: 'pending' });
      } else {
        this.props.remove();
      }
    } else if (this.state.removed === 'pending') {
      this.setState({ removed: 'no' });
    } else if (this.state.removed === 'yes') {
      this.props.unsetRemoved();
      this.setState({ removed: 'no' });
    }
  };

  handleClickCommitRemove = () => {
    this.props.setRemoved();
    this.setState({ removed: 'yes' });
  };

  render() {
    const {
      mode,
      currentQuarter,
      hcpItem,
      // remove,
      // setRemoved,
      // unsetRemoved,
      onReasonChange,
      onReasonOtherChange,
      onReasonRemovedChange,
      // objectives
      bcsfs,
      medicalPlanObjectives,
      hcps,
      addHCPObjective,
      updateHCPObjective,
      removeHCPObjective,
      addHCPObjectiveDeliverable,
      updateHCPObjectiveDeliverable,
      removeHCPObjectiveDeliverable,
    } = this.props;

    return (
      <Panel className="HCPItem">
        <Panel.Heading>
          <Button className="pull-right" onClick={this.handleClickRemoveBtn}>
            {
              { no: 'REMOVE', pending: 'CANCEL REMOVE', yes: 'UNDO REMOVE' }[
                this.state.removed
              ]
            }
          </Button>
          <p
            style={
              hcpItem.removed_at && {
                textDecoration: 'line-through',
                color: 'red',
              }
            }
          >
            {hcpItem.hcp.first_name} {hcpItem.hcp.last_name}
          </p>
        </Panel.Heading>
        <Panel.Body>
          {this.state.removed === 'pending' && (
            <FormGroup>
              <FormControl
                componentClass="textarea"
                placeholder="Removal reason"
                value={hcpItem.reason_removed}
                onChange={(ev) => onReasonRemovedChange(ev.target.value)}
              />
              <Button onClick={this.handleClickCommitRemove}>REMOVE</Button>
              <hr />
            </FormGroup>
          )}
          <br />
          {mode === 'create' || !hcpItem.id ? (
            <p>
              <FormControl
                componentClass="select"
                value={hcpItem.reason}
                onChange={(ev) => onReasonChange(ev.target.value)}
              >
                <option disabled value="">
                  Select reason for adding HCP to the plan
                </option>
                <Options
                  choices={Object.entries(EngagementPlanHCPItem.reason_choices)}
                />
              </FormControl>
              {hcpItem.reason === 'other' && (
                <FormControl
                  componentClass="textarea"
                  placeholder="Other reason"
                  value={hcpItem.reason_other}
                  onChange={(ev) => onReasonOtherChange(ev.target.value)}
                />
              )}
            </p>
          ) : (
            <p>
              <strong>
                Reason{hcpItem.reason === 'other' ? ' (other)' : ''}:
              </strong>{' '}
              {hcpItem.reason === 'other'
                ? hcpItem.reasonOther
                : hcpItem.reason}
            </p>
          )}

          <br />
          {hcpItem.objectives.map((objective, objectiveIdx) => (
            <EPFormObjective
              key={makeKey(objective, objectiveIdx)}
              {...{
                mode,
                currentQuarter,
                itemObjectId: hcpItem.hcp_id,
                objective,
                objectiveIdx,
                updateObjective: updateHCPObjective,
                removeObjective: removeHCPObjective,
                addDeliverable: addHCPObjectiveDeliverable,
                updateDeliverable: updateHCPObjectiveDeliverable,
                removeDeliverable: removeHCPObjectiveDeliverable,
                deliverableStatusChoices: HCPDeliverable.status_choices,
              }}
            >
              <Row>
                <br />
              </Row>
              <Row>
                <Col sm={4}>
                  <FormControl
                    componentClass="select"
                    value={objective.medical_plan_objective_id || ''}
                    onChange={(ev) =>
                      updateHCPObjective(hcpItem.hcp_id, objectiveIdx, {
                        medical_plan_objective_id: +ev.target.value || '',
                      })
                    }
                    disabled={mode === 'update' && objective.id}
                  >
                    <option value="">- Medical Plan Objective -</option>
                    <Options
                      choices={Array.from(medicalPlanObjectives.values()).map(
                        (it) => [it.id, it.name]
                      )}
                    />
                  </FormControl>
                </Col>
                <Col sm={4}>
                  <FormControl
                    componentClass="select"
                    value={objective.hcp_id || ''}
                    onChange={(ev) =>
                      updateHCPObjective(hcpItem.hcp_id, objectiveIdx, {
                        hcp_id: +ev.target.value || '',
                      })
                    }
                    disabled={mode === 'update' && objective.id}
                  >
                    <option value="">- HCP -</option>
                    <Options
                      choices={Array.from(hcps.values()).map((it) => [
                        it.id,
                        it.title,
                      ])}
                    />
                  </FormControl>
                </Col>
                <Col sm={4}>
                  <FormControl
                    componentClass="select"
                    value={objective.bcsf_id || ''}
                    onChange={(ev) =>
                      updateHCPObjective(hcpItem.hcp_id, objectiveIdx, {
                        bcsf_id: +ev.target.value || '',
                      })
                    }
                    disabled={mode === 'update' && objective.id}
                  >
                    <option value={null}>- Critical Success Factor -</option>
                    <Options
                      choices={Array.from(bcsfs.values()).map((it) => [
                        it.id,
                        it.name,
                      ])}
                    />
                  </FormControl>
                </Col>
              </Row>
            </EPFormObjective>
          ))}

          {(mode === 'create' || !hcpItem.id) && (
            <Row className="text-center">
              <Button onClick={() => addHCPObjective(hcpItem.hcp_id)}>
                Add Objective
              </Button>
            </Row>
          )}
        </Panel.Body>
      </Panel>
    );
  }
}

// const HCPObjective = ({
//   mode,
//   currentQuarter,
//   hcpItem,
//   objective,
//   objectiveIdx,
//   bcsfs,
//   medicalPlanObjectives,
//   HCPs,
//   updateHCPObjective,
//   removeHCPObjective,
//   addHCPObjectiveDeliverable,
//   updateHCPObjectiveDeliverable,
//   removeHCPObjectiveDeliverable,
// }) => (
//   <Row>
//     <Col xs={10} xsOffset={1}>
//       <Panel className="CreateEPAddHCPObjectives__objectives">
//         <Panel.Heading>
//           {(mode === 'create' || !objective.id) && (
//             <Button
//               className="pull-right"
//               onClick={() => removeHCPObjective(hcpItem.hcp_id, objectiveIdx)}
//             >
//               ✖
//             </Button>
//           )}
//           Objective
//         </Panel.Heading>
//         <Panel.Body>
//           <br />
//           <div className="CreateEPAddHCPObjectives__objective">
//             {mode === 'create' || !objective.id ? (
//               <FormControl
//                 componentClass="textarea"
//                 placeholder="Objective Description"
//                 value={objective.description}
//                 onChange={(ev) =>
//                   updateHCPObjective(hcpItem.hcp_id, objectiveIdx, {
//                     description: ev.target.value,
//                   })
//                 }
//               />
//             ) : (
//               <p>{objective.description}</p>
//             )}
//             <br />
//             <h5>
//               <strong>Deliverables</strong>
//             </h5>
//             {objective.deliverables
//               .map((deliverable, deliverableIdx) => (
//                 <div
//                   key={makeKey(deliverable, deliverableIdx)}
//                   className="CreateEPAddHCPObjectives__deliverable"
//                 >
//                   <FormGroup>
//                     <Row>
//                       <Col xs={1}>
//                         <FormControl
//                           componentClass="select"
//                           value={deliverable.quarter}
//                           onChange={(ev) =>
//                             updateHCPObjectiveDeliverable(
//                               hcpItem.hcp_id,
//                               objectiveIdx,
//                               deliverableIdx,
//                               { quarter: +ev.target.value }
//                             )
//                           }
//                           disabled={mode === 'update' && objective.id}
//                         >
//                           <option value={1} disabled={currentQuarter > 1}>
//                             1
//                           </option>
//                           <option value={2} disabled={currentQuarter > 2}>
//                             2
//                           </option>
//                           <option value={3} disabled={currentQuarter > 3}>
//                             3
//                           </option>
//                           <option value={4}>4</option>
//                         </FormControl>
//                       </Col>
//                       <Col xs={8}>
//                         <FormControl
//                           type="text"
//                           placeholder="Deliverable description"
//                           value={deliverable.description}
//                           onChange={(ev) =>
//                             updateHCPObjectiveDeliverable(
//                               hcpItem.hcp_id,
//                               objectiveIdx,
//                               deliverableIdx,
//                               { description: ev.target.value }
//                             )
//                           }
//                           disabled={deliverable.quarter_type === 'past'}
//                         />
//                       </Col>
//                       <Col xs={2}>
//                         <FormControl
//                           componentClass="select"
//                           value={deliverable.status}
//                           onChange={(ev) =>
//                             updateHCPObjectiveDeliverable(
//                               hcpItem.hcp_id,
//                               objectiveIdx,
//                               deliverableIdx,
//                               { status: ev.target.value }
//                             )
//                           }
//                           disabled={deliverable.quarter_type === 'past'}
//                         >
//                           <option value="">- Pick Status -</option>
//                           <Options
//                             choices={Object.entries(
//                               HCPDeliverable.status_choices
//                             )}
//                           />
//                         </FormControl>
//                       </Col>
//                       <Col xs={1}>
//                         {(mode === 'create' || !objective.id) && (
//                           <Button
//                             onClick={() =>
//                               removeHCPObjectiveDeliverable(
//                                 hcpItem.hcp_id,
//                                 objectiveIdx,
//                                 deliverableIdx
//                               )
//                             }
//                           >
//                             ✖
//                           </Button>
//                         )}
//                       </Col>
//                     </Row>
//                   </FormGroup>
//                 </div>
//               ))
//               .toJS()}
//             {(mode === 'create' || !objective.id) && (
//               <Row className="text-center">
//                 <Button
//                   onClick={() =>
//                     addHCPObjectiveDeliverable(hcpItem.hcp_id, objectiveIdx)
//                   }
//                 >
//                   Add Deliverable
//                 </Button>
//               </Row>
//             )}
//             <br />
//             <Row>
//               <Col sm={4}>
//                 <FormControl
//                   componentClass="select"
//                   value={objective.medical_plan_objective_id || ''}
//                   onChange={(ev) =>
//                     updateHCPObjective(hcpItem.hcp_id, objectiveIdx, {
//                       medical_plan_objective_id: +ev.target.value || '',
//                     })
//                   }
//                   disabled={mode === 'update' && objective.id}
//                 >
//                   <option value="">- Medical Plan Objective -</option>
//                   <Options
//                     choices={Array.from(medicalPlanObjectives.values()).map(
//                       (it) => [it.id, it.name]
//                     )}
//                   />
//                 </FormControl>
//               </Col>
//               <Col sm={4}>
//                 <FormControl
//                   componentClass="select"
//                   value={objective.HCP_id || ''}
//                   onChange={(ev) =>
//                     updateHCPObjective(hcpItem.hcp_id, objectiveIdx, {
//                       HCP_id: +ev.target.value || '',
//                     })
//                   }
//                   disabled={mode === 'update' && objective.id}
//                 >
//                   <option value="">- HCP -</option>
//                   <Options
//                     choices={Array.from(HCPs.values()).map((it) => [
//                       it.id,
//                       it.title,
//                     ])}
//                   />
//                 </FormControl>
//               </Col>
//               <Col sm={4}>
//                 <FormControl
//                   componentClass="select"
//                   value={objective.bcsf_id || ''}
//                   onChange={(ev) =>
//                     updateHCPObjective(hcpItem.hcp_id, objectiveIdx, {
//                       bcsf_id: +ev.target.value || '',
//                     })
//                   }
//                   disabled={mode === 'update' && objective.id}
//                 >
//                   <option value={null}>- Critical Success Factor -</option>
//                   <Options
//                     choices={Array.from(bcsfs.values()).map((it) => [
//                       it.id,
//                       it.name,
//                     ])}
//                   />
//                 </FormControl>
//               </Col>
//             </Row>
//           </div>
//         </Panel.Body>
//       </Panel>
//     </Col>
//   </Row>
// );
