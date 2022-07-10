import * as vscode from 'vscode';

function unorderedListRanges(
   document: vscode.TextDocument
): vscode.FoldingRange[] {
   let ranges: vscode.FoldingRange[] = [];

   const startListRegex = /^[-+*]\s+/;
   const listRegex = /^\s*[-+*]\s+/;

   for (let i = 0; i < document.lineCount; i++) {
      if (startListRegex.test(document.lineAt(i).text)) {
         if (!listRegex.test(document.lineAt(i + 1).text)) {
            break;
         }
         const start = i;
         i++;
         for (let j = i; j < document.lineCount; j++) {
            if (j === document.lineCount - 1) {
               ranges.push(new vscode.FoldingRange(start, j));
               i = j;
               j = document.lineCount;
            } else if (listRegex.test(document.lineAt(j).text)) {
               continue;
            } else if (!listRegex.test(document.lineAt(j).text)) {
               ranges.push(new vscode.FoldingRange(start, j - 1));
               i = j;
               j = document.lineCount;
            }
         }
      }
   }

   return ranges;
}

function orderedListRanges(
   document: vscode.TextDocument
): vscode.FoldingRange[] {
   let ranges: vscode.FoldingRange[] = [];

   const startListRegex = /^([0-9]+)([.)])\s+/;
   const listRegex = /^\s*([0-9]+)([.)])\s+/;

   for (let i = 0; i < document.lineCount; i++) {
      if (startListRegex.test(document.lineAt(i).text)) {
         if (!listRegex.test(document.lineAt(i + 1).text)) {
            break;
         }
         const start = i;
         i++;
         for (let j = i; j < document.lineCount; j++) {
            if (j === document.lineCount - 1) {
               ranges.push(new vscode.FoldingRange(start, j));
               i = j;
               j = document.lineCount;
            } else if (listRegex.test(document.lineAt(j).text)) {
               continue;
            } else if (!listRegex.test(document.lineAt(j).text)) {
               ranges.push(new vscode.FoldingRange(start, j - 1));
               i = j;
               j = document.lineCount;
            }
         }
      }
   }

   return ranges;
}

function blockquoteRanges(
   document: vscode.TextDocument
): vscode.FoldingRange[] {
   let ranges: vscode.FoldingRange[] = [];

   const blockquoteRegex = /^>\s+/;

   for (let i = 0; i < document.lineCount; i++) {
      if (blockquoteRegex.test(document.lineAt(i).text)) {
         if (!blockquoteRegex.test(document.lineAt(i + 1).text)) {
            break;
         }
         const start = i;
         i++;
         for (let j = i; j < document.lineCount; j++) {
            if (j === document.lineCount - 1) {
               ranges.push(new vscode.FoldingRange(start, j));
               i = j;
               j = document.lineCount;
            } else if (blockquoteRegex.test(document.lineAt(j).text)) {
               continue;
            } else if (!blockquoteRegex.test(document.lineAt(j).text)) {
               ranges.push(new vscode.FoldingRange(start, j - 1));
               i = j;
               j = document.lineCount;
            }
         }
      }
   }

   return ranges;
}

function definitionListRanges(
   document: vscode.TextDocument
): vscode.FoldingRange[] {
   let ranges: vscode.FoldingRange[] = [];

   const definitionListRegex = /^\s*:\s+/;

   for (let i = 0; i < document.lineCount - 1; i++) {
      if (definitionListRegex.test(document.lineAt(i + 1).text)) {
         if (!definitionListRegex.test(document.lineAt(i + 2).text)) {
            ranges.push(new vscode.FoldingRange(i, i + 1));
            i++;
            break;
         }

         const start = i;
         i++;

         for (let j = i; j < document.lineCount; j++) {
            if (j === document.lineCount - 1) {
               ranges.push(new vscode.FoldingRange(start, j));
               i = j;
               j = document.lineCount;
            } else if (definitionListRegex.test(document.lineAt(j + 1).text)) {
               continue;
            } else if (!definitionListRegex.test(document.lineAt(j + 1).text)) {
               ranges.push(new vscode.FoldingRange(start, j - 1));
               i = j;
               j = document.lineCount;
            }
         }
      }
   }

   return ranges;
}

export default function listRanges(
   document: vscode.TextDocument
): vscode.FoldingRange[] {
   let ranges: vscode.FoldingRange[] = [];

   // Get unordered list ranges
   ranges = ranges.concat(ranges, unorderedListRanges(document));

   // Get ordered list ranges
   ranges = ranges.concat(ranges, orderedListRanges(document));

   // Get blockquote ranges
   ranges = ranges.concat(ranges, blockquoteRanges(document));

   // Get definition list ranges
   ranges = ranges.concat(ranges, definitionListRanges(document));

   return ranges;
}
