import React, { useEffect, useState } from "react";
import { Project } from "../../project";
import ProjectList from "./ProjectList";

function App() {
  const [project, setProject] = useState<Project>();

  useEffect(() => {
    window.addEventListener("message", (e) => {
      console.log("message", e.data);
      const message = e.data;
      setProject(message);
    });
  });

  return (
    <div className="space-y-6">
      <ProjectList label={project?.label ?? ""} />
    </div>
  );
}

export default App;
