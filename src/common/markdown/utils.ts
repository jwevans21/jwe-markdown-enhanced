import * as vscode from 'vscode';
import * as md from 'markdown-it';

/*
 * Function from https://github.com/yzhang-gh/vscode-markdown/blob/ff0e18ff018c88e99c38a2686c63536f0df9d4a4/src/util/contextCheck.ts#L8
 * Licensed under MIT license
 */
export function isInFencedCodeBlock(
   doc: vscode.TextDocument,
   lineIndex: number
): boolean {
   const tokens = md().parse(doc.getText(), {});

   for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === 'fence' && token.map && token.map[0] === lineIndex) {
         return true;
      }
   }

   return false;
}

/*
 * Function from https://github.com/yzhang-gh/vscode-markdown/blob/ff0e18ff018c88e99c38a2686c63536f0df9d4a4/src/util/contextCheck.ts#L23
 * Licensed under MIT license
 */
export function mathEnvCheck(
   doc: vscode.TextDocument,
   pos: vscode.Position
): 'display' | 'inline' | '' {
   const docText = doc.getText();
   const crtOffset = doc.offsetAt(pos);
   const crtLine = doc.lineAt(pos.line);

   const lineTextBefore = crtLine.text.substring(0, pos.character);
   const lineTextAfter = crtLine.text.substring(pos.character);

   if (
      /(?:^|[^\$])\$(?:[^ \$].*)??\\\w*$/.test(lineTextBefore) &&
      lineTextAfter.includes('$')
   ) {
      // Inline math
      return 'inline';
   } else {
      const textBefore = docText.substring(0, crtOffset);
      const textAfter = docText.substring(crtOffset);
      let matches = textBefore.match(/\$\$/g);
      if (
         matches !== null &&
         matches.length % 2 !== 0 &&
         textAfter.includes('$$')
      ) {
         // $$ ... $$
         return 'display';
      } else {
         return '';
      }
   }
}
