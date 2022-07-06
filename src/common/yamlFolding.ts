import * as vscode from 'vscode';

export function foldYaml() {
   return vscode.languages.registerFoldingRangeProvider(
      { language: 'markdown' },
      {
         provideFoldingRanges(
            document: vscode.TextDocument
         ): vscode.ProviderResult<vscode.FoldingRange[]> {
            const yamlRegex = /^\s*(?:---|---\s*$)/;
            let ranges: vscode.FoldingRange[] = [];
            const text = document.getText();
            const lines = text.split('\n');
            if (yamlRegex.test(lines[0])) {
               for (let i = 1; i < lines.length; i++) {
                  if (yamlRegex.test(lines[i])) {
                     ranges.push(new vscode.FoldingRange(0, i));
                     i = lines.length; // to exit the loop, yaml should only be at the beginning of the file
                  }
               }
            }
            return ranges;
         },
      }
   );
}
