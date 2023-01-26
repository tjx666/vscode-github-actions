import * as vscode from "vscode";
import {VariableCommandArgs} from "../../treeViews/settings/variableNode";

export function registerDeleteVariable(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("github-actions.settings.variable.delete", async (args: VariableCommandArgs) => {
      const {gitHubRepoContext, variable, environment} = args;

      try {
        if (environment) {
          await gitHubRepoContext.client.request(
            `DELETE /repositories/${gitHubRepoContext.id}/environments/${environment.name}/variables/${variable.name}`
          );
        } else {
          await gitHubRepoContext.client.actions.deleteRepoVariable({
            owner: gitHubRepoContext.owner,
            repo: gitHubRepoContext.name,
            name: variable.name
          });
        }
      } catch (e) {
        await vscode.window.showErrorMessage((e as Error).message);
      }

      await vscode.commands.executeCommand("github-actions.explorer.refresh");
    })
  );
}
