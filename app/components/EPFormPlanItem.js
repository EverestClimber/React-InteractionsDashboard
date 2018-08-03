import React from 'react';
import { FormGroup, FormControl, Button, Panel } from 'react-bootstrap';

export class EPFormPlanItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      removed: !!props.planItem.removed_at,
    };
  }

  handleClickRemoveBtn = () => {
    if (!this.state.removed) {
      if (this.props.planItem.id) {
        this.props.setRemoved();
        this.setState({ removed: true });
      } else {
        this.props.remove();
      }
    } else {
      this.setState({ removed: false });
      this.props.unsetRemoved();
    }
  };

  render() {
    const { planItem, title, onReasonRemovedChange, children } = this.props;
    return (
      <Panel className="SelectedProject">
        <Panel.Heading>
          <Button className="pull-right" onClick={this.handleClickRemoveBtn}>
            {this.state.removed ? 'UNDO REMOVE' : 'REMOVE'}
          </Button>
          <p
            style={
              planItem.removed_at && {
                textDecoration: 'line-through',
                color: 'red',
              }
            }
          >
            {title}
          </p>
        </Panel.Heading>
        <Panel.Body>
          {this.state.removed && (
            <FormGroup>
              <FormControl
                componentClass="textarea"
                placeholder="Removal reason"
                value={planItem.reason_removed}
                onChange={(ev) => onReasonRemovedChange(ev.target.value)}
              />
              <hr />
            </FormGroup>
          )}
          <br />
          {children}
        </Panel.Body>
      </Panel>
    );
  }
}
