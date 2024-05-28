import { filter, get, map } from 'lodash';

export function extractTemplateVariables(
  content: string,
): Array<string> | null {
  const regex = /{{(.*?)}}/gm;
  const matches = [...content.matchAll(regex)];
  const variables = map(matches, (match) => {
    return get(match, '[1]');
  });

  return filter(variables);
}
