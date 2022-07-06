import * as vscode from 'vscode';

import * as commands from './markdown';

export function register(context: vscode.ExtensionContext) {
   return context.subscriptions.push(
      vscode.commands.registerCommand(
         'markdown.toggleHeadingUp',
         commands.toggleHeadingUp
      ),
      vscode.commands.registerCommand(
         'markdown.toggleHeadingDown',
         commands.toggleHeadingDown
      ),
      vscode.commands.registerCommand(
         'jwe-markdown-enhanced.toggleBold',
         commands.bold
      ),
      vscode.commands.registerCommand(
         'jwe-markdown-enhanced.toggleItalic',
         commands.italic
      ),
      vscode.commands.registerCommand(
         'jwe-markdown-enhanced.toggleStrikethrough',
         commands.strikethrough
      ),
      vscode.commands.registerCommand(
         'jwe-markdown-enhanced.toggleHighlight',
         commands.highlight
      ),
      vscode.commands.registerCommand(
         'jwe-markdown-enhanced.toggleUnderline',
         commands.underline
      ),
      vscode.commands.registerCommand(
         'jwe-markdown-enhanced.toggleSubscript',
         commands.subscript
      ),
      vscode.commands.registerCommand(
         'jwe-markdown-enhanced.toggleSuperscript',
         commands.superscript
      ),
      vscode.commands.registerCommand(
         'jwe-markdown-enhanced.toggleLink',
         commands.link
      ),
      vscode.commands.registerCommand(
         'jwe-markdown-enhanced.toggleCode',
         commands.code
      ),
      vscode.commands.registerCommand(
         'jwe-markdown-enhanced.toggleCodeBlock',
         commands.codeBlock
      ),
      vscode.commands.registerCommand(
         'jwe-markdown-enhanced.paste',
         commands.paste
      ),
      vscode.commands.registerCommand(
         'jwe-markdown-enhanced.onEnter',
         commands.onEnter
      ),
      vscode.commands.registerCommand(
         'jwe-markdown-enhanced.onTab',
         commands.onTab
      ),
      vscode.commands.registerCommand('jwe-markdown-enhanced.onShiftTab', () =>
         commands.onTab('shift')
      ),
      vscode.commands.registerCommand(
         'jwe-markdown-enhanced.onBackspace',
         commands.onBackspace
      )
   );
}
