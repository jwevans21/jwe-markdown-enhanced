import * as vscode from 'vscode';
import * as languages from '../../../../markdown.embedded-languages.json';
import * as customLanguages from '../../../../markdown.custom-embedded-languages.json';

/*
 * TODO: Find out why items are not showing for completion
 */

export default class CodeBlockCompletionProvider
   implements vscode.CompletionItemProvider
{
   provideCompletionItems(
      document: vscode.TextDocument,
      position: vscode.Position,
      token: vscode.CancellationToken,
      context: vscode.CompletionContext
   ): vscode.CompletionItem[] {
      console.log('CodeBlockCompletionProvider.provideCompletionItems');
      if (position.character === 0) {
         return [];
      }

      const line = document.lineAt(position.line);
      console.log(line.text);
      const pre = line.text.slice(0, position.character);
      const post = line.text.slice(position.character);

      const preExistingMatch = pre.match(/^([~`]{1,})([\w-]+)$/);

      const preMatch =
         preExistingMatch || pre.match(/^([`~]{1,})|([`~]{3,}[\w-]+?)$/);

      console.log(preMatch);

      if (!preMatch) {
         console.log('no match');
         return [];
      }

      const postMatch = post.match(/^(?:([`~]{1,})?)([\w-]*)$/);

      const replacementSpan = new vscode.Range(
         line.range.start,
         line.range.end
      );

      console.log('replacementSpan', replacementSpan);

      return this.getLangCompletions(replacementSpan);
   }

   private getLangCompletions(
      replacementSpan: vscode.Range
   ): vscode.CompletionItem[] {
      console.log('CodeBlockCompletionProvider.getLangCompletions');
      console.log('langs', languages);
      const items = languages.flatMap((lang) => {
         return lang.identifiers.map((id) => {
            const item = new vscode.CompletionItem(
               id,
               vscode.CompletionItemKind.Snippet
            );
            item.filterText = `\`\`\`${id}`;
            item.insertText = new vscode.SnippetString(
               `\`\`\`${id}\n$0\n\`\`\``
            );
            item.range = replacementSpan;
            return item;
         });
      });

      console.log('items', items);

      return items;
   }
}
