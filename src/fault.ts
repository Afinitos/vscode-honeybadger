import * as vscode from "vscode";

export class Fault extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly url: string | null,
    public readonly lastOccurredAt: number,
    public readonly noticesInRange: number
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.version}`;
    this.description = this.version;
    this.url = url;
    this.lastOccurredAt = lastOccurredAt;
    this.noticesInRange = noticesInRange;
  }
}
