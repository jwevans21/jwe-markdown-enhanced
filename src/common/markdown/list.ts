import * as vscode from 'vscode';

import { isInFencedCodeBlock, mathEnvCheck } from './utils';

const regex = {
   emptyListItem: /^([-+*]|[0-9]+[.)])( +\[[ x]\])?$/,
   unorderedListItem: /^(\s*)([-+*] +(\[[ x]\] +)?)/,
   orderedListItem: /^(\s*)([0-9]+)([.)])( +)((\[[ x]\] +)?)/,
   blockquote: /^(\s*> +)/,
   emptyBlockquote: /^\s*>\s*$/,
};

function asNormal(
   key: 'enter' | 'tab' | 'backspace',
   modifier?: 'ctrl' | 'shift' | 'alt'
) {
   switch (key) {
      case 'enter':
         if (modifier === 'ctrl') {
            return vscode.commands.executeCommand(
               'editor.action.insertLineAfter'
            );
         } else {
            return vscode.commands.executeCommand('type', {
               source: 'keyboard',
               text: '\n',
            });
         }
      case 'tab':
         if (modifier === 'shift') {
            return vscode.commands.executeCommand('editor.action.outdentLines');
         } else if (
            vscode.window.activeTextEditor?.selection.isEmpty &&
            vscode.workspace
               .getConfiguration('emmet')
               .get<boolean>('triggerExpansionOnTab')
         ) {
            return vscode.commands.executeCommand(
               'editor.emmet.action.expandAbbreviation'
            );
         } else {
            return vscode.commands.executeCommand('tab');
         }
      case 'backspace':
         return vscode.commands.executeCommand('deleteLeft');
   }
}

/*
 * From the function at https://github.com/yzhang-gh/vscode-markdown/blob/ff0e18ff018c88e99c38a2686c63536f0df9d4a4/src/listEditing.ts#L27
 * Licensed under the MIT license
 */
export function onEnter(modifier?: 'ctrl' | 'shift' | 'alt') {
   let editor = vscode.window.activeTextEditor;
   if (!editor) {
      return asNormal('enter'); // No open text editor
   }
   let cursorPosition = editor.selection.active;
   let line = editor.document.lineAt(cursorPosition.line);

   let lineBreakPos = cursorPosition;

   let textBeforeCursor = line.text.substring(0, cursorPosition.character);
   let textAfterCursor = line.text.substring(cursorPosition.character);

   if (modifier === 'shift') {
      return asNormal('enter', modifier);
   }

   // If the line is empty, remove the marker and move to next line
   if (
      regex.emptyListItem.test(textBeforeCursor.trim()) &&
      textAfterCursor.trim().length === 0
   ) {
      return editor
         .edit((editBuilder) => {
            editBuilder.delete(line.range);
            editBuilder.insert(line.range.end, '\n');
         })
         .then(() => editor?.revealRange(editor.selection));
   }

   if (line.text.match(regex.unorderedListItem)) {
      const matches = line.text.match(regex.unorderedListItem) || [];
      return editor
         .edit((editBuilder) => {
            editBuilder.delete(new vscode.Range(lineBreakPos, line.range.end));
            editBuilder.insert(line.range.end, '\n');
            editBuilder.insert(
               line.range.end,
               `${matches[1]}${matches[2].replace(
                  /\[[xX]{1}\]/,
                  '[ ]'
               )}${textAfterCursor}`
            );
         })
         .then(() => {
            let newCursorPos = cursorPosition.with(
               line.lineNumber + 1,
               `${matches[1]}${matches[2]}${textAfterCursor}`.length
            );
            // @ts-ignore
            editor.selection = new vscode.Selection(newCursorPos, newCursorPos);
         })
         .then(() => editor?.revealRange(editor.selection));
   } else if (line.text.match(regex.orderedListItem)) {
      const matches = line.text.match(regex.orderedListItem) || [];
      return editor
         .edit((editBuilder) => {
            editBuilder.delete(new vscode.Range(lineBreakPos, line.range.end));
            editBuilder.insert(line.range.end, '\n');
            editBuilder.insert(
               line.range.end,
               `${matches[1]}${parseInt(matches[2]) + 1}${matches[3]}${
                  matches[4]
               }${textAfterCursor}`
            );
         })
         .then(() => {
            let newCursorPos = cursorPosition.with(
               line.lineNumber + 1,
               `${matches[1]}${parseInt(matches[2]) + 1}${matches[3]}${
                  matches[4]
               }${textAfterCursor}`.length
            );
            // @ts-ignore
            editor.selection = new vscode.Selection(newCursorPos, newCursorPos);
         })
         .then(() => editor?.revealRange(editor.selection));
   } else if (line.text.match(regex.blockquote)) {
      if (line.text.replace(/[\s]+$/g, '') === '>') {
         if (
            (
               editor.document.lineAt(cursorPosition.line - 1).text || ''
            ).replace(/[\s]+$/g, '') === '>'
         ) {
            return editor
               .edit((editorBuilder) => {
                  editorBuilder.replace(
                     new vscode.Range(
                        new vscode.Position(cursorPosition.line - 1, 0),
                        new vscode.Position(
                           cursorPosition.line,
                           cursorPosition.character
                        )
                     ),
                     '\n'
                  );
               })
               .then(() => {
                  editor?.revealRange(editor.selection);
               });
         }
      }

      return editor
         .edit((editBuilder) => {
            editBuilder.insert(lineBreakPos, `\n> `);
         })
         .then(() => {
            if (modifier === 'ctrl' && !cursorPosition.isEqual(lineBreakPos)) {
               let newCursorPos = cursorPosition.with(line.lineNumber + 1, 2);
               // @ts-ignore
               editor.selection = new vscode.Selection(
                  newCursorPos,
                  newCursorPos
               );
            }
         })
         .then(() => {
            editor?.revealRange(editor.selection);
         });
   }

   return asNormal('enter');
}

