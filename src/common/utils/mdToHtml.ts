import * as vscode from 'vscode';

import type MarkdownIt = require('markdown-it');
import { loadStyle } from './loadStyle';

export function toHtml(md: MarkdownIt, markdown: string): string {
   const styles = vscode.workspace
      .getConfiguration('markdown')
      .get('styles', []);
   const scripts = vscode.workspace
      .getConfiguration('markdown')
      .get('scripts', []);
   return [
      '<!DOCTYPE html>',
      '<html lang="en">',
      '<head>',
      '<meta charset="UTF-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '<title>Document</title>',
      ...styles.map((style) => loadStyle(style)),
      '</head>',
      '<body>',
      md.render(markdown),
      ...scripts.map((script) => `<script src="${script}"></script>`),
      '</body>',
      '</html>',
   ].join('\n');
}
