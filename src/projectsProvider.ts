import * as path from "path";
import * as vscode from "vscode";
import { Project, SelectedProjects } from "./project";
import { getHoneybadgerProjects } from "./hb";

export class ProjectsProvider implements vscode.TreeDataProvider<Project> {
  selectedProjectsIds: string[] = [];
  allProjects: Project[] | null = null;

  constructor(private onNewProjectSelected: SelectedProjects) {
    this.onNewProjectSelected = onNewProjectSelected;
    vscode.commands.registerCommand(
      "vscode-honeybadger.onProjectToggle",
      (item) => this.onProjectClicked(item)
    );
  }

  getTreeItem(project: Project): vscode.TreeItem {
    let title = project.label ? project.label : "";
    let result = new vscode.TreeItem(title, project.collapsibleState);
    result.description = project.description;
    const projectIndex = this.selectedProjectsIds.findIndex(
      (id) => id === project.id
    );
    if (projectIndex === -1) {
      result.iconPath = this.getUnCheckedProjectIcon();
    } else {
      result.iconPath = this.getCheckedProjectIcon();
    }

    result.command = {
      command: "vscode-honeybadger.onProjectToggle",
      title: title,
      arguments: [project],
    };
    return result;
  }

  onProjectClicked(project: Project) {
    const projectId = project.id;
    const projectIndex = this.selectedProjectsIds.findIndex(
      (id) => id === projectId
    );
    if (projectIndex !== -1) {
      this.selectedProjectsIds.splice(projectIndex, 1);
    } else {
      this.selectedProjectsIds.push(projectId);
    }

    this._onDidChangeTreeData.fire();
    this.onNewProjectSelected(
      this.allProjects?.filter((project) =>
        this.selectedProjectsIds.includes(project.id)
      )
    );
  }

  getCheckedProjectIcon(): string {
    return path.join(__filename, "..", "..", "media", "checked.svg");
  }

  getUnCheckedProjectIcon(): string {
    return path.join(__filename, "..", "..", "media", "unchecked.svg");
  }

  async getChildren(element?: Project): Promise<Project[]> {
    if (this.allProjects == null) {
      try {
        const resp = await getHoneybadgerProjects();
        this.allProjects = [];
        resp.data.results.map((project: any) => {
          this.allProjects?.push(
            new Project(
              project.name,
              project.id,
              vscode.TreeItemCollapsibleState.None
            )
          );
        });
      } catch (error: any) {
        vscode.window.showErrorMessage(
          `Failed to fetch projects: ${error?.message}`
        );
      }
    }

    if (this.allProjects != null) {
      return Promise.resolve(this.allProjects);
    } else {
      return Promise.resolve([]);
    }
  }

  private _onDidChangeTreeData: vscode.EventEmitter<
    Project | undefined | null | void
  > = new vscode.EventEmitter<Project | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    Project | undefined | null | void
  > = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