/*
 * Based on function from https://github.com/yzhang-gh/vscode-markdown/blob/ff0e18ff018c88e99c38a2686c63536f0df9d4a4/src/listEditing.ts#L230
 * Licensed under the MIT license.
 */
function indent(editor: vscode.TextEditor) {
   try {
      const selection = editor.selection;
      const useSpaces = vscode.workspace
         .getConfiguration('editor')
         .get('insertSpaces', true);
      const indentationSize = vscode.workspace
         .getConfiguration('editor')
         .get('tabSize', 4);
      const indentation = useSpaces ? ' '.repeat(indentationSize) : '\t';
      let edit = new vscode.WorkspaceEdit();
      for (let i = selection.start.line; i <= selection.end.line; i++) {
         if (
            i === selection.end.line &&
            !selection.isEmpty &&
            selection.end.character === 0
         ) {
            break;
         }
         if (editor.document.lineAt(i).text.length !== 0) {
            edit.insert(
               editor.document.uri,
               new vscode.Position(i, 0),
               indentation
            );
         }
      }
      return vscode.workspace.applyEdit(edit);
   } catch (error) {}

   return vscode.commands.executeCommand('editor.action.indentLines');
}

/*
 * Based on the function from https://github.com/yzhang-gh/vscode-markdown/blob/ff0e18ff018c88e99c38a2686c63536f0df9d4a4/src/listEditing.ts#L258
 * Licensed under the MIT license.
 */
function outdent(editor: vscode.TextEditor) {
   try {
      const selection = editor.selection;
      const useSpaces = vscode.workspace
         .getConfiguration('editor')
         .get('insertSpaces', true);
      const indentationSize = vscode.workspace
         .getConfiguration('editor')
         .get('tabSize', 4);
      let edit = new vscode.WorkspaceEdit();
      for (let i = selection.start.line; i <= selection.end.line; i++) {
         if (
            i === selection.end.line &&
            !selection.isEmpty &&
            selection.end.character === 0
         ) {
            break;
         }
         const lineText = editor.document.lineAt(i).text;
         let maxOutdentSize: number;
         if (lineText.trim().length === 0) {
            maxOutdentSize = lineText.length;
         } else {
            maxOutdentSize =
               editor.document.lineAt(i).firstNonWhitespaceCharacterIndex;
         }
         if (maxOutdentSize > 0) {
            edit.delete(
               editor.document.uri,
               new vscode.Range(
                  i,
                  0,
                  i,
                  Math.min(useSpaces ? indentationSize : 1, maxOutdentSize)
               )
            );
         }
      }
      return vscode.workspace.applyEdit(edit);
   } catch (error) {}

   return vscode.commands.executeCommand('editor.action.outdentLines');
}

