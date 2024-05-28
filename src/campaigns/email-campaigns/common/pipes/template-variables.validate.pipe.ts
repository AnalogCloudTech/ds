import { BadRequestException, PipeTransform } from '@nestjs/common';
import { get } from 'lodash';
import { extractTemplateVariables } from '@/internal/utils/templates/variables/extract';
import { findUnmappedVariables } from '@/internal/utils/templates/variables/find-unmapped-variables';

export class TemplateVariablesValidatePipe implements PipeTransform {
  transform(dto: object): object {
    const content = <string>get(dto, 'content', '');
    const variables = extractTemplateVariables(content);
    const unmapped = findUnmappedVariables(variables);

    if (get(unmapped, ['length']) > 0) {
      throw new BadRequestException([
        `Unmapped template variables found: {{${unmapped.join('}}, {{')}}}`,
      ]);
    }
    return dto;
  }
}
