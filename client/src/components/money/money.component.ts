import { Component, Input } from '@angular/core';
import clsx from 'clsx';

@Component({
  standalone: true,
  selector: 'app-money',
  template: `
    <span [class]="clsx(baseClass)">
      {{ formattedAmount }}
    </span>
  `,
})
export class MoneyComponent {
  @Input() amount: number = 0; // Puede ser un entero o un decimal
  @Input() baseClass: string = 'text-lg text-gray-800'; // Estilos base

  get formattedAmount(): string {
    // Convertir el valor a centavos
    const amountInCents = Math.round(this.amount * 100);
    const dollars = Math.floor(amountInCents / 100);
    const cents = Math.abs(amountInCents % 100).toString().padStart(2, '0'); // Agregar ceros a la izquierda si es necesario
    
    // Agregar ceros a la izquierda para los dólares si es menor que 10
    const formattedDollars = dollars.toString().padStart(2, '0');
    
    return `$${formattedDollars}.${cents}`;
  }

  clsx = clsx;
}
