/* eslint-disable @typescript-eslint/naming-convention */
import { renameSync, writeFileSync } from 'fs';
import * as packageJson from './package.json';
import * as languages from './markdown.embedded-languages.json';
import * as customLanguages from './markdown.custom-embedded-languages.json';

const grammars = packageJson.contributes.grammars;

const newPackageJson = packageJson;

const embeddedLanguages: { [key: string]: string } = {};

for (const language of languages.concat(customLanguages)) {
   const injectionPoints = language.contentName.split(/\s+/);
   injectionPoints.forEach((injectionPoint) => {
      embeddedLanguages[injectionPoint] = language.name;
   });
}

newPackageJson.contributes.grammars = grammars.map((grammar) => {
   if (grammar.scopeName === 'text.html.markdown') {
      return {
         ...grammar,
         embeddedLanguages: {
            ...grammar?.embeddedLanguages,
            ...embeddedLanguages,
            'source.js': 'javascript',
            'source.css': 'css',
         },
      };
   } else {
      return grammar;
   }
});

renameSync('./package.json', './package.old.json');

writeFileSync('./package.json', JSON.stringify(newPackageJson, null, 2));
