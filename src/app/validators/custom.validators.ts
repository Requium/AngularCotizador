import { AbstractControl } from '@angular/forms';

export function ValidatePorcentaje(control: AbstractControl) {
    if (control.value !== undefined && control.value > 100) {
      return { validPorcentaje: true };
    }
    return null;
  }