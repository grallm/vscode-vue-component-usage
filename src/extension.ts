import * as path from 'path'
import * as vscode from 'vscode'
import * as fs from 'fs'

const firstLetterUppercase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.findVueComponentUsage', async () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return

    const filePath = editor.document.fileName;
    if (!filePath.endsWith('.vue')) return;

    let componentName = firstLetterUppercase(path.basename(filePath, '.vue'));

    // If Nuxt.js project, add path to component name
    const workspacePath = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(filePath))?.uri.path;
    if (workspacePath && fs.existsSync(`${workspacePath}/nuxt.config.ts`)) {
      const path = filePath.split('/');

      const componentsIndex = path.indexOf('components');
      path.splice(0, componentsIndex + 1);
      path.pop();

      componentName = `${firstLetterUppercase(path.join(''))}${componentName}`;
    }

    // Trigger the "Find in Files" functionality
    vscode.commands.executeCommand('workbench.action.findInFiles', {
      query: `<${componentName}`,
      triggerSearch: true,
      isCaseSensitive: true,
      matchWholeWord: false,
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
