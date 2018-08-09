import React from 'react';
import { Badge } from 'react-bootstrap';
import { EPHCPItem } from 'components/EPFormHCPs';
import { EPProjectItem } from 'components/EPFormProjects';

const EPFormReview = ({
  currentQuarter,
  engagementPlan,
  medicalPlanObjectives,
  projects,
  bcsfs,
  fieldsTouched,
}) => (
  <div className="EPFormReview EPForm__step">
    <h2 className="EPForm__step__title">
      My HCPs <Badge>{engagementPlan.hcp_items.size}</Badge>
    </h2>

    {engagementPlan.hcp_items.map((hcpItem, hcpItemIdx) => (
      <EPHCPItem
        key={hcpItem.hcp_id}
        {...{
          mode: 'view',
          currentQuarter,
          hcpItem,
          hcpItemIdx,
          medicalPlanObjectives,
          projects,
          bcsfs,
          fieldsTouched: fieldsTouched.get('0'),
        }}
      />
    ))}

    <h2 className="EPForm__step__title">
      My Projects <Badge>{engagementPlan.project_items.size}</Badge>
    </h2>

    {engagementPlan.project_items.map((projectItem, projectItemIdx) => (
      <EPProjectItem
        key={projectItem.project_id}
        {...{
          mode: 'view',
          currentQuarter,
          projectItem,
          projectItemIdx,
          medicalPlanObjectives,
          projects,
          bcsfs,
          fieldsTouched: fieldsTouched.get('1'),
        }}
      />
    ))}
  </div>
);

export default EPFormReview;
