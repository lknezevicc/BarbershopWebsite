import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  standalone: false
})
export class SortPipe implements PipeTransform {

  transform<T>(items: T[], sortField: string, sortOrder: 'asc' | 'desc' = 'asc'): T[] {
    if (!items || !sortField) {
      return items;
    }

    return items.sort((a, b) => {
      const valueA = this.getNestedValue(a, sortField.split('.'));
      const valueB = this.getNestedValue(b, sortField.split('.'));

      let comparison = 0;
      if (valueA > valueB) {
        comparison = 1;
      } else if (valueA < valueB) {
        comparison = -1;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  private getNestedValue(object: any, keys: string[]): any {
    return keys.reduce((value, key) => value?.[key], object);
  }

}
