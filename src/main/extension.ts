import type MarkdownIt = require('markdown-it');
import * as vscode from 'vscode';

import * as editingCommands from '../common/editingCommands';

import { convertToHtml } from '../common/convertToHtml';

import { extendMarkdownIt } from '../common/extendMarkdownIt';
import { convertToPdf } from './convertToPdf';

export function activate(context: vscode.ExtensionContext) {
   console.log(
      'Congratulations, your extension "jwe-markdown-enhanced" is now active!'
   );

   editingCommands.register(context);

   return {
      extendMarkdownIt: (md: MarkdownIt) => {
         context.subscriptions.push(convertToHtml(md));
         context.subscriptions.push(convertToPdf(md));
         return extendMarkdownIt(md);
      },
   };
}

export function deactivate() {}
