import React from 'react';
import * as classNames from 'classnames';
import Comment from 'components/Comment';
import { ControlLabel, FormGroup, FormControl, Panel } from 'react-bootstrap';

export class EPFormPlanItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      removed: !!props.planItem.removed_at,
      collapsed: props.mode === 'view' || false,
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

  handleClickCollapseBtn = () =>
    this.setState((prevState) => ({
      collapsed: !prevState.collapsed,
    }));

  render() {
    const {
      mode,
      planItem,
      title,
      onReasonRemovedChange,
      className,
      children,
      fieldPrefix,
      fieldsTouched,
      fieldsErrors,
      showAllStepErrors,
    } = this.props;

    const baseClassName = 'EPForm__PlanItem';

    return (
      <Panel
        className={classNames({
          [baseClassName]: true,
          [className]: true,
          [`${baseClassName}--removed`]: this.state.removed,
        })}
      >
        <Panel.Heading className={`${baseClassName}__heading`}>
          <div className={`${baseClassName}__title`}>{title}</div>
          {mode !== 'view' && (
            <div
              className={classNames({
                [`${baseClassName}__removeBtn`]: true,
                'icon-delete': !this.state.removed,
                'icon-revert': this.state.removed,
              })}
              role="button"
              tabIndex={0}
              onClick={this.handleClickRemoveBtn}
            />
          )}
        </Panel.Heading>
        <Panel.Body
          className={classNames({
            [`${baseClassName}__body`]: true,
            [`${baseClassName}__body--collapsed`]: this.state.collapsed,
          })}
        >
          {planItem.comments.map((comment) => (
            <Comment comment={comment} key={comment.id} />
          ))}
          {this.state.collapsed || (
            <div className={`${baseClassName}__body__content`}>
              {this.state.removed &&
                mode !== 'view' && (
                  <FormGroup
                    validationState={
                      (fieldsTouched.get(`${fieldPrefix}.reason_removed`) ||
                        showAllStepErrors) &&
                      fieldsErrors.get(`${fieldPrefix}.reason_removed`)
                        ? 'error'
                        : null
                    }
                  >
                    <br />
                    <FormControl
                      componentClass="input"
                      placeholder="Enter Reason for Removing..."
                      value={planItem.reason_removed}
                      onChange={(ev) => onReasonRemovedChange(ev.target.value)}
                    />
                    <hr />
                  </FormGroup>
                )}
              {this.state.removed &&
                mode === 'view' && (
                  <FormGroup>
                    <br />
                    <ControlLabel>REASON REMOVED</ControlLabel>
                    <p>{planItem.reason_removed}</p>
                  </FormGroup>
                )}
              <br />
              {children}
            </div>
          )}
          <div
            className={classNames({
              [`${baseClassName}__collapseBtn`]: true,
              'icon-section-expand': this.state.collapsed,
              'icon-section-collapse': !this.state.collapsed,
            })}
            onClick={this.handleClickCollapseBtn}
            role="button"
            tabIndex={0}
          />
        </Panel.Body>
      </Panel>
    );
  }
}
