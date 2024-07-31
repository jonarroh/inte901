import { Component, signal } from '@angular/core';
import { HlmInputDirective } from '~/components/ui-input-helm/src';
import { FormsModule } from '@angular/forms';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { SignalInputDirective, V, createFormField, createFormGroup } from 'ng-signal-forms';
import { RegisterService } from '../register.service';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { es } from 'date-fns/locale';
import { User } from '~/lib/types';


@Component({
  selector: 'FormComponent',
  standalone: true,
  imports: [
    HlmInputDirective,
    FormsModule,
    SignalInputDirective,
    LucideAngularModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

  constructor(private  registerServe : RegisterService, private router : Router){}  // 

  disabled = signal(false);

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

    this.disabled.set(true);
    
    const user : User = {
      creditCards:[],
      direcciones: [],
      estatus: "Activo",
      email: this.formModel.controls.email.value(),
      id: 0,
      lastName: this.formModel.controls.lastname.value(),
      name: this.formModel.controls.name.value(),
      password: this.formModel.controls.password.value(),
      role: "Cliente",
      token: "",

    }

    console.log(user);

    if(this.formModel.valid()){

      this.registerServe.registerUser(user).subscribe({
        next: (response) =>{
          console.log(response);
          console.log('Usuario registrado correctamente');

          this.router.navigate(['/login']);
        },
        error : (error)=>{
          
          this.disabled.set(false); // para que no le pueda dar al boton de clic
          console.error(error)

        

        },
        complete: () =>{
          this.disabled.set(false);
        }
      })

    }

    
  }

}
