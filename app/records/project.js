import { Record, List } from 'immutable';

const Project = Record({
  id: undefined,
  title: '',
  tas: new List(),
  affiliate_groups: new List(),
  created_at: null,
  updated_at: null,
});

// Project.fromApiObject = (obj) => {
  // let project = new Project(obj);

  // project = project.merge({
  //   tas: new List(project.get('tas').map(
  //     (ta) => new Map(ta)
  //   )),
  //   affiliate_groups: new List(project.get('affiliate_groups').map(
  //     (group) => new Map(group)
  //   )),
  // });

  // return project;
// };

Project.fromApiObject = (obj) => new Project(obj);

export default Project;
