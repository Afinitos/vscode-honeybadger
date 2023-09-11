import * as vscode from "vscode";

export class Project extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly id: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = this.label;
    this.description = "";
    this.id = id + "";
  }
}

export interface SelectedProjects {
  (selectedProjectIds: Project[] | undefined): void;
}
