import * as vscode from 'vscode';

import yamlRanges from './frontmatter';
import listRanges from './list';
import tableRanges from './table';

export default class MarkdownFoldingProvider implements vscode.FoldingRangeProvider {
   provideFoldingRanges(
      document: vscode.TextDocument,
      context: vscode.FoldingContext,
      token: vscode.CancellationToken,
   ): vscode.FoldingRange[] {
      let ranges: vscode.FoldingRange[] = [];

      // Get frontmatter range
      ranges = ranges.concat(yamlRanges(document));

      // Get list ranges
      ranges = ranges.concat(listRanges(document));

      // Get table ranges
      ranges = ranges.concat(tableRanges(document));

      return ranges;
   }
}