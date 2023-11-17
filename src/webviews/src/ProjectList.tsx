import React, { FunctionComponent } from "react";
import { Project } from "../../project";

interface ProjectLabel {
  label: string;
}
const ProjectList: FunctionComponent<ProjectLabel> = (props) => {
  const { label } = props;
  return <div className="text-size-8">{label}</div>;
};

export default ProjectList;
