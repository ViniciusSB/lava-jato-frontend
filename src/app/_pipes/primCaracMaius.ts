import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'primCaracMaius' })
export class PrimCarcMaius implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}