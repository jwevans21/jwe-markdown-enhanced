import { workspace } from 'vscode';

export function getConfig<T>(key: string, defaultValue: T): T {
   return workspace
      .getConfiguration('jwe-markdown-enhanced')
      .get(key, defaultValue);
}
