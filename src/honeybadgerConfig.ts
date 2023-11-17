import * as vscode from "vscode";

import { getNonce } from "./lib";

export class HoneybadgerConfig {
  constructor(private readonly context: vscode.WebviewViewResolveContext) {}

  /**
   * Get the static html used for the editor webviews.
   */
  public setHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri) {
    // Local path to script and css for the webview
    console.log("honeybadger config");
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "out/webviews/index.js")
    );

    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "out/webviews/index.css")
    );

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();
    console.log("workspace", vscode);

    const workspaceRootUri = vscode.workspace?.workspaceFolders?.[0].uri;
    if (!workspaceRootUri) {
      throw new Error("No workspace open");
    }

    console.log("workspaceRootUri", workspaceRootUri);

    webview.html = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
				Use a content security policy to only allow loading images from https or from our extension directory,
				and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} 'self' data:; style-src ${webview.cspSource}; script-src 'nonce-${nonce}'; font-src ${webview.cspSource};">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">


				<link href="${styleVSCodeUri}" rel="stylesheet" />
        <script nonce="${nonce}">
          window.acquireVsCodeApi = acquireVsCodeApi;
        </script>

				<title>Unsizify</title>
			</head>
			<body>
				<div id="root"></div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}
