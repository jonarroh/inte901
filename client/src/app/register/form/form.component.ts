import { Component, signal } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { FormsModule } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { SignalInputDirective, V, createFormField, createFormGroup } from 'ng-signal-forms';


@Component({
  selector: 'FormComponent',
  standalone: true,
  imports: [
    HlmInputDirective,
    FormsModule,
    SignalInputDirective
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

  protected formModel = createFormGroup({
    name: createFormField('',{
      validators:[
        {
          validator: V.required(),
          message: 'El nombre es requerido',
        },
        {
          validator: V.maxLength(80),
          message: 'El nombre debe tener menos de 80 caracteres',
        }
      ],
    }),
    lastname: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'Los apellidos son requeridos',
        },
        {
          validator: V.maxLength(100),
          message: 'Los apellidos deben tener menos de 100 caracteres',
        }
      ],
    }),
    email: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'El correo es requerido',
        },
        {
          validator: V.maxLength(50),
          message: 'El correo debe tener menos de 50 caracteres',
        }
      ],
    }),
    password: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'La contraseña es requerida',
        },
        {
          validator: V.maxLength(20),
          message: 'La contraseña debe tener menos de 20 caracteres',
        },
      ],
    }),
    dob: createFormField('', {
      validators: [
        {
          validator: V.required(),
          message: 'La fecha de nacimiento es requerida',
        },
      ],
    }),


  });

  register(){
    console.log('Register');
    console.log(this.formModel.value());
    console.log(this.formModel.valid());
    console.log(this.formModel.errors());

    
  }

}



