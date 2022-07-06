import type MarkdownIt = require('markdown-it');
import * as vscode from 'vscode';

import { toHtml } from './utils';

export function convertToHtml(md: MarkdownIt) {
   return vscode.commands.registerCommand(
      'jwe-markdown-enhanced.convertToHtml',
      () => {
         const editor = vscode.window.activeTextEditor;

         if (!editor) {
            vscode.window.showErrorMessage('Error: No editor is active');
            return;
         }
         if (editor.document.languageId !== 'markdown') {
            vscode.window.showErrorMessage('Error: Not a markdown file');
            return;
         }

         const markdown = editor.document.getText();
         const htmlFilePath = editor.document.uri
            .toString()
            .replace(/\.md$/, '.html');
         const htmlFileURI = vscode.Uri.parse(htmlFilePath);
         vscode.window.withProgress(
            {
               location: vscode.ProgressLocation.Notification,
               title: 'Converting to HTML',
            },
            async () => {
               const html = toHtml(md, markdown);
               await vscode.workspace.fs.writeFile(
                  htmlFileURI,
                  Buffer.from(html)
               );
            }
         );
      }
   );
}
