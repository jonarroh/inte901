import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createFormField, createFormGroup, V , SignalInputDirective} from 'ng-signal-forms';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import { HlmInputDirective } from '~/components/ui-input-helm/src';
import { ContraseñaNueva } from '~/lib/types';
import { RecuServiceService } from './recu-service.service';
import { toast } from 'ngx-sonner';
import { RightSeccionComponent } from '../login/right-seccion/right-seccion.component';

@Component({
  selector: 'app-contra-recu',
  standalone: true,
  imports: [
    FormsModule,
    SignalInputDirective,
    HlmButtonDirective,
    HlmInputDirective,
    RightSeccionComponent
  ],
  templateUrl: './contra-recu.component.html',
  styleUrl: './contra-recu.component.css'
})
export class ContraRecuComponent {

  disabled = signal(false);
  disabled1 = signal(false);

  constructor (private codeService:RecuServiceService){}


  protected formModel = createFormGroup({
    email: createFormField('',{
      validators: [
        {
          validator: V.required(),
          message: 'El codigo de verificación es requerido',
          
        },
        {
          validator: V.maxLength(8),
          message: 'El codigo debe de ser de 8 caracteres',

        }
      ]
    }),
    id: createFormField('',{
      
    })
  });

  protected formModel2 = createFormGroup({
    codigoVer: createFormField('',{

      validators: [
        {
          validator: V.required(),
          message: 'El codigo es requerido',
        },
        {
          validator: V.maxLength(8),
          message: 'El codigo debe de ser de 8 caracteres',
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
    if(this.formModel.valid()){
      this.disabled1.set(true);
      this.codeService.sendCode(this.formModel.controls.email.value(), Number(this.formModel.controls.id.value()))
      .subscribe({
        complete: ()=>{
          this.formModel.reset();
          this.disabled1.set(false);
          console.log("Muy bien");
        },
        error:(err)=>{
          toast.error(err)
        },

    });
  }  
  } 

  onSavePass(){

    const ContraseñaDTO: ContraseñaNueva ={
      userId : Number(this.formModel.controls.id.value()),
      newPassword : this.formModel2.controls.password.controls.confirmPassword.value(),
      code : this.formModel2.controls.codigoVer.value(),
    };

    if(this.formModel2.valid()){
      this.codeService.savePass(ContraseñaDTO)
      .subscribe({
        complete: ()=>{
          console.log("Muy bien");
        },
        error:(err)=>{
          toast.error(err)
        },

      })
    }



  }





}
