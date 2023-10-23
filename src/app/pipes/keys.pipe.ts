import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {

  transform(value: any): [number, string][] {
    return Object.keys(value).filter(t => isNaN(+t)).map(t => [value[t], t]);
  }

}
