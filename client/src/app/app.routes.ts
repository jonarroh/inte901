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
<<<<<<< HEAD
import { DescriptionPlaceComponent } from './place/description-place/description-place.component';
=======
import { ComprasComponent } from './admin/compras/compras.component';
>>>>>>> 22bf5ed63d4cf108635f143c35eb1a45a41cef6a

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
      },{
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
  }
];
