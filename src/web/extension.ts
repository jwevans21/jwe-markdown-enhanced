import * as vscode from 'vscode';

import type MarkdownIt = require('markdown-it');

import * as editingCommands from '../common/editingCommands';

import { convertToHtml } from '../common/convertToHtml';

import { extendMarkdownIt } from '../common/extendMarkdownIt';
import { foldYaml } from '../common/yamlFolding';

export function activate(context: vscode.ExtensionContext) {
   console.log(
      'Congratulations, your extension "jwe-markdown-enhanced" is now active!'
   );

   editingCommands.register(context);

   foldYaml();

   return {
      extendMarkdownIt: (md: MarkdownIt) => {
         context.subscriptions.push(convertToHtml(md));
         return extendMarkdownIt(md);
      },
   };
}

export function deactivate() {}