/*
 * Function from https://github.com/yzhang-gh/vscode-markdown/blob/ff0e18ff018c88e99c38a2686c63536f0df9d4a4/src/listEditing.ts#L307
 * Licensed under the MIT license
 */
function findNextMarkerLineNumber(line?: number): number {
   let editor = vscode.window.activeTextEditor;
   if (!editor) {
      return -1;
   }
   if (line === undefined) {
      // Use start.line instead of active.line so that we can find the first
      // marker following either the cursor or the entire selected range
      line = editor.selection.start.line;
   }
   while (line < editor.document.lineCount) {
      const lineText = editor.document.lineAt(line).text;

      if (lineText.startsWith('#')) {
         // Don't go searching past any headings
         return -1;
      }

      if (/^\s*[0-9]+[.)] +/.exec(lineText) !== null) {
         return line;
      }
      line++;
   }
   return -1;
}

/*
 * Function from https://github.com/yzhang-gh/vscode-markdown/blob/ff0e18ff018c88e99c38a2686c63536f0df9d4a4/src/listEditing.ts#L336
 * Licensed under the MIT license
 */
function lookUpwardForMarker(
   editor: vscode.TextEditor,
   line: number,
   currentIndentation: number
): number {
   while (--line >= 0) {
      const lineText = editor.document.lineAt(line).text;
      let matches;
      if ((matches = /^(\s*)(([0-9]+)[.)] +)/.exec(lineText)) !== null) {
         let leadingSpace: string = matches[1];
         let marker = matches[3];
         if (leadingSpace.length === currentIndentation) {
            return Number(marker) + 1;
         } else if (
            (!leadingSpace.includes('\t') &&
               leadingSpace.length + matches[2].length <= currentIndentation) ||
            (leadingSpace.includes('\t') &&
               leadingSpace.length + 1 <= currentIndentation)
         ) {
            return 1;
         }
      } else if ((matches = /^(\s*)\S/.exec(lineText)) !== null) {
         if (matches[1].length <= currentIndentation) {
            break;
         }
      }
   }
   return 1;
}

/*
 * Function from https://github.com/yzhang-gh/vscode-markdown/blob/ff0e18ff018c88e99c38a2686c63536f0df9d4a4/src/listEditing.ts#L363
 * Licensed under the MIT license
 */
export function fixMarker(line?: number): void | Thenable<void> {
   let editor = vscode.window.activeTextEditor;
   if (!editor) {
      return;
   }
   if (line === undefined) {
      // Use either the first line containing an ordered list marker within the selection or the active line
      line = findNextMarkerLineNumber();
      if (line === undefined || line > editor.selection.end.line) {
         line = editor.selection.active.line;
      }
   }
   if (line < 0 || editor.document.lineCount <= line) {
      return;
   }

   let currentLineText = editor.document.lineAt(line).text;
   let matches;
   if ((matches = /^(\s*)([0-9]+)([.)])( +)/.exec(currentLineText)) !== null) {
      // ordered list
      let leadingSpace = matches[1];
      let marker = matches[2];
      let delimiter = matches[3];
      let trailingSpace = matches[4];
      let fixedMarker = lookUpwardForMarker(editor, line, leadingSpace.length);
      let listIndent = marker.length + delimiter.length + trailingSpace.length;
      let fixedMarkerString = String(fixedMarker);

      return editor
         .edit(
            (editBuilder) => {
               if (marker === fixedMarkerString) {
                  return;
               }
               // Add enough trailing spaces so that the text is still aligned at the same indentation level as it was previously, but always keep at least one space
               fixedMarkerString +=
                  delimiter +
                  ' '.repeat(
                     Math.max(
                        1,
                        listIndent - (fixedMarkerString + delimiter).length
                     )
                  );

               editBuilder.replace(
                  new vscode.Range(
                     line || 0,
                     leadingSpace.length,
                     line || 0,
                     leadingSpace.length + listIndent
                  ),
                  fixedMarkerString
               );
            },
            { undoStopBefore: false, undoStopAfter: false }
         )
         .then(() => {
            let nextLine = (line || 0) + 1;
            let indentString = ' '.repeat(listIndent);
            // @ts-ignore
            while (editor.document.lineCount > nextLine) {
               // @ts-ignore
               const nextLineText = editor.document.lineAt(nextLine).text;
               if (/^\s*[0-9]+[.)] +/.test(nextLineText)) {
                  return fixMarker(nextLine);
               } else if (/^\s*$/.test(nextLineText)) {
                  nextLine++;
               } else if (
                  listIndent <= 4 &&
                  !nextLineText.startsWith(indentString)
               ) {
                  return;
               } else {
                  nextLine++;
               }
            }
         });
   }
   return;
}

