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

   return md;
}
