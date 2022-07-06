import * as vscode from 'vscode';

export async function link(){
   let editor = vscode.window.activeTextEditor;
   if (!editor) {
      return; // No open text editor
   }

   const address = await vscode.window.showInputBox({
      prompt: 'Enter a URL',
      value: '',
      valueSelection: [0, 0]
   });

   if (!address) {
      return;
   }

   return editor.insertSnippet(
      new vscode.SnippetString(`[$TM_SELECTED_TEXT](${address})`)
   );
}