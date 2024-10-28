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
  
  showFirstForm = true;
  showSecondFrom = false;


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
          this.formModel.reset();
          this.disabled1.set(false);
          console.log("Muy bien");
        },
        error:(err)=>{
          toast.error(err)
          toast.error('Error al enviar código: ' + err.message);
        },

    });
  }  
  } 

  onSavePass(){

    const ContraseñaDTO: ContraseñaNueva ={
      userId : Number(this.formModel.controls.email.value()),
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
