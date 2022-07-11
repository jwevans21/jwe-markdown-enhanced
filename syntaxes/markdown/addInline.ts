/* eslint-disable @typescript-eslint/naming-convention */
import type { Repository } from './types';

export const inlineRules = [
   {
      include: '#escape',
   },
   {
      include: '#ampersand',
   },
   {
      include: '#bracket',
   },
   {
      include: '#raw',
   },
   {
      include: '#bold',
   },
   {
      include: '#italic',
   },
   {
      include: '#underline',
   },
   {
      include: '#mark',
   },
   {
      include: '#image-inline',
   },
   {
      include: '#link-inline',
   },
   {
      include: '#link-inet',
   },
   {
      include: '#link-email',
   },
   {
      include: '#image-ref',
   },
   {
      include: '#link-ref-literal',
   },
   {
      include: '#link-ref',
   },
   {
      include: '#link-ref-shortcut',
   },
   {
      include: '#strikethrough',
   },
];

export function addInlineSyntaxToRepository(repository: Repository) {
   //#region Ampersand
   repository.ampersand = {
      comment:
         'Markdown will convert this for us. We match it so that the HTML grammar will not mark it up as invalid.',
      match: '&(?!([a-zA-Z0-9]+|#[0-9]+|#x[0-9a-fA-F]+);)',
      name: 'meta.other.valid-ampersand.markdown',
   };
   //#endregion Ampersand

   //#region Bold
   repository.bold = {
      begin: '(?x) (?<open>(\\*\\*(?=\\w)|(?<!\\w)\\*\\*|(?<!\\w)\\b__))(?=\\S) (?=\n  (\n    <[^>]*+>              # HTML tags\n    | (?<raw>`+)([^`]|(?!(?<!`)\\k<raw>(?!`))`)*+\\k<raw>\n                      # Raw\n    | \\\\[\\\\`*_{}\\[\\]()#.!+\\->]?+      # Escapes\n    | \\[\n    (\n        (?<square>          # Named group\n          [^\\[\\]\\\\]        # Match most chars\n          | \\\\.            # Escaped chars\n          | \\[ \\g<square>*+ \\]    # Nested brackets\n        )*+\n      \\]\n      (\n        (              # Reference Link\n          [ ]?          # Optional space\n          \\[[^\\]]*+\\]        # Ref name\n        )\n        | (              # Inline Link\n          \\(            # Opening paren\n            [ \\t]*+        # Optional whitespace\n            <?(.*?)>?      # URL\n            [ \\t]*+        # Optional whitespace\n            (          # Optional Title\n              (?<title>[\'"])\n              (.*?)\n              \\k<title>\n            )?\n          \\)\n        )\n      )\n    )\n    | (?!(?<=\\S)\\k<open>).            # Everything besides\n                      # style closer\n  )++\n  (?<=\\S)(?=__\\b|\\*\\*)\\k<open>                # Close\n)\n',
      captures: {
         '1': {
            name: 'punctuation.definition.bold.markdown',
         },
      },
      end: '(?<=\\S)(\\1)',
      name: 'markup.bold.markdown',
      patterns: [
         {
            applyEndPatternLast: 1,
            begin: '(?=<[^>]*?>)',
            end: '(?<=>)',
            patterns: [
               {
                  include: 'text.html.derivative',
               },
            ],
         },
         ...inlineRules,
      ],
   };
   //#endregion Bold

   //#region Bracket
   repository.bracket = {
      comment:
         'Markdown will convert this for us. We match it so that the HTML grammar will not mark it up as invalid.',
      match: '<(?![a-zA-Z/?\\$!])',
      name: 'meta.other.valid-bracket.markdown',
   };
   //#endregion Bracket

   //#region Escape
   repository.escape = {
      match: '\\\\[-`*_#+.!(){}\\[\\]\\\\>]',
      name: 'constant.character.escape.markdown',
   };
   //#endregion Escape

   //#region Image-Inline
   repository['image-inline'] = {
      captures: {
         '1': {
            name: 'punctuation.definition.link.description.begin.markdown',
         },
         '2': {
            name: 'string.other.link.description.markdown',
         },
         '4': {
            name: 'punctuation.definition.link.description.end.markdown',
         },
         '5': {
            name: 'punctuation.definition.metadata.markdown',
         },
         '6': {
            name: 'punctuation.definition.link.markdown',
         },
         '7': {
            name: 'markup.underline.link.image.markdown',
         },
         '8': {
            name: 'punctuation.definition.link.markdown',
         },
         '9': {
            name: 'string.other.link.description.title.markdown',
         },
         '10': {
            name: 'punctuation.definition.string.markdown',
         },
         '11': {
            name: 'punctuation.definition.string.markdown',
         },
         '12': {
            name: 'string.other.link.description.title.markdown',
         },
         '13': {
            name: 'punctuation.definition.string.markdown',
         },
         '14': {
            name: 'punctuation.definition.string.markdown',
         },
         '15': {
            name: 'string.other.link.description.title.markdown',
         },
         '16': {
            name: 'punctuation.definition.string.markdown',
         },
         '17': {
            name: 'punctuation.definition.string.markdown',
         },
         '18': {
            name: 'punctuation.definition.metadata.markdown',
         },
      },
      match: '(?x)\n  (\\!\\[)((?<square>[^\\[\\]\\\\]|\\\\.|\\[\\g<square>*+\\])*+)(\\])\n                # Match the link text.\n  (\\()            # Opening paren for url\n    (<?)(\\S+?)(>?)      # The url\n    [ \\t]*          # Optional whitespace\n    (?:\n        ((\\().+?(\\)))    # Match title in parens…\n      | ((").+?("))    # or in double quotes…\n      | ((\').+?(\'))    # or in single quotes.\n    )?            # Title is optional\n    \\s*            # Optional whitespace\n  (\\))\n',
      name: 'meta.image.inline.markdown',
   };
   //#endregion Image-Inline

   //#region Image-Ref
   repository['image-ref'] = {
      captures: {
         '1': {
            name: 'punctuation.definition.link.description.begin.markdown',
         },
         '2': {
            name: 'string.other.link.description.markdown',
         },
         '4': {
            name: 'punctuation.definition.link.description.end.markdown',
         },
         '5': {
            name: 'punctuation.definition.constant.markdown',
         },
         '6': {
            name: 'constant.other.reference.link.markdown',
         },
         '7': {
            name: 'punctuation.definition.constant.markdown',
         },
      },
      match: '(\\!\\[)((?<square>[^\\[\\]\\\\]|\\\\.|\\[\\g<square>*+\\])*+)(\\])[ ]?(\\[)(.*?)(\\])',
      name: 'meta.image.reference.markdown',
   };
   //#endregion Image-Ref

   //#region Italic
   repository.italic = {
      begin: '(?x) (?<open>(\\*(?=\\w)|(?<!\\w)\\*|(?<!\\w)\\b_))(?=\\S)                # Open\n  (?=\n    (\n      <[^>]*+>              # HTML tags\n      | (?<raw>`+)([^`]|(?!(?<!`)\\k<raw>(?!`))`)*+\\k<raw>\n                        # Raw\n      | \\\\[\\\\`*_{}\\[\\]()#.!+\\->]?+      # Escapes\n      | \\[\n      (\n          (?<square>          # Named group\n            [^\\[\\]\\\\]        # Match most chars\n            | \\\\.            # Escaped chars\n            | \\[ \\g<square>*+ \\]    # Nested brackets\n          )*+\n        \\]\n        (\n          (              # Reference Link\n            [ ]?          # Optional space\n            \\[[^\\]]*+\\]        # Ref name\n          )\n          | (              # Inline Link\n            \\(            # Opening paren\n              [ \\t]*+        # Optional whtiespace\n              <?(.*?)>?      # URL\n              [ \\t]*+        # Optional whtiespace\n              (          # Optional Title\n                (?<title>[\'"])\n                (.*?)\n                \\k<title>\n              )?\n            \\)\n          )\n        )\n      )\n      | \\k<open>\\k<open>                   # Must be bold closer\n      | (?!(?<=\\S)\\k<open>).            # Everything besides\n                        # style closer\n    )++\n    (?<=\\S)(?=_\\b|\\*)\\k<open>                # Close\n  )\n',
      captures: {
         '1': {
            name: 'punctuation.definition.italic.markdown',
         },
      },
      end: '(?<=\\S)(\\1)((?!\\1)|(?=\\1\\1))',
      name: 'markup.italic.markdown',
      patterns: [
         {
            applyEndPatternLast: 1,
            begin: '(?=<[^>]*?>)',
            end: '(?<=>)',
            patterns: [
               {
                  include: 'text.html.derivative',
               },
            ],
         },
         ...inlineRules,
      ],
   };
   //#endregion Italic

   //#region Link-Email
   repository['link-email'] = {
      captures: {
         '1': {
            name: 'punctuation.definition.link.markdown',
         },
         '2': {
            name: 'markup.underline.link.markdown',
         },
         '4': {
            name: 'punctuation.definition.link.markdown',
         },
      },
      match: "(<)((?:mailto:)?[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*)(>)",
      name: 'meta.link.email.lt-gt.markdown',
   };
   //#endregion Link-Email

   //#region Link-Inet
   repository['link-inet'] = {
      captures: {
         '1': {
            name: 'punctuation.definition.link.markdown',
         },
         '2': {
            name: 'markup.underline.link.markdown',
         },
         '3': {
            name: 'punctuation.definition.link.markdown',
         },
      },
      match: '(<)((?:https?|ftp)://.*?)(>)',
      name: 'meta.link.inet.markdown',
   };
   //#endregion Link-Inet

   //#region Link-Inline
   repository['link-inline'] = {
      captures: {
         '1': {
            name: 'punctuation.definition.link.title.begin.markdown',
         },
         '2': {
            name: 'string.other.link.title.markdown',
         },
         '4': {
            name: 'punctuation.definition.link.title.end.markdown',
         },
         '5': {
            name: 'punctuation.definition.metadata.markdown',
         },
         '7': {
            name: 'punctuation.definition.link.markdown',
         },
         '8': {
            name: 'markup.underline.link.markdown',
         },
         '9': {
            name: 'punctuation.definition.link.markdown',
         },
         '10': {
            name: 'markup.underline.link.markdown',
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
         '18': {
            name: 'string.other.link.description.title.markdown',
         },
         '19': {
            name: 'punctuation.definition.string.begin.markdown',
         },
         '20': {
            name: 'punctuation.definition.string.end.markdown',
         },
         '21': {
            name: 'punctuation.definition.metadata.markdown',
         },
      },
      match: '(?x)\n  (\\[)((?<square>[^\\[\\]\\\\]|\\\\.|\\[\\g<square>*+\\])*+)(\\])\n                # Match the link text.\n  (\\()            # Opening paren for url\n    # The url\n      [ \\t]*\n      (\n         (<)([^<>\\n]*)(>)\n         | ((?<url>(?>[^\\s()]+)|\\(\\g<url>*\\))*)\n      )\n      [ \\t]*\n    # The title  \n    (?:\n        ((\\()[^()]*(\\)))    # Match title in parens…\n      | ((")[^"]*("))    # or in double quotes…\n      | ((\')[^\']*(\'))    # or in single quotes.\n    )?            # Title is optional\n    \\s*            # Optional whitespace\n  (\\))\n',
      name: 'meta.link.inline.markdown',
   };
   //#endregion Link-Inline

   //#region Link-Ref
   repository['link-ref'] = {
      captures: {
         '1': {
            name: 'punctuation.definition.link.title.begin.markdown',
         },
         '2': {
            name: 'string.other.link.title.markdown',
         },
         '4': {
            name: 'punctuation.definition.link.title.end.markdown',
         },
         '5': {
            name: 'punctuation.definition.constant.begin.markdown',
         },
         '6': {
            name: 'constant.other.reference.link.markdown',
         },
         '7': {
            name: 'punctuation.definition.constant.end.markdown',
         },
      },
      match: '(?<![\\]\\\\])(\\[)((?<square>[^\\[\\]\\\\]|\\\\.|\\[\\g<square>*+\\])*+)(\\])(\\[)([^\\]]*+)(\\])',
      name: 'meta.link.reference.markdown',
   };
   //#endregion Link-Ref

   //#region Link-Ref-Literal
   repository['link-ref-literal'] = {
      captures: {
         '1': {
            name: 'punctuation.definition.link.title.begin.markdown',
         },
         '2': {
            name: 'string.other.link.title.markdown',
         },
         '4': {
            name: 'punctuation.definition.link.title.end.markdown',
         },
         '5': {
            name: 'punctuation.definition.constant.begin.markdown',
         },
         '6': {
            name: 'punctuation.definition.constant.end.markdown',
         },
      },
      match: '(?<![\\]\\\\])(\\[)((?<square>[^\\[\\]\\\\]|\\\\.|\\[\\g<square>*+\\])*+)(\\])[ ]?(\\[)(\\])',
      name: 'meta.link.reference.literal.markdown',
   };
   //#endregion Link-Ref-Literal

   //#region Link-Ref-Shortcut
   repository['link-ref-shortcut'] = {
      captures: {
         '1': {
            name: 'punctuation.definition.link.title.begin.markdown',
         },
         '2': {
            name: 'string.other.link.title.markdown',
         },
         '3': {
            name: 'punctuation.definition.link.title.end.markdown',
         },
      },
      match: '(?<![\\]\\\\])(\\[)(\\S+?)(\\])',
      name: 'meta.link.reference.markdown',
   };
   //#endregion Link-Ref-Shortcut

   //#region Raw
   repository.raw = {
      captures: {
         '1': {
            name: 'punctuation.definition.raw.markdown',
         },
         '3': {
            name: 'punctuation.definition.raw.markdown',
         },
      },
      match: '(`+)((?:[^`]|(?!(?<!`)\\1(?!`))`)*+)(\\1)',
      name: 'markup.inline.raw.string.markdown',
   };
   //#endregion Raw

   //#region Strikethrough
   repository.strikethrough = {
      captures: {
         '1': {
            name: 'punctuation.definition.strikethrough.markdown',
         },
         '2': {
            patterns: [
               {
                  applyEndPatternLast: 1,
                  begin: '(?=<[^>]*?>)',
                  end: '(?<=>)',
                  patterns: [
                     {
                        include: 'text.html.derivative',
                     },
                  ],
               },
               ...inlineRules,
            ],
         },
         '3': {
            name: 'punctuation.definition.strikethrough.markdown',
         },
      },
      match: '(~{2,})((?:[^~]|(?!(?<!~)\\1(?!~))~)*+)(\\1)',
      name: 'markup.strikethrough.markdown',
   };
   //#endregion Strikethrough

   //#region Underline
   repository.underline = {
      match: '(\\+{2})((?:[^\\+]|(?!(?<!\\+)\\1(?!\\+))\\+)*+)(\\1)',
      captures: {
         '1': {
            name: 'punctuation.definition.underline.markdown',
         },
         '2': {
            patterns: [
               {
                  applyEndPatternLast: 1,
                  begin: '(?=<[^>]*?>)',
                  end: '(?<=>)',
                  patterns: [
                     {
                        include: 'text.html.derivative',
                     },
                  ],
               },
               ...inlineRules,
            ],
         },
         '3': {
            name: 'punctuation.definition.underline.markdown',
         },
      },
      name: 'markup.underline.markdown',
   };
   //#endregion Underline

   //#region Mark
   repository.mark = {
      match: '(={2,})((?:[^=]|(?!(?<!=)\\1(?!=))=)*+)(\\1)',
      captures: {
         '1': {
            name: 'punctuation.definition.mark.markdown',
         },
         '2': {
            patterns: [
               {
                  applyEndPatternLast: 1,
                  begin: '(?=<[^>]*?>)',
                  end: '(?<=>)',
                  patterns: [
                     {
                        include: 'text.html.derivative',
                     },
                  ],
               },
               ...inlineRules,
            ],
         },
         '3': {
            name: 'punctuation.definition.mark.markdown',
         },
      },
      name: 'markup.mark.markdown',
   };
   //#endregion Mark

   return repository;
}
