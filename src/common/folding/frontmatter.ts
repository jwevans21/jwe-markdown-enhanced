import * as vscode from 'vscode';

export default function yamlRanges(
   document: vscode.TextDocument
): vscode.FoldingRange[] {
   const yamlRegex = /^\s*(?:---|---\s*$)/;
   let ranges: vscode.FoldingRange[] = [];
   const text = document.getText();
   if (yamlRegex.test(document.lineAt(0).text)) {
      for (let i = 1; i < document.lineCount; i++) {
         if (yamlRegex.test(document.lineAt(i).text)) {
            ranges.push(new vscode.FoldingRange(0, i));
            i = document.lineCount; // to exit the loop, yaml should only be at the beginning of the file
         }
      }
   }
   return ranges;
}
