import * as vscode from "vscode";

export class Fault extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    private version = "",
    public readonly url = "",
    public readonly lastOccurredAt = 0,
    public readonly firstOccurredAt = "",
    public readonly noticesInRange = 0
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.version}`;
    this.description = this.version;
    this.url = url;
    this.lastOccurredAt = lastOccurredAt;
    this.noticesInRange = noticesInRange;
  }
}
