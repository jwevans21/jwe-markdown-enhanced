import * as vscode from 'vscode';

/*
 * Functions taken from https://github.com/yzhang-gh/vscode-markdown/blob/master/src/formatting.ts
 * Which are licensed under the MIT license
 */

export function styleByWrapping(
   startPattern: string,
   endPattern = startPattern
) {
   let editor = vscode.window.activeTextEditor;
   if (!editor) {
      return; // No open text editor
   }
   let selections = editor.selections;

   let batchEdit = new vscode.WorkspaceEdit();
   let shifts: [vscode.Position, number][] = [];
   let newSelections: vscode.Selection[] = selections.slice();

   for (const [i, selection] of selections.entries()) {
      let cursorPos = selection.active;
      const shift = shifts
         .map(([pos, s]) =>
            selection.start.line === pos.line &&
            selection.start.character >= pos.character
               ? s
               : 0
         )
         .reduce((a, b) => a + b, 0);

      if (selection.isEmpty) {
         const context = getContext(
            editor,
            cursorPos,
            startPattern,
            endPattern
         );

         // No selected text
         if (
            startPattern === endPattern &&
            ['**', '*', '__', '_'].includes(startPattern) &&
            context === `${startPattern}text|${endPattern}`
         ) {
            // `**text|**` to `**text**|`
            let newCursorPos = cursorPos.with({
               character: cursorPos.character + shift + endPattern.length,
            });
            newSelections[i] = new vscode.Selection(newCursorPos, newCursorPos);
            continue;
         } else if (context === `${startPattern}|${endPattern}`) {
            // `**|**` to `|`
            let start = cursorPos.with({
               character: cursorPos.character - startPattern.length,
            });
            let end = cursorPos.with({
               character: cursorPos.character + endPattern.length,
            });
            wrapRange(
               editor,
               batchEdit,
               shifts,
               newSelections,
               i,
               shift,
               cursorPos,
               new vscode.Range(start, end),
               false,
               startPattern,
               endPattern
            );
         } else {
            // Select word under cursor
            let wordRange = editor.document.getWordRangeAtPosition(cursorPos);
            if (wordRange === undefined) {
               wordRange = selection;
            }
            // One special case: toggle strikethrough in task list
            const currentTextLine = editor.document.lineAt(cursorPos.line);
            if (
               startPattern === '~~' &&
               /^\s*[\*\+\-] (\[[ x]\] )? */g.test(currentTextLine.text)
            ) {
               wordRange = currentTextLine.range.with(
                  new vscode.Position(
                     cursorPos.line,
                     // @ts-ignore
                     currentTextLine.text.match(
                        /^\s*[\*\+\-] (\[[ x]\] )? */g
                     )[0].length
                  )
               );
            }
            wrapRange(
               editor,
               batchEdit,
               shifts,
               newSelections,
               i,
               shift,
               cursorPos,
               wordRange,
               false,
               startPattern,
               endPattern
            );
         }
      } else {
         // Text selected
         wrapRange(
            editor,
            batchEdit,
            shifts,
            newSelections,
            i,
            shift,
            cursorPos,
            selection,
            true,
            startPattern,
            endPattern
         );
      }
   }

   return vscode.workspace.applyEdit(batchEdit).then(() => {
      if (editor) {
         editor.selections = newSelections;
      }
   });
}

function wrapRange(
   editor: vscode.TextEditor,
   wsEdit: vscode.WorkspaceEdit,
   shifts: [vscode.Position, number][],
   newSelections: vscode.Selection[],
   i: number,
   shift: number,
   cursor: vscode.Position,
   range: vscode.Range,
   isSelected: boolean,
   startPtn: string,
   endPtn: string
) {
   let text = editor.document.getText(range);
   const prevSelection = newSelections[i];
   const ptnLength = (startPtn + endPtn).length;

   let newCursorPos = cursor.with({ character: cursor.character + shift });
   let newSelection: vscode.Selection;
   if (isWrapped(text, startPtn, endPtn)) {
      // remove start/end patterns from range
      wsEdit.replace(
         editor.document.uri,
         range,
         text.substr(startPtn.length, text.length - ptnLength)
      );

      shifts.push([range.end, -ptnLength]);

      // Fix cursor position
      if (!isSelected) {
         if (!range.isEmpty) {
            // means quick styling
            if (cursor.character === range.end.character) {
               newCursorPos = cursor.with({
                  character: cursor.character + shift - ptnLength,
               });
            } else {
               newCursorPos = cursor.with({
                  character: cursor.character + shift - startPtn.length,
               });
            }
         } else {
            // means `**|**` -> `|`
            newCursorPos = cursor.with({
               character: cursor.character + shift + startPtn.length,
            });
         }
         newSelection = new vscode.Selection(newCursorPos, newCursorPos);
      } else {
         newSelection = new vscode.Selection(
            prevSelection.start.with({
               character: prevSelection.start.character + shift,
            }),
            prevSelection.end.with({
               character: prevSelection.end.character + shift - ptnLength,
            })
         );
      }
   } else {
      // add start/end patterns around range
      wsEdit.replace(editor.document.uri, range, startPtn + text + endPtn);

      shifts.push([range.end, ptnLength]);

      // Fix cursor position
      if (!isSelected) {
         if (!range.isEmpty) {
            // means quick styling
            if (cursor.character === range.end.character) {
               newCursorPos = cursor.with({
                  character: cursor.character + shift + ptnLength,
               });
            } else {
               newCursorPos = cursor.with({
                  character: cursor.character + shift + startPtn.length,
               });
            }
         } else {
            // means `|` -> `**|**`
            newCursorPos = cursor.with({
               character: cursor.character + shift + startPtn.length,
            });
         }
         newSelection = new vscode.Selection(newCursorPos, newCursorPos);
      } else {
         newSelection = new vscode.Selection(
            prevSelection.start.with({
               character: prevSelection.start.character + shift,
            }),
            prevSelection.end.with({
               character: prevSelection.end.character + shift + ptnLength,
            })
         );
      }
   }

   newSelections[i] = newSelection;
}

function isWrapped(
   text: string,
   startPattern: string,
   endPattern: string
): boolean {
   return text.startsWith(startPattern) && text.endsWith(endPattern);
}

function getContext(
   editor: vscode.TextEditor,
   cursorPos: vscode.Position,
   startPattern: string,
   endPattern: string
): string {
   let startPositionCharacter = cursorPos.character - startPattern.length;
   let endPositionCharacter = cursorPos.character + endPattern.length;

   if (startPositionCharacter < 0) {
      startPositionCharacter = 0;
   }

   let leftText = editor.document.getText(
      new vscode.Range(
         cursorPos.line,
         startPositionCharacter,
         cursorPos.line,
         cursorPos.character
      )
   );
   let rightText = editor.document.getText(
      new vscode.Range(
         cursorPos.line,
         cursorPos.character,
         cursorPos.line,
         endPositionCharacter
      )
   );

   if (rightText === endPattern) {
      if (leftText === startPattern) {
         return `${startPattern}|${endPattern}`;
      } else {
         return `${startPattern}text|${endPattern}`;
      }
   }
   return '|';
}
