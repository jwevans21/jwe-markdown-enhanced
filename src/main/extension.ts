import type MarkdownIt = require('markdown-it');
import * as vscode from 'vscode';

import * as editingCommands from '../common/editingCommands';

import { convertToHtml } from '../common/convertToHtml';

import { extendMarkdownIt } from '../common/extendMarkdownIt';
import { convertToPdf } from './convertToPdf';

import MarkdownFoldingProvider from '../common/folding';

import CodeBlockCompletionProvider from '../common/completion/codeblocks';
import EmojiCompletionProvider from '../common/completion/emoji';

export function activate(context: vscode.ExtensionContext) {
   console.log(
      'Congratulations, your extension "jwe-markdown-enhanced" is now active!'
   );

   editingCommands.register(context);

   context.subscriptions.push(
      vscode.languages.registerFoldingRangeProvider(
         'markdown',
         new MarkdownFoldingProvider()
      ),
      vscode.languages.registerCompletionItemProvider(
         'markdown',
         new EmojiCompletionProvider(),
         ':'
      )
   );

   return {
      extendMarkdownIt: (md: MarkdownIt) => {
         context.subscriptions.push(convertToHtml(md));
         context.subscriptions.push(convertToPdf(md));
         return extendMarkdownIt(md);
      },
   };
}

export function deactivate() {}
