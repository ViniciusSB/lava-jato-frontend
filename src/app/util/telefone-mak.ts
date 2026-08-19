import { Directive, HostListener } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[telefoneMask]'
})
export class TelefoneMaskDirective {
  constructor(private ngModel: NgModel) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    let value: string = event.target.value.replace(/\D/g, '');

    // limita a exatamente 11 dígitos
    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    // aplica máscara (xx)xxxxx-xxxx
    if (value.length >= 2) {
      const ddd = value.substring(0, 2);
      const numero = value.substring(2);

      if (numero.length > 5) {
        value = `(${ddd})${numero.substring(0, 5)}-${numero.substring(5)}`;
      } else {
        value = `(${ddd})${numero}`;
      }
    }

    event.target.value = value;
    this.ngModel.viewToModelUpdate(value);
  }
}
