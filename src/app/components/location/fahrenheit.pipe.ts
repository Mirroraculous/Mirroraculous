import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fahrenheit'
})
export class FahrenheitPipe implements PipeTransform {

    public transform(value: any, args?: any): any {
        return ((value * (9 / 5)) + 32).toFixed(2);
    }

}