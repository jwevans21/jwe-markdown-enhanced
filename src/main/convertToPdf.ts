import type MarkdownIt = require('markdown-it');
import * as vscode from 'vscode';

import { launch, PDFOptions, PaperFormat } from 'puppeteer';

import { getConfig, toHtml } from '../common/utils';

export function convertToPdf(md: MarkdownIt) {
   return vscode.commands.registerCommand(
      'jwe-markdown-enhanced.convertToPdf',
      () => {
         const editor = vscode.window.activeTextEditor;

         if (!editor) {
            vscode.window.showErrorMessage('Error: No editor is active');
            return;
         }
         if (editor.document.languageId !== 'markdown') {
            vscode.window.showErrorMessage('Error: Not a markdown file');
            return;
         }

         const document = editor.document;
         const content = document.getText();
         const filePathArray = document.uri.path.split('/');

         const uri = document.uri;
         const saveURI = uri.fsPath.replace(/.(\w+)$/, '.pdf');
         const tempPath = vscode.Uri.parse(
            `${uri.path.replace('.md', '')}.${Date.now()}.tmp.html`
         );
         vscode.window.withProgress(
            {
               location: vscode.ProgressLocation.Notification,
               title: 'Converting to PDF',
            },
            async () => {
               const browser = await launch({
                  ignoreDefaultArgs: ['--disable-extensions'],
               });
               const page = await browser.newPage();
               const html = await toHtml(md, content);
               await vscode.workspace.fs.writeFile(tempPath, Buffer.from(html));
               await page.goto(tempPath.fsPath, {
                  waitUntil: 'networkidle2',
               });

               const config = {
                  path: saveURI,
                  format: getConfig<PaperFormat>('pdf.format', 'Letter'),
                  displayHeaderFooter: getConfig(
                     'pdf.displayHeaderFooter',
                     false
                  ),
                  headerTemplate: getConfig('pdf.headerTemplate', ''),
                  footerTemplate: getConfig('pdf.footerTemplate', ''),
                  landscape: getConfig('pdf.landscape', false),
                  timeout: getConfig('pdf.timeout', 30000),
                  printBackground: true,
                  margin: getConfig('pdf.margin', {
                     top: '1cm',
                     right: '1cm',
                     bottom: '1cm',
                     left: '1cm',
                  }),
               };

               await page.pdf(config);
               await browser.close();
               await vscode.workspace.fs.delete(tempPath);
            }
         );
      }
   );
}
