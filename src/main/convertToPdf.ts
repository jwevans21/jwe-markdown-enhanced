import type MarkdownIt = require('markdown-it');
import * as vscode from 'vscode';

import * as puppeteer from 'puppeteer';

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

         const markdown = editor.document.getText();
         const htmlFilePath = editor.document.uri
            .toString()
            .replace(/\.md$/, `.${Date.now()}.tmp.html`);
         const htmlFileURI = vscode.Uri.parse(htmlFilePath);
         vscode.window.withProgress(
            {
               location: vscode.ProgressLocation.Notification,
               title: 'Converting to PDF',
            },
            async () => {
               const html = toHtml(md, markdown);
               const browser = await puppeteer.launch();
               const page = await browser.newPage();
               await vscode.workspace.fs.writeFile(
                  htmlFileURI,
                  Buffer.from(html)
               );
               await page.goto(htmlFileURI.toString());
               const config: puppeteer.PDFOptions = {
                  displayHeaderFooter: getConfig<boolean>(
                     'pdf.displayHeaderFooter',
                     false
                  ),
                  headerTemplate: getConfig('pdf.headerTemplate', ''),
                  footerTemplate: getConfig('pdf.footerTemplate', ''),
                  landscape: getConfig<boolean>('pdf.landscape', false),
                  format: getConfig<puppeteer.PaperFormat>(
                     'pdf.format',
                     'Letter'
                  ),
                  margin: {
                     bottom: getConfig('pdf.margin.bottom', 0),
                     left: getConfig('pdf.margin.left', 0),
                     right: getConfig('pdf.margin.right', 0),
                     top: getConfig('pdf.margin.top', 0),
                  },
                  timeout: getConfig<number>('pdf.timeout', 30000),
               };
               try {
                  const pdf = await page.pdf(config);

                  const pdfFilePath = editor.document.uri
                     .toString()
                     .replace('.md', '.pdf');

                  console.log(pdfFilePath);

                  await vscode.workspace.fs.writeFile(
                     vscode.Uri.parse(pdfFilePath),
                     pdf
                  );
                  await browser.close();
                  await vscode.workspace.fs.delete(htmlFileURI);
               } catch (e) {
                  console.log(e);
               }
            }
         );
      }
   );
}
