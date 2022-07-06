import * as vscode from 'vscode';

export async function toggleHeadingUp() {
   let editor = vscode.window.activeTextEditor;
   if(!editor) {
      return;
   }
   let lineIndex = editor.selection.active.line;
   let lineText = editor.document.lineAt(lineIndex).text;

   return await editor.edit((editBuilder) => {
      if (!lineText.startsWith('#')) {
         // Not a heading
         editBuilder.insert(new vscode.Position(lineIndex, 0), '# ');
      } else if (!lineText.startsWith('######')) {
         // Already a heading (but not level 6)
         editBuilder.insert(new vscode.Position(lineIndex, 0), '#');
      }
   });
}

export function toggleHeadingDown() {
   let editor = vscode.window.activeTextEditor;
   if(!editor) {
      return;
   }
   let lineIndex = editor.selection.active.line;
   let lineText = editor.document.lineAt(lineIndex).text;

   editor.edit((editBuilder) => {
      if (lineText.startsWith('# ')) {
         // Heading level 1
         editBuilder.delete(
            new vscode.Range(
               new vscode.Position(lineIndex, 0),
               new vscode.Position(lineIndex, 2)
            )
         );
      } else if (lineText.startsWith('#')) {
         // Heading (but not level 1)
         editBuilder.delete(
            new vscode.Range(
               new vscode.Position(lineIndex, 0),
               new vscode.Position(lineIndex, 1)
            )
         );
      }
   });
}
