import type MarkdownIt = require('markdown-it');
import { getConfig } from './utils';
import type Renderer from 'markdown-it/lib/renderer';
import type Token from 'markdown-it/lib/token';

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
//import lineNumbers from '@jwevans/markdown-it-code-block-line-numbers';
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

function rangesToArray(range: string): number[] {
   const [start, end] = range.split('-').map((x) => parseInt(x));
   if (!end) {
      return [start];
   } else {
      if (end < start) {
         throw new Error(`Invalid range: ${range}`);
      }
      return Array.from({ length: end - start + 1 }).map((_, i) => start + i);
   }
}

function lineNumbers(md: MarkdownIt) {
   function proxy(
      tokens: Token[],
      idx: number,
      options: MarkdownIt.Options,
      env: any,
      slf: Renderer
   ) {
      return slf.renderToken(tokens, idx, options);
   }
   const defaultFenceRenderer = md.renderer.rules.fence || proxy;

   md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
      const token = tokens[idx];
      const [, showNumbers, start] =
         new RegExp(
            /(show-?(?:line)?-?numbers|line-?numbers)(?:="?(\d+)"?)?/,
            'i'
         ).exec(token.info) || [];

      if (!showNumbers) {
         return defaultFenceRenderer(tokens, idx, options, env, slf);
      } else {
         const startIndex = start ? parseInt(start) : 1;
         const rendered = defaultFenceRenderer(tokens, idx, options, env, slf);
         const lines = rendered
            .replace(/<code(.*)>/, '$&\n')
            .split('\n')
            .filter((x) => x.trim().length > 0);
         console.log(token.content);
         console.log('lines', lines[0]);

         const [, , modifier, highlightedLinesRaw] =
            new RegExp(/(highlight|hl)=(!|\?)?([\d,-]+)/, 'i').exec(
               token.info
            ) || [];
         let highlightOffset = 0;
         if (modifier) {
            if (modifier === '!') {
               highlightOffset = startIndex - 1;
            } else {
               highlightOffset = 0;
            }
         }

         const highlightedLines = highlightedLinesRaw
            ? highlightedLinesRaw.split(',').flatMap(rangesToArray)
            : [];

         md.options.highlight =
            md.options.highlight || ((str) => md.utils.escapeHtml(str));

         const highlightedCode = md.options.highlight(
            token.content,
            token.info.split(/\s+/)[0],
            token.attrs?.toString() || ''
         );

         console.log('highlightedCode', highlightedCode);

         const code = highlightedCode.split('\n');
         console.log('code', code);

         return [
            `<pre><code class="language-${
               token.info.split(/\s+/)[0]
            }"><table><tbody>`,
            ...code.map((line, index) => {
               const shouldHighlight = highlightedLines.includes(
                  index + 1 + highlightOffset
               );
               return [
                  `<tr class="code-block--line${
                     shouldHighlight ? ' highlight' : ''
                  }">`,
                  `<td class="code-block--line-number">${
                     startIndex + index
                  }</td>`,
                  `<td class="code-block--line-content">${line}</td>`,
                  `</tr>`,
               ].join('\n');
            }),
            '</tbody></table></code></pre>',
         ].join('\n');
      }
   };
}
