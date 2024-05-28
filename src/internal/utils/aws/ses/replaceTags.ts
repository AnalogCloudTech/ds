export type Replacer = {
  [key: string]: string;
};

/**
 * Receive a raw string and replace tags on that string
 * @param body string
 * @param replacers Replacer
 * @return string
 */
export function replaceTags(body: string, replacers: Replacer) {
  return Object.keys(replacers).reduce((acc, idx) => {
    if (replacers[idx]) {
      const findRegex = new RegExp(idx, 'g');

      return acc.replace(findRegex, replacers[idx]);
    }
    return acc;
  }, body);
}

export function replaceTagsOnDemandEmails(body: string, replacers: Replacer) {
  return Object.keys(replacers).reduce((acc, idx) => {
    const findRegex = new RegExp(`{{${idx}}}`, 'g');

    return acc.replace(findRegex, replacers[idx]);
  }, body);
}
