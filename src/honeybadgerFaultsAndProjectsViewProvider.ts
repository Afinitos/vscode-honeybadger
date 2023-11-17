import * as vscode from "vscode";
import { HoneybadgerConfig } from "./honeybadgerConfig";
import { FaultsProvider } from "./faultsProvider";
import { ProjectsProvider } from "./projectsProvider";
import { Project, SelectedProjects } from "./project";
import * as path from "path";
import { getHoneybadgerProjects } from "./hb";

export class HoneybadgerFaultsAndProjectsViewProvider
  implements vscode.WebviewViewProvider
{
  public honeybadgerView?: vscode.WebviewView;

  constructor(private readonly extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken
  ) {
    console.log("resolveWebviewView");
    this.honeybadgerView = webviewView;
    this.honeybadgerView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    // console.log("this.honeybadgerView", this.honeybadgerView);

    new HoneybadgerConfig(context).setHtmlForWebview(
      this.honeybadgerView.webview,
      this.extensionUri
    );

    console.log("this.honeybadgerView", this.honeybadgerView);

    this.honeybadgerView.webview.onDidReceiveMessage((data) => {
      console.log("listener");
      this.fetchFaultsAndProjects(data);
    });
  }

  public fetchFaultsAndProjects(data?: any) {
    console.log("data");
    // new FaultsProvider();
    // new ProjectsProvider(data);
  }
}
