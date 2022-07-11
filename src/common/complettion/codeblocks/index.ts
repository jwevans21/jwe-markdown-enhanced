import * as vscode from 'vscode';
import * as languages from '../../../../markdown.embedded-languages.json';
import * as customLanguages from '../../../../markdown.custom-embedded-languages.json';

const langs = languages.concat(customLanguages).flatMap((lg) => lg.identifiers);

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

      const preExistingMatch = pre.match(/^(`{1,})(?:([\w-]+)?)?$/);

      const preMatch = preExistingMatch || pre.match(/^(`{1,})$/);

      console.log(preMatch);

      if (!preMatch) {
         console.log('no match');
         return [];
      }

      //const postMatch = post.match(/^(?:(`{1,}|~{1,})?)(.*)/);

      const replacementSpan = new vscode.Range(
         position.translate(0, -(preMatch[1].length + preMatch[2].length)),
         position.translate(0, line.range.end.character)
      );

      console.log('replacementSpan', replacementSpan);

      return this.getLangCompletions(replacementSpan);
   }

   private getLangCompletions(
      replacementSpan: vscode.Range
   ): vscode.CompletionItem[] {
      console.log('CodeBlockCompletionProvider.getLangCompletions');
      console.log('langs', langs);
      const items = langs.map((lang) => {
         const item = new vscode.CompletionItem(lang);
         item.kind = vscode.CompletionItemKind.Text;
         item.insertText = lang;
         item.filterText = lang;
         item.range = replacementSpan;
         return item;
      });

      console.log('items', items);

      return items;
   }
}
