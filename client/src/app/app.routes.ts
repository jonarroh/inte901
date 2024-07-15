import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TestComponent } from './test/test.component';
import { AuthGuard } from './auth/login.guard';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { VentasComponent } from './admin/ventas/ventas.component';
import { PedidoStateComponent } from './pedido-state/pedido-state.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { PlaceComponent } from './place/place.component';

import { DescriptionPlaceComponent } from './place/description-place/description-place.component';
import { ComprasComponent } from './admin/compras/compras.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AuthenticatedGuard } from './auth/route.guard';
import { EditUserComponent } from './edit-user/edit-user.component';
import { DireccionComponent } from './checkout/direccion/direccion.component';
import { TarjetaComponent } from './checkout/tarjeta/tarjeta.component';
import { DetailsComponent } from './checkout/details/details.component';
import { AddDireccionComponent } from './checkout/add-direccion/add-direccion.component';
import { AddCardComponent } from './checkout/add-card/add-card.component';




export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard], // Este guardia redirige a los usuarios autenticados fuera del login
  },
  {
    path: 'test',
    component: TestComponent // Este guardia protege las rutas autenticadas
  },
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: 'products',
    component: HomeComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'ventas',
        component: VentasComponent
      },
      {
        path: 'compras',
        component: ComprasComponent
      }
    ]
  },
  {
    path: 'estatus',
    component: PedidoStateComponent
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent
  },
  {
    path: 'places',
    component: PlaceComponent
  },
  {

    path: 'description/:id',
    component: DescriptionPlaceComponent
  },{

    path: 'places/:id',
    component: DescriptionPlaceComponent
  },

  {

    path:'checkout',
    component: CheckoutComponent,
    canActivate: [AuthenticatedGuard],
    children:[
      {
        path:'address',
        component: DireccionComponent,
      },
      {
        path:'payment',
        component: TarjetaComponent
      },
      {
        'path': 'details',
        'component': DetailsComponent
      }
    ]
  },
  {
    path: 'profile',
    component: EditUserComponent,
    canActivate: [AuthenticatedGuard]
  },
  {
    path:'edit/address',
    component: AddDireccionComponent,
  },
  {
    path:'edit/payment',
    component: AddCardComponent
  }
];
