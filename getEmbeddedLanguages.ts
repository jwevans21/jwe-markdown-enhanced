import type { Language, Repository } from './syntaxes/markdown/types';
import axios from 'axios';
import { writeFileSync } from 'fs';

const url =
   'https://raw.githubusercontent.com/microsoft/vscode/main/extensions/markdown-basics/syntaxes/markdown.tmLanguage.json';

async function getEmbeddedLanguages() {
   const langs: Language[] = [];
   await axios
      .get(url)
      .then((raw) => raw.data)
      .then((data) => data.repository)
      .then((repo: Repository) => {
         return {
            keys: Object.keys(repo)
               .filter((key) => /^fenced_code_block_/.test(key))
               .filter((s) => s !== 'fenced_code_block_unknown'),
            data: repo,
         };
      })
      .then(({ keys, data }) => {
         for (let key of keys) {
            const language = key;
            const begin = data[key].begin || '';
            // @ts-ignore
            const contentName = data[key].patterns[0].contentName || '';
            // @ts-ignore
            const include = data[key].patterns[0].patterns[0].include || '';

            const identifiers = new RegExp(/\?i:\((.*)\)\(/).exec(begin) || [
               '',
               '',
            ];

            langs.push({
               name: language.replace('fenced_code_block_', ''),
               identifiers: identifiers[1].split('|'),
               contentName: contentName,
               include: include,
            });
         }
      });

   writeFileSync('./markdown.embedded-languages.json', JSON.stringify(langs, null, 2));
}

getEmbeddedLanguages();