/* eslint-disable @typescript-eslint/naming-convention */
import type { Repository } from './types';

import { getFencedCodeBlocks } from './getFencedCodeBlocks';

export async function addBlockSyntaxToRepository(repository: Repository) {
   //#region Separator
   repository.separator = {
      match: new RegExp(/(^|\G)[ ]{0,3}([\*\-\_])([ ]{0,2}\2){2,}[ \\t]*$\n?/)
         .source,
      name: 'meta.separator.markdown',
   };
   //#endregion Separator

   //#region Heading
   repository.heading = {
      match: new RegExp(/(?:^|\G)[ ]{0,3}(#{1,6}\s+(.*?)(\s+#{1,6})?\s*)$/)
         .source,
      captures: {
         '1': {
            patterns: [
               {
                  match: new RegExp(/(#{6})\s+(.*?)(?:\s+(#+))?\s*$/).source,
                  name: 'heading.6.markdown',
                  captures: {
                     '1': {
                        name: 'punctuation.definition.heading.markdown',
                     },
                     '2': {
                        name: 'entity.name.section.markdown',
                        patterns: [
                           {
                              include: '#inline',
                           },
                           {
                              include: 'text.html.derivative',
                           },
                        ],
                     },
                     '3': {
                        name: 'punctuation.definition.heading.markdown',
                     },
                  },
               },
               {
                  match: new RegExp(/(#{5})\s+(.*?)(?:\s+(#+))?\s*$/).source,
                  name: 'heading.5.markdown',
                  captures: {
                     '1': {
                        name: 'punctuation.definition.heading.markdown',
                     },
                     '2': {
                        name: 'entity.name.section.markdown',
                        patterns: [
                           {
                              include: '#inline',
                           },
                           {
                              include: 'text.html.derivative',
                           },
                        ],
                     },
                     '3': {
                        name: 'punctuation.definition.heading.markdown',
                     },
                  },
               },
               {
                  match: new RegExp(/(#{4})\s+(.*?)(?:\s+(#+))?\s*$/).source,
                  name: 'heading.4.markdown',
                  captures: {
                     '1': {
                        name: 'punctuation.definition.heading.markdown',
                     },
                     '2': {
                        name: 'entity.name.section.markdown',
                        patterns: [
                           {
                              include: '#inline',
                           },
                           {
                              include: 'text.html.derivative',
                           },
                        ],
                     },
                     '3': {
                        name: 'punctuation.definition.heading.markdown',
                     },
                  },
               },
               {
                  match: new RegExp(/(#{3})\s+(.*?)(?:\s+(#+))?\s*$/).source,
                  name: 'heading.3.markdown',
                  captures: {
                     '1': {
                        name: 'punctuation.definition.heading.markdown',
                     },
                     '2': {
                        name: 'entity.name.section.markdown',
                        patterns: [
                           {
                              include: '#inline',
                           },
                           {
                              include: 'text.html.derivative',
                           },
                        ],
                     },
                     '3': {
                        name: 'punctuation.definition.heading.markdown',
                     },
                  },
               },
               {
                  match: new RegExp(/(#{2})\s+(.*?)(?:\s+(#+))?\s*$/).source,
                  name: 'heading.2.markdown',
                  captures: {
                     '1': {
                        name: 'punctuation.definition.heading.markdown',
                     },
                     '2': {
                        name: 'entity.name.section.markdown',
                        patterns: [
                           {
                              include: '#inline',
                           },
                           {
                              include: 'text.html.derivative',
                           },
                        ],
                     },
                     '3': {
                        name: 'punctuation.definition.heading.markdown',
                     },
                  },
               },
               {
                  match: new RegExp(/(#{1})\s+(.*?)(?:\s+(#+))?\s*$/).source,
                  name: 'heading.1.markdown',
                  captures: {
                     '1': {
                        name: 'punctuation.definition.heading.markdown',
                     },
                     '2': {
                        name: 'entity.name.section.markdown',
                        patterns: [
                           {
                              include: '#inline',
                           },
                           {
                              include: 'text.html.derivative',
                           },
                        ],
                     },
                     '3': {
                        name: 'punctuation.definition.heading.markdown',
                     },
                  },
               },
            ],
         },
      },
      name: 'markup.heading.markdown',
      patterns: [
         {
            include: '#inline',
         },
      ],
   };

   repository['heading-setext'] = {
      patterns: [
         {
            match: new RegExp(/^(={3,})(?=[ \t]*$\n?)/).source,
            name: 'markup.heading.setext.1.markdown',
         },
         {
            match: new RegExp(/^(-{3,})(?=[ \\t]*$\\n?)/).source,
            name: 'markup.heading.setext.2.markdown',
         },
      ],
   };
   //#endregion Heading

   //#region Blockquote
   repository.blockquote = {
      begin: new RegExp(/(^|\G)[ ]{0,3}(>) ?/).source,
      captures: {
         '2': {
            name: 'punctuation.definition.quote.begin.markdown',
         },
      },
      name: 'markup.quote.markdown',
      patterns: [
         {
            include: '#block',
         },
      ],
      while: new RegExp(/(^|\G)\s*(>) ?/).source,
   };
   //#endregion Blockquote

   //#region Lists
   repository.lists = {
      patterns: [
         {
            begin: new RegExp(/(^|\G)([ ]{0,3})([*+-])([ \t])/).source,
            beginCaptures: {
               '3': {
                  name: 'punctuation.definition.list.begin.markdown',
               },
            },
            comment: 'Currently does not support un-indented second lines.',
            name: 'markup.list.unnumbered.markdown',
            patterns: [
               {
                  include: '#block',
               },
               {
                  include: '#list_paragraph',
               },
            ],
            while: new RegExp(/((^|\G)([ ]{2,4}|\t))|(^[ \t]*$)/).source,
         },
         {
            begin: new RegExp(/(^|\G)([ ]{0,3})([0-9]+[.)])([ \t])/).source,
            beginCaptures: {
               '3': {
                  name: 'punctuation.definition.list.begin.markdown',
               },
            },
            name: 'markup.list.numbered.markdown',
            patterns: [
               {
                  include: '#block',
               },
               {
                  include: '#list_paragraph',
               },
            ],
            while: new RegExp(/((^|\G)([ ]{2,4}|\t))|(^[ \t]*$)/).source,
         },
      ],
   };
   //#endregion Lists

   //#region List Paragraph
   repository.list_paragraph = {
      begin: new RegExp(/(^|\G)(?=\S)(?![*+->]\s|[0-9]+\.\s)/).source,
      name: 'meta.paragraph.markdown',
      patterns: [
         {
            include: '#inline',
         },
         {
            include: 'text.html.derivative',
         },
         {
            include: '#heading-setext',
         },
      ],
      while: new RegExp(
         /(^|\G)(?!\s*$|#|[ ]{0,3}([-*_>][ ]{2,}){3,}[ \t]*$\n?|[ ]{0,3}[*+->]|[ ]{0,3}[0-9]+\.)/
      ).source,
   };
   //#endregion List Paragraph

   //#region Fenced Code Blocks
   repository = await getFencedCodeBlocks(repository);
   //#endregion Fenced Code Blocks

   //#region Raw Block
   repository.raw_block = {
      begin: new RegExp(/(^|\G)([ ]{4}|\t)/).source,
      name: 'markup.raw.block.markdown',
      while: new RegExp(/(^|\G)([ ]{4}|\t)/).source,
   };
   //#endregion Raw Block

   //#region Link Def
   repository['link-def'] = {
      captures: {
         '1': {
            name: 'punctuation.definition.constant.markdown',
         },
         '2': {
            name: 'constant.other.reference.link.markdown',
         },
         '3': {
            name: 'punctuation.definition.constant.markdown',
         },
         '4': {
            name: 'punctuation.separator.key-value.markdown',
         },
         '5': {
            name: 'punctuation.definition.link.markdown',
         },
         '6': {
            name: 'markup.underline.link.markdown',
         },
         '7': {
            name: 'punctuation.definition.link.markdown',
         },
         '8': {
            name: 'markup.underline.link.markdown',
         },
         '9': {
            name: 'string.other.link.description.title.markdown',
         },
         '10': {
            name: 'punctuation.definition.string.begin.markdown',
         },
         '11': {
            name: 'punctuation.definition.string.end.markdown',
         },
         '12': {
            name: 'string.other.link.description.title.markdown',
         },
         '13': {
            name: 'punctuation.definition.string.begin.markdown',
         },
         '14': {
            name: 'punctuation.definition.string.end.markdown',
         },
         '15': {
            name: 'string.other.link.description.title.markdown',
         },
         '16': {
            name: 'punctuation.definition.string.begin.markdown',
         },
         '17': {
            name: 'punctuation.definition.string.end.markdown',
         },
      },
      match: '(?x)\n  \\s*            # Leading whitespace\n  (\\[)([^]]+?)(\\])(:)    # Reference name\n  [ \\t]*          # Optional whitespace\n  (?:(<)([^\\>]+?)(>)|(\\S+?))      # The url\n  [ \\t]*          # Optional whitespace\n  (?:\n      ((\\().+?(\\)))    # Match title in parens…\n    | ((").+?("))    # or in double quotes…\n    | ((\').+?(\'))    # or in single quotes.\n  )?            # Title is optional\n  \\s*            # Optional whitespace\n  $\n',
      name: 'meta.link.reference.def.markdown',
   };
   //#endregion Link Def

   //#region HTML
   repository.html = {
      patterns: [
         {
            begin: '(^|\\G)\\s*(<!--)',
            captures: {
               '1': {
                  name: 'punctuation.definition.comment.html',
               },
               '2': {
                  name: 'punctuation.definition.comment.html',
               },
            },
            end: '(-->)',
            name: 'comment.block.html',
         },
         {
            begin: '(?i)(^|\\G)\\s*(?=<(script|style|pre)(\\s|$|>)(?!.*?</(script|style|pre)>))',
            end: '(?i)(.*)((</)(script|style|pre)(>))',
            endCaptures: {
               '1': {
                  patterns: [
                     {
                        include: 'text.html.derivative',
                     },
                  ],
               },
               '2': {
                  name: 'meta.tag.structure.$4.end.html',
               },
               '3': {
                  name: 'punctuation.definition.tag.begin.html',
               },
               '4': {
                  name: 'entity.name.tag.html',
               },
               '5': {
                  name: 'punctuation.definition.tag.end.html',
               },
            },
            patterns: [
               {
                  begin: '(\\s*|$)',
                  patterns: [
                     {
                        include: 'text.html.derivative',
                     },
                  ],
                  while: '(?i)^(?!.*</(script|style|pre)>)',
               },
            ],
         },
         {
            begin: '(?i)(^|\\G)\\s*(?=</?[a-zA-Z]+[^\\s/&gt;]*(\\s|$|/?>))',
            patterns: [
               {
                  include: 'text.html.derivative',
               },
            ],
            while: '^(?!\\s*$)',
         },
         {
            begin: '(^|\\G)\\s*(?=(<[a-zA-Z0-9\\-](/?>|\\s.*?>)|</[a-zA-Z0-9\\-]>)\\s*$)',
            patterns: [
               {
                  include: 'text.html.derivative',
               },
            ],
            while: '^(?!\\s*$)',
         },
      ],
   };
   //#endregion HTML

   //#region Paragraph
   repository.paragraph = {
      begin: '(^|\\G)[ ]{0,3}(?=\\S)',
      name: 'meta.paragraph.markdown',
      patterns: [
         {
            include: '#inline',
         },
         {
            include: 'text.html.derivative',
         },
         {
            include: '#heading-setext',
         },
      ],
      while: '(^|\\G)((?=\\s*[-=]{3,}\\s*$)|[ ]{4,}(?=\\S))',
   };
   //#endregion Paragraph

   return repository;
}
