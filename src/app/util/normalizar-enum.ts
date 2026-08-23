import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'normalizarEnum' })
export class NormalizarEnum implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value)
      return '';

    if (value.includes('_')) {
      value = value.replace('_', (' '));
    }
    value = value.toLowerCase();
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
