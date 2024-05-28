import { availableTemplateVariables } from '@/internal/utils/templates/variables/available';

export function findUnmappedVariables(
  templateVariables: Array<string | null>,
): Array<string> {
  return templateVariables.filter(
    (templateVariable) =>
      !availableTemplateVariables.includes(templateVariable),
  );
}
