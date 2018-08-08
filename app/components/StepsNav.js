import React from 'react';

const StepsNav = ({ steps, step, gotoStep }) => (
  <div className="StepsNav">
    <div className="StepsNav__steps">
      {steps.map((stepLabel, stepIdx) => (
        <div
          key={`${stepLabel}`}
          className={`StepsNav__step ${
            step === stepIdx ? 'StepsNav__step--active' : ''
          } ${stepIdx > step ? 'StepsNav__step--inactive' : ''}`}
          onClick={() => gotoStep(stepIdx)}
          alt={stepLabel}
          role="button"
          tabIndex={stepIdx}
        >
          {stepIdx + 1}
          <div className="StepsNav__step__label">{stepLabel}</div>
        </div>
      ))}
    </div>
  </div>
);

export default StepsNav;
