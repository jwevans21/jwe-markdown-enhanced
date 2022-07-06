import { getConfig } from '../utils';

import { styleByWrapping } from '../styleByWrapping';

export function italic() {
   const italic = getConfig('italic', '*');
   return styleByWrapping(italic, italic);
}
