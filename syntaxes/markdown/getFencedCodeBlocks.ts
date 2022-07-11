/* eslint-disable @typescript-eslint/naming-convention */
import type { Language, RepoItem, Repository } from './types';

import * as languages from '../../markdown.embedded-languages.json';
import * as customLanguages from '../../markdown.custom-embedded-languages.json';

export async function getFencedCodeBlocks(repository: Repository) {
   const langs = languages.concat(customLanguages) as Language[];
   //#region Custom Languages For Fenced Code Blocks
   //#endregion Custom Languages For Fenced Code Blocks

   const fenced_code_block: RepoItem = {
      patterns: [],
   };

   //#region Fenced Code Blocks With Languages
   for (const language of langs) {
      const identifiers = language.identifiers.join('|');

      fenced_code_block.patterns?.push({
         include: `#fenced_code_block_${language.name}`,
      });

      repository[`fenced_code_block_${language.name}`] = {
         begin: `(^|\\G)(\\s*)(\`{3,}|~{3,})\\s*(?i:(${identifiers})((\\s+|:|,|\\{|\\?)[^\`~]*)?$)`,
         name: 'markup.fenced_code.block.markdown',
         end: new RegExp(/(^|\G)(\2|\s{0,3})(\3)\s*$/).source,
         beginCaptures: {
            3: {
               name: 'punctuation.definition.markdown',
            },
            4: {
               name: 'fenced_code.block.language.markdown',
            },
            5: {
               name: 'fenced_code.block.language.attributes.markdown',
            },
         },
         endCaptures: {
            3: {
               name: 'punctuation.definition.markdown',
            },
         },
         patterns: [
            {
               begin: new RegExp(/(^|\G)(\s*)(.*)/).source,
               while: new RegExp(/(^|\G)(?!\s*([`~]{3,})\s*$)/).source,
               contentName: language.contentName,
               patterns: [
                  {
                     include: language.include,
                  },
               ],
            },
         ],
      };
   }
   //#endregion Fenced Code Blocks With Languages

   //#region Fenced Code Block Unknown Language
   fenced_code_block.patterns?.push({
      include: '#fenced_code_block_unknown',
   });

   repository.fenced_code_block_unknown = {
      begin: new RegExp(/(^|\G)(\s*)(`{3,}|~{3,})\s*(?=([^`~]*)?$)/).source,
      beginCaptures: {
         '3': {
            name: 'punctuation.definition.markdown',
         },
         '4': {
            name: 'fenced_code.block.language',
         },
      },
      end: new RegExp(/(^|\G)(\2|\s{0,3})(\3)\s*$/).source,
      endCaptures: {
         '3': {
            name: 'punctuation.definition.markdown',
         },
      },
      name: 'markup.fenced_code.block.markdown',
   };
   //#endregion Fenced Code Block Unknown Language

   repository.fenced_code_block = fenced_code_block;

   return repository;
}
