import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TestComponent } from './test/test.component';
import { AuthGuard } from './auth/login.guard';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { VentasComponent } from './admin/ventas/ventas.component';
import { PedidoStateComponent } from './pedidos/pedido-state/pedido-state.component';
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
import { ProductosComponent } from './admin/productos/productos.component';
import { ReservesComponent } from './reserves/reserves.component';
import { MateriasPrimasComponent } from './admin/materias-primas/materias-primas.component';
import { IngredientesComponent } from './admin/ingredientes/ingredientes.component';
import { ProveedoresComponent } from './admin/proveedores/proveedores.component';
import { PedidosUserComponent } from './pedidos/pedidos-user/pedidos-user.component';
import { ProcessStateComponent } from './pedidos/pedido-state/process-state/process-state.component';
import { AdminGuard } from './auth/admin.guard';
import { UsersComponent } from './admin/users/users.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { InventarioMPComponent } from './admin/inventario-mp/inventario-mp.component';
import { InventarioPostresComponent } from './admin/inventario-postres/inventario-postres.component';
import { CheckoutReComponent } from './reserves/checkout/checkout.component';
import { MateriasPrimasProveedorComponent } from './admin/materias-primas-proveedor/materias-primas-proveedor.component';
import { EspaciosComponent } from './admin/espacios/espacios.component';
import { EstatusComponent } from './admin/reservas/estatus/estatus.component';
import { ClienteComponent } from './reserves/cliente/cliente.component';




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
    component: HomeComponent,
    data: { breadcrumb: 'Products' }
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'ventas',
        component: VentasComponent
      },
      {
        path: 'compras',
        component: ComprasComponent
      },
      {
        path: 'productos',
        component: ProductosComponent
      },
      {
        path: 'materias-primas',
        component: MateriasPrimasComponent
      },
      {
        path: 'ingredientes',
        component: IngredientesComponent
      },
      {
        path: 'inventarioMP',
        component: InventarioMPComponent
      },
      {
        path: 'inventarioPostres',
        component: InventarioPostresComponent
      },
      {
        path: 'proveedores',
        component: ProveedoresComponent
      },
      {
        path: 'materiaProveedor',
        component: MateriasPrimasProveedorComponent
      },
      {
        path:'users',
        component: UsersComponent
      },
      {
        path: 'reserves',
        component: ReservesComponent
      },
      {
        path: 'places',
        component: PlaceComponent
      },{
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'espacios',
        component: EspaciosComponent
      },
      {
        path: 'reservas',
        component: EstatusComponent
      }

    ]
  },
  {
    path: 'orders',
    canActivate: [AuthenticatedGuard],
    component: PedidosUserComponent,

  },
  {
    path: 'estatus/:id',
    canActivate: [AuthenticatedGuard],
    component: PedidoStateComponent,

  },
  {
    path: 'estatus',
    canActivate: [AuthenticatedGuard],
    component: PedidoStateComponent
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    data: {
      breadcrumb: [
        {
          label: 'Products',
          route: '/products'
        },
        {
          label: 'Product Details',
          route: '/products/:id'
        }
      ]
    }
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
    canActivate: [AuthenticatedGuard],
    component: DescriptionPlaceComponent
  },
  {
    path: 'reserves',
    canActivate: [AuthenticatedGuard],
    component: ReservesComponent
  },
  {
    path:'reserves/checkout',
    canActivate: [AuthenticatedGuard],
    component: CheckoutReComponent
  },

  {
    path: 'reserves/:id',
    canActivate: [AuthenticatedGuard],
    component: ReservesComponent
  },
  {
    path: 'reservesCliente',
    canActivate: [AuthenticatedGuard],
    component: ClienteComponent
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
    canActivate: [AuthenticatedGuard],
    component: AddDireccionComponent,
  },
  {
    path:'edit/payment',
    canActivate: [AuthenticatedGuard],
    component: AddCardComponent
  }
];
