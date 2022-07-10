import * as vscode from 'vscode';

export default function tableRanges(
   document: vscode.TextDocument
): vscode.FoldingRange[] {
   let ranges: vscode.FoldingRange[] = [];

   const tableRegex = /^\s*\|.*/;
   const tableDividerRegex = /^\|\s*[:-]+.*/;

   for (let i = 0; i < document.lineCount - 1; i++) {
      if (tableDividerRegex.test(document.lineAt(i + 1).text)) {
         if (tableRegex.test(document.lineAt(i).text)) {
            const start = i;

            for (let j = start + 2; j < document.lineCount - 1; j++) {
               if (j === document.lineCount - 1) {
                  ranges.push(new vscode.FoldingRange(start, j));
                  i = j;
                  j = document.lineCount;
               } else if (tableRegex.test(document.lineAt(j).text)) {
                  continue;
               } else if (!tableRegex.test(document.lineAt(j).text)) {
                  ranges.push(new vscode.FoldingRange(start, j - 1));
                  i = j;
                  j = document.lineCount;
               }
            }
         } else {
            const start = i + 1;
            
            for (let j = start + 1; j < document.lineCount - 1; j++) {
               if (j === document.lineCount - 1) {
                  ranges.push(new vscode.FoldingRange(start, j));
                  i = j;
                  j = document.lineCount;
               } else if (tableRegex.test(document.lineAt(j).text)) {
                  continue;
               } else if (!tableRegex.test(document.lineAt(j).text)) {
                  ranges.push(new vscode.FoldingRange(start, j - 1));
                  i = j;
                  j = document.lineCount;
               }
            }
         }
      }
   }

   return ranges;
}
