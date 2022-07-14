import type MarkdownIt = require('markdown-it');
import { getConfig } from './utils';

import * as sup from 'markdown-it-sup';
import * as sub from 'markdown-it-sub';
import * as mark from 'markdown-it-mark';
import * as underline from 'markdown-it-plugin-underline';
import * as abbr from 'markdown-it-abbr';
import * as deflist from 'markdown-it-deflist';
import * as tasks from 'markdown-it-task-lists';
import * as footnote from 'markdown-it-footnote';
import * as emoji from 'markdown-it-emoji';
import * as multiMdTable from 'markdown-it-multimd-table';
import mermaid from '@jwevans/markdown-it-mermaid';
import admonition from '@jwevans/markdown-it-admonitions';
import lineNumbers from '@jwevans/markdown-it-code-block-line-numbers';
import titledCode from '@jwevans/markdown-it-titled-code-blocks';
import highlightInlineCode from '@jwevans/markdown-it-highlight-inline-code';

export function extendMarkdownIt(md: MarkdownIt) {
   const config = {
      superscript: getConfig('superscript', true),
      subscript: getConfig('subscript', true),
      highlight: getConfig('highlight', true),
      underline: getConfig('underline', true),
      abbreviations: getConfig('abbreviations', true),
      definitionLists: getConfig('definitionLists', true),
      taskLists: getConfig('taskLists', true),
      footnotes: getConfig('footnotes', true),
      emoji: getConfig('emoji', true),
      enhancedTables: getConfig('enhancedTables', true),
      mermaid: getConfig('mermaid', true),
      admonitions: getConfig('admonitions', true),
      lineNumbers: getConfig('lineNumbers', true),
      titledCode: getConfig('titledCode', true),
      highlightInlineCode: getConfig('highlightInlineCode', true),
   };

   if (config.superscript) {
      md.use(sup);
   }
   if (config.subscript) {
      md.use(sub);
   }
   if (config.highlight) {
      md.use(mark);
   }
   if (config.underline) {
      md.use(underline);
   }
   if (config.abbreviations) {
      md.use(abbr);
   }
   if (config.definitionLists) {
      md.use(deflist);
   }
   if (config.taskLists) {
      md.use(tasks);
   }
   if (config.footnotes) {
      md.use(footnote);
   }
   if (config.emoji) {
      md.use(emoji);
   }
   if (config.enhancedTables) {
      md.use(multiMdTable, {
         multiline: true,
         rowspan: true,
         headerless: true,
      });
   }
   if (config.mermaid) {
      md.use(mermaid);
   }
   if (config.admonitions) {
      md.use(admonition);
   }
   if (config.lineNumbers) {
      md.use(lineNumbers);
   }
   if (config.titledCode) {
      md.use(titledCode);
   }
   if (config.highlightInlineCode) {
      md.use(highlightInlineCode);
   }

   return md;
}
