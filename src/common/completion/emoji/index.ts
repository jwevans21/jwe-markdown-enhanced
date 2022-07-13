import * as vscode from 'vscode';
import { gemoji } from 'gemoji';

/*
 * Based on vscode-emojisense (https://github.com/mattbierner/vscode-emojisense)
 * Licensed under the MIT license
 */

interface Emoji {
   name: string;
   emoji: string;
}

export default class EmojiCompletionProvider
   implements vscode.CompletionItemProvider
{
   public provideCompletionItems(
      document: vscode.TextDocument,
      position: vscode.Position,
      token: vscode.CancellationToken,
      context: vscode.CompletionContext
   ): vscode.CompletionItem[] {
      if (position.character === 0) {
         return [];
      }

      const line = document.lineAt(position.line);
      const pre = line.text.slice(0, position.character);
      const post = line.text.slice(position.character);

      const preExistingMatch = pre.match(/:[\w\d_+-]+:/);

      const preMatch =
         preExistingMatch || pre.match(/(?:\s|^)(:(:?)$)|(:(:?)[\w\d_+-]+?)$/);
      if (!preMatch) {
         return [];
      }

      const postMatch = post.match(/[\w\d_+-]*?:?/);

      const replacementSpan = new vscode.Range(
         position.translate(0, -(preMatch[1] || preMatch[3] || '').length),
         postMatch ? position.translate(0, postMatch[0].length) : position
      );

      return this.getEmojiCompletions(replacementSpan);
   }

   private getEmojis(): Emoji[] {
      let emojis: Map<string, Emoji> = new Map<string, Emoji>();
      for (const gem of gemoji) {
         for (const name of gem.names) {
            emojis.set(name, {
               name: name,
               emoji: gem.emoji,
            });
         }
      }
      return Array.from(emojis.values());
   }

   private getEmojiCompletions(
      replacementSpan: vscode.Range
   ): vscode.CompletionItem[] {
      const items = this.getEmojis().map((emoji) => {
         const item = new vscode.CompletionItem(
            `:${emoji.name}: ${emoji.emoji}`,
            vscode.CompletionItemKind.Text
         );
         item.filterText = `:${emoji.name}:`;
         item.documentation = new vscode.MarkdownString(`# ${emoji.emoji}`);
         item.insertText = `:${emoji.name}:`;
         item.range = replacementSpan;
         return item;
      });

      return items;
   }
}