export function onTab(modifier?: 'ctrl' | 'shift' | 'alt') {
   let editor = vscode.window.activeTextEditor;
   if (!editor) {
      return asNormal('tab', modifier); // No open text editor
   }
   let cursorPosition = editor.selection.active;
   let line = editor.document.lineAt(cursorPosition.line);
   let lineText = line.text;

   let match = /^\s*([-+*]|[0-9]+[.)]) +(\[[ x]\] +)?/.exec(lineText);

   if (
      match &&
      (modifier === 'shift' ||
         !editor.selection.isEmpty ||
         (editor.selection.isEmpty &&
            cursorPosition.character <= match[0].length))
   ) {
      if (modifier === 'shift') {
         return outdent(editor).then(() => fixMarker());
      } else {
         return indent(editor).then(() => fixMarker());
      }
   }

   return asNormal('tab', modifier);
}

function deleteRange(
   editor: vscode.TextEditor,
   range: vscode.Range
): Thenable<boolean> {
   return editor.edit(
      (editBuilder) => {
         editBuilder.delete(range);
      },
      // We will enable undoStop after fixing markers
      { undoStopBefore: true, undoStopAfter: false }
   );
}

export function onBackspace() {
   let editor = vscode.window.activeTextEditor;
   if (!editor) {
      return asNormal('backspace'); // No open text editor
   }
   let cursor = editor.selection.active;
   let document = editor.document;
   let textBeforeCursor = document
      .lineAt(cursor.line)
      .text.substr(0, cursor.character);

   if (
      isInFencedCodeBlock(document, cursor.line) ||
      mathEnvCheck(editor.document, cursor)
   ) {
      return asNormal('backspace');
   }

   if (!editor.selection.isEmpty) {
      return asNormal('backspace').then(() =>
         fixMarker(findNextMarkerLineNumber())
      );
   } else if (/^\s+([-+*]|[0-9]+[.)]) $/.test(textBeforeCursor)) {
      // e.g. textBeforeCursor === `  - `, `   1. `
      return outdent(editor).then(() => fixMarker());
   } else if (/^([-+*]|[0-9]+[.)]) $/.test(textBeforeCursor)) {
      // e.g. textBeforeCursor === `- `, `1. `
      return editor
         .edit((editBuilder) => {
            editBuilder.replace(
               new vscode.Range(cursor.with({ character: 0 }), cursor),
               ' '.repeat(textBeforeCursor.length)
            );
         })
         .then(() => fixMarker(findNextMarkerLineNumber()));
   } else if (/^\s*([-+*]|[0-9]+[.)]) +(\[[ x]\] )$/.test(textBeforeCursor)) {
      // e.g. textBeforeCursor === `- [ ]`, `1. [x]`, `  - [x]`
      return deleteRange(
         editor,
         new vscode.Range(
            cursor.with({ character: textBeforeCursor.length - 4 }),
            cursor
         )
      ).then(() => fixMarker(findNextMarkerLineNumber()));
   } else {
      return asNormal('backspace');
   }
}
