// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import type MarkdownIt = require('markdown-it');
import * as vscode from 'vscode';

import * as editingCommands from '../common/editingCommands';

import { convertToHtml } from '../common/convertToHtml';

import { extendMarkdownIt } from '../common/extendMarkdownIt';
import { convertToPdf } from './convertToPdf';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
   // Use the console to output diagnostic information (console.log) and errors (console.error)
   // This line of code will only be executed once when your extension is activated
   console.log(
      'Congratulations, your extension "jwe-markdown-enhanced" is now active!'
   );

   // The command has been defined in the package.json file
   // Now provide the implementation of the command with registerCommand
   // The commandId parameter must match the command field in package.json
   let disposable = vscode.commands.registerCommand(
      'jwe-markdown-enhanced.helloWorld',
      () => {
         // The code you place here will be executed every time your command is executed
         // Display a message box to the user
         vscode.window.showInformationMessage(
            'Hello World from jwe-markdown-enhanced!'
         );
      }
   );

   context.subscriptions.push(disposable);

   editingCommands.register(context);

   return {
      extendMarkdownIt: (md: MarkdownIt) => {
         context.subscriptions.push(convertToHtml(md));
         context.subscriptions.push(convertToPdf(md));
         return extendMarkdownIt(md);
      },
   };
}

// this method is called when your extension is deactivated
export function deactivate() {}
