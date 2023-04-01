import * as path from 'path'
import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.findVueComponentUsage', async () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return

    const filePath = editor.document.fileName;
    if (!filePath.endsWith('.vue')) return;

    const componentName = path.basename(filePath, '.vue');

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
