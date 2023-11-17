// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { FaultsProvider } from "./faultsProvider";
import { ProjectsProvider } from "./projectsProvider";
import { getApiKey } from "./utils";
import { Project } from "./project";
import { HoneybadgerFaultsAndProjectsViewProvider } from "./honeybadgerFaultsAndProjectsViewProvider";

let faultsProvider: FaultsProvider;
let projectsProvider: ProjectsProvider;
let honeybadgerFaultsAndProjectsViewProvider: HoneybadgerFaultsAndProjectsViewProvider;

const onNewProjectSelected = (selectedProjects: Project[] | undefined) => {
  if (faultsProvider == null) return;

  faultsProvider.setProjects(selectedProjects);
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export const activate = (context: vscode.ExtensionContext) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    vscode.window.showWarningMessage("Honeybadger API key isn't set");
    return;
  }

  faultsProvider = new FaultsProvider();
  projectsProvider = new ProjectsProvider(onNewProjectSelected);
  honeybadgerFaultsAndProjectsViewProvider =
    new HoneybadgerFaultsAndProjectsViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "hbProjects",
      honeybadgerFaultsAndProjectsViewProvider
    )
  );

  console.log(honeybadgerFaultsAndProjectsViewProvider);

  vscode.window.registerTreeDataProvider("hbProjects", projectsProvider);
  vscode.window.registerTreeDataProvider("vscode-honeybadger", faultsProvider);

  vscode.commands.registerCommand("vscode-honeybadger.refreshEntry", () =>
    faultsProvider.refresh()
  );

  vscode.commands.registerCommand("hbProjects.refreshEntry", () =>
    projectsProvider.refresh()
  );
};

// This method is called when your extension is deactivated
export function deactivate() {}
