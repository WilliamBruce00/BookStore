import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormant',
  standalone: true,
})
export class DateFormantPipe implements PipeTransform {
  transform(value: number, type: string): string {
    let result: string = '';

    const date = new Date(value);

    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const month =
      date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const year = date.getFullYear();

    switch (type) {
      case 'dd/mm/yyyy':
        result = `${day}/${month}/${year}`;
        break;
      case 'dd':
        result = `${day}`;
        break;
      case 'mm':
        result = `${month}`;
        break;
      case 'yyyy':
        result = `${year}`;
        break;
    }

    return result;
  }
}
