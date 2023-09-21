import * as moment from "moment";
import * as vscode from "vscode";
import { Fault } from "./fault";
import { getDates, formatElapsedTimeFromDate } from "./utils";
import {
  HoneybadgerFault,
  getHoneybadgerFaults,
  getNextHoneybadgerFaults,
} from "./hb";
import { Project } from "./project";

export class FaultsProvider implements vscode.TreeDataProvider<Fault> {
  selectedProjects: Project[] = [];

  constructor() {
    vscode.commands.registerCommand(
      "vscode-honeybadger.onFaultClicked",
      (item) => this.onFaultClicked(item)
    );
  }

  getTreeItem(element: Fault): vscode.TreeItem {
    let title = element.label ? element.label.toString() : "";
    let result = new vscode.TreeItem(title, element.collapsibleState);
    result.description = element.description;
    result.command = {
      command: "vscode-honeybadger.onFaultClicked",
      title: title,
      arguments: [element],
    };
    return result;
  }

  public onFaultClicked(fault: Fault) {
    if (fault?.url == null) return;

    vscode.env.openExternal(vscode.Uri.parse(fault.url));
  }

  async getChildren(element?: Fault): Promise<Fault[]> {
    if (this.selectedProjects.length === 0) {
      return Promise.resolve([]);
    }

    const shownDates = getDates(7);

    if (element) {
      // if children for selected day need to be displayed
      const selectedDate = element.label;
      const ix = shownDates.findIndex((date) => date === selectedDate);

      const startTimeStamp = moment(element.label).unix();
      const endTimeStamp =
        ix === 0 ? moment().unix() : moment(shownDates[ix - 1]).unix();
      const faults: Fault[] = [];

      for (const project of this.selectedProjects) {
        const resp = await getHoneybadgerFaults(
          project.id,
          startTimeStamp,
          endTimeStamp
        );
        resp.data.results.map((fault: HoneybadgerFault) =>
          faults.push(this.createFault(fault, project))
        );

        let nextUrl = resp.data.links.next;
        while (nextUrl) {
          const resp = await getNextHoneybadgerFaults(nextUrl);
          resp.data.results.map((fault: HoneybadgerFault) =>
            faults.push(this.createFault(fault, project))
          );
          nextUrl = resp.data.links.get;
        }
      }
      return Promise.resolve(
        faults.sort((a, b) => b.noticesInRange - a.noticesInRange)
      );
    } else {
      // if children for root need to be displayed, create child for each day
      return Promise.resolve(
        shownDates.map(
          (date) =>
            new Fault(
              date,
              "",
              vscode.TreeItemCollapsibleState.Collapsed,
              null,
              0,
              "",
              0
            )
        )
      );
    }
  }

  private createFault = (fault: HoneybadgerFault, project: Project): Fault => {
    const errorOccurences = `${fault.notices_count_in_range} ` +
                            `${fault.notices_count_in_range > 1 ? 'occurrences' : 'occurence'}`;
    const relativeTime = `first ${formatElapsedTimeFromDate(fault.created_at)}`;
    const faultName = `${fault.klass} (${errorOccurences} ${relativeTime})`;
    const faultMessage = 
      this.selectedProjects.length > 1
        ? `(${project.label}) / ${fault.message}`
        : fault.message;
    return new Fault(
      faultName,
      faultMessage,
      vscode.TreeItemCollapsibleState.None,
      fault.url,
      new Date(fault.last_notice_at).getTime(),
      `${formatElapsedTimeFromDate(fault.created_at)}`,
      fault.notices_count_in_range
    );
  };

  private _onDidChangeTreeData: vscode.EventEmitter<
    Fault | undefined | null | void
  > = new vscode.EventEmitter<Fault | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<Fault | undefined | null | void> =
    this._onDidChangeTreeData.event;

  /**
   * Handles refresh commands.
   * It refreshes root's children (list of days) and every open child (child).
   */
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  setProjects(projects: Project[] | undefined): void {
    if (!projects) {
      this.selectedProjects = [];
    } else {
      this.selectedProjects = projects;
    }
    this.refresh();
  }
}
