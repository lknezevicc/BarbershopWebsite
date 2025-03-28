import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: false
})
export class FilterPipe implements PipeTransform {

  transform<T>(items: T[], searchText: string, fieldName: keyof T): T[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    
    searchText = searchText.toLowerCase();
    return items.filter(item => {
      const fieldValue = item[fieldName];
      if (typeof fieldValue === 'string') {
        return fieldValue.toLowerCase().includes(searchText);
      }
      return false;
    });
  }

}
