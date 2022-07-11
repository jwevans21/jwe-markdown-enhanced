/* eslint-disable @typescript-eslint/naming-convention */
import type { Patterns, Repository } from './types';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { addBlockSyntaxToRepository } from './addBlock';
import { inlineRules, addInlineSyntaxToRepository } from './addInline';

async function generateSyntax() {
   const patterns: Patterns = [
      {
         include: '#frontmatter',
      },
      {
         include: '#block',
      },
   ];

   let repository: Repository = {};

   //#region Basic Rules
   repository.frontmatter = {
      contentName: 'meta.embedded.block.frontmatter',
      patterns: [
         {
            include: 'source.yaml',
         },
      ],
      begin: new RegExp(/^\A(-{3})\s*$/).source,
      end: new RegExp(/(^|\G)(-{3}|\.{3})\s*$/).source,
      beginCaptures: {
         1: {
            name: 'punctuation.definition.comment.markdown',
         },
      },
      endCaptures: {
         2: {
            name: 'punctuation.definition.comment.markdown',
         },
      },
   };

   repository.block = {
      patterns: [
         {
            include: '#separator',
         },
         {
            include: '#heading',
         },
         {
            include: '#blockquote',
         },
         {
            include: '#lists',
         },
         {
            include: '#fenced_code_block',
         },
         {
            include: '#raw_block',
         },
         {
            include: '#link-def',
         },
         {
            include: '#html',
         },
         {
            include: '#paragraph',
         },
      ],
   };
   //#endregion Basic Rules

   //#region Rules Included in Block

   repository = await addBlockSyntaxToRepository(repository);

   //#endregion Rules Included in Block

   //#region Inline Rules
   repository.inline = {
      patterns: inlineRules,
   };

   repository = addInlineSyntaxToRepository(repository);
   //#endregion Inline Rules

   //#region Create File
   const syntax = {
      $schema:
         'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json',
      scopeName: 'text.html.markdown',
      name: 'Markdown',
      patterns: patterns,
      repository: repository,
   };

   writeFileSync(
      join(__filename, '..', '..', 'markdown.tmlanguage.json'),
      JSON.stringify(syntax, null, 2)
   );
   //#endregion
}

generateSyntax();
