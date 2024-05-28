import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: true,
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number): string {
    let result: string = '';

    if (value) {
      result = value.toLocaleString();
    }

    return result;
  }
}
