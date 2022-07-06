import * as vscode from 'vscode';

import type MarkdownIt = require('markdown-it');

import * as emoji from 'markdown-it-emoji';

import { convertToHtml } from '../common/convertToHtml';

import { extendMarkdownIt } from '../common/extendMarkdownIt';

export function activate(context: vscode.ExtensionContext) {
   console.log(
      'Congratulations, your extension "jwe-markdown-enhanced" is now active!'
   );
   context.subscriptions.push(
      vscode.commands.registerCommand(
         'jwe-markdown-enhanced.helloWorld',
         () => {
            vscode.window.showInformationMessage(
               'Hello World from jwe-markdown-enhanced!'
            );
         }
      )
   );

   return {
      extendMarkdownIt: (md: MarkdownIt) => {
         context.subscriptions.push(convertToHtml(md));
         return extendMarkdownIt(md);
      },
   };
}

export function deactivate() {}
