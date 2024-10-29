import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createFormField, createFormGroup, V , SignalInputDirective} from 'ng-signal-forms';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { HlmInputDirective } from '~/components/ui-input-helm/src';
import { ContraseñaNueva } from '~/lib/types';
import { RecuServiceService } from './recu-service.service';
import { toast } from 'ngx-sonner';
import { RightSeccionComponent } from '../login/right-seccion/right-seccion.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contra-recu',
  standalone: true,
  imports: [
    FormsModule,
    SignalInputDirective,
    HlmButtonDirective,
    HlmInputDirective,
    RightSeccionComponent,
    CommonModule
  ],
  templateUrl: './contra-recu.component.html',
  styleUrl: './contra-recu.component.css'
})
export class ContraRecuComponent {
  
  showFirstForm = signal(true);
  showSecondForm = signal(false);
  


  disabled = signal(false);
  disabled1 = signal(false);

  constructor (private codeService:RecuServiceService){}


  protected formModel = createFormGroup({
    email: createFormField('',{
      validators: [
       {
        validator: V.required(),
        message: "El correo es requerido"
       }
      ],
    })
  });

  protected formModel2 = createFormGroup({
    codigoVer: createFormField('',{

      validators: [
        {
          validator: V.required(),
          message: 'El codigo es requerido',
        }
      ]
    }),
    password: createFormGroup(() => {
      const newPassword = createFormField('',{
        validators: [
          // {
          //   validator: V.pattern('decirde al chat que me de una expresion regular de contraseña super segura')
          // }
        ]
      })
    const confirmPassword = createFormField('', {
      validators: [
        {
          validator: V.equalsTo(newPassword.value),
        }
      ]
    });
    return {
      newPassword,
      confirmPassword
    }
  })});

  onSendCode(){
    const emailValue = this.formModel.controls.email.value();
    console.log("correo"+emailValue);
    console.log("si llego aqui");
    if(this.formModel.valid()){
      console.log("paso el if");
      this.disabled1.set(true);
      this.codeService.sendCode(emailValue)
      .subscribe({
        next: ()=>{
          localStorage.setItem('email', emailValue);
          this.formModel.reset();
          this.disabled1.set(false);
          this.showFirstForm.set(false);  // Ocultar el primer formulario
          this.showSecondForm.set(true); 
          toast.success('Código enviado correctamente, por favor revisa tu correo');
          
          console.log("Muy bien");
        },
        error:(err)=>{
          toast.error(err)
          toast.error('Error al enviar código: vuelva a intentarlo');
        },

    });
  }  
  } 

  onSavePass() {
  const emailFromLocalStorage = localStorage.getItem('email');
  const ContraseñaDTO: ContraseñaNueva = {
    email: emailFromLocalStorage || '',
    newPassword: this.formModel2.controls.password.controls.confirmPassword.value(),
    code: this.formModel2.controls.codigoVer.value(),
  };
  console.log("ContraseñaDTO", ContraseñaDTO);

  if (this.formModel2.valid()) {
    console.log("entro antes del muy bien");
    this.codeService.savePass(ContraseñaDTO)
      .subscribe({
        complete: () => {
          console.log("Muy bien");
          toast.success('Contraseña actualizada correctamente');
        },
        error: (err) => {
          // Aquí intentamos acceder al mensaje de error
          const errorMessage = err.error?.message || 'Error desconocido';
          toast.error('Error al actualizar contraseña: ' + errorMessage);
        },
      });
  }
}






}
