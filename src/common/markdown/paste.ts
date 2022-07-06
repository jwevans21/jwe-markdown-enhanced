import * as vscode from 'vscode';

/*
 * Function from https://github.com/yzhang-gh/vscode-markdown/blob/ff0e18ff018c88e99c38a2686c63536f0df9d4a4/src/formatting.ts#L259
 * Licensed under the MIT license
 */
function createLinkRegex(): RegExp {
   // unicode letters range(must not be a raw string)
   const ul = '\\u00a1-\\uffff';
   // IP patterns
   const ipv4_re =
      '(?:25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}';
   const ipv6_re = '\\[[0-9a-f:\\.]+\\]'; // simple regex (in django it is validated additionally)

   // Host patterns
   const hostname_re =
      '[a-z' + ul + '0-9](?:[a-z' + ul + '0-9-]{0,61}[a-z' + ul + '0-9])?';
   // Max length for domain name labels is 63 characters per RFC 1034 sec. 3.1
   const domain_re = '(?:\\.(?!-)[a-z' + ul + '0-9-]{1,63}(?<!-))*';

   const tld_re =
      '' +
      '\\.' + // dot
      '(?!-)' + // can't start with a dash
      '(?:[a-z' +
      ul +
      '-]{2,63}' + // domain label
      '|xn--[a-z0-9]{1,59})' + // or punycode label
      '(?<!-)' + // can't end with a dash
      '\\.?'; // may have a trailing dot
   const host_re = '(' + hostname_re + domain_re + tld_re + '|localhost)';
   const pattern =
      '' +
      '^(?:[a-z0-9\\.\\-\\+]*)://' + // scheme is not validated (in django it is validated additionally)
      '(?:[^\\s:@/]+(?::[^\\s:@/]*)?@)?' + // user: pass authentication
      '(?:' +
      ipv4_re +
      '|' +
      ipv6_re +
      '|' +
      host_re +
      ')' +
      '(?::\\d{2,5})?' + // port
      '(?:[/?#][^\\s]*)?' + // resource path
      '$'; // end of string
   return new RegExp(pattern, 'i');
}

const linkRegex = createLinkRegex();

/*
 * Function Modified from https://github.com/yzhang-gh/vscode-markdown/blob/ff0e18ff018c88e99c38a2686c63536f0df9d4a4/src/formatting.ts#L202
 * Licensed under the MIT license
 */
export async function paste() {
   let editor = vscode.window.activeTextEditor;
   if (!editor) {
      return; // No open text editor
   }

   const selection = editor.selection;

   if (
      selection.isSingleLine &&
      !linkRegex.test(editor.document.getText(selection))
   ) {
      const text = await vscode.env.clipboard.readText();
      if (text && linkRegex.test(text)) {
         return editor.insertSnippet(
            new vscode.SnippetString(`[$TM_SELECTED_TEXT$0](${text})`)
         );
      }
      return vscode.commands.executeCommand(
         'editor.action.clipboardPasteAction'
      );
   }
   return vscode.commands.executeCommand('editor.action.clipboardPasteAction');
}
