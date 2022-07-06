import * as vscode from 'vscode';

import { styleByWrapping } from '../styleByWrapping';

export function code() {
   return styleByWrapping('`', '`');
}

export function codeBlock() {
   let editor = vscode.window.activeTextEditor;
   if (!editor) {
      return; // No open text editor
   }
   return editor.insertSnippet(
      new vscode.SnippetString('```$1\n$TM_SELECTED_TEXT$0\n```')
   );
}
