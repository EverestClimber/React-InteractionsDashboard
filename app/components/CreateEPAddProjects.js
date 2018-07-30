import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Panel,
} from 'react-bootstrap';
import ProjectSelector from './ProjectSelector';


const CreateEPAddProjects = ({
  projects,
  selectedProjects,
  projectItems,
  fetchProject,
  searchProjects,
  selectProjects,
  removeProject,
}) => (
  <div>
    <h2>Step 3: Add Projects</h2>

    <ProjectSelector
      items={projects.toJS()}
      selectedItems={selectedProjects}
      searchItems={searchProjects}
      fetchItem={fetchProject}
      removeItem={removeProject}
      input={{ onChange: selectProjects }}
      multiple
    />

    {!!projectItems.size && Array.from(projectItems.values()).map((projectItem) => (
      <SelectedProject
        key={projectItem.project_id}
        project={projectItem.project}
        handleRemove={() => selectProjects(selectedProjects.delete(projectItem.project_id))}
      />
    ))}
  </div>
);

CreateEPAddProjects.propTypes = {
  projects: PropTypes.object,
  selectedProjects: PropTypes.object,
  projectItems: PropTypes.object,
  fetchProject: PropTypes.func,
  searchProjects: PropTypes.func,
  selectProjects: PropTypes.func,
  removeProject: PropTypes.func,
};

export default CreateEPAddProjects;


const SelectedProject = ({ project, handleRemove }) => ( // eslint-disable-line react/prop-types
  <Panel className="SelectedProject">
    <Panel.Heading>
      <Button className="pull-right" onClick={handleRemove}>
        ✖
      </Button>
      <p>{project.title}</p>
      <br />
    </Panel.Heading>
  </Panel>
);