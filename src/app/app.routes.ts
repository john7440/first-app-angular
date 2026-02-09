import { Routes } from '@angular/router';
import { TrainingsComponent } from './components/trainings/trainings';   
import { CartComponent } from './components/cart/cart';
import { CheckoutComponent } from './components/checkout/checkout';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found';
import { LoginComponent } from './components/login/login';
import { AdminComponent } from './components/admin/admin';
import { adminGuard } from './guards/admin-guard';
import { OrderListComponent } from './components/order-list/order-list';
import { OrderDetailsComponent } from './components/order-details/order-details';
import { UserComponent } from './components/user/user';
import { RegisterComponent } from './components/register/register';


export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'trainings' },
  { path: 'trainings', component: TrainingsComponent },
  { path: 'login', component: LoginComponent},
  { path: 'orders', component: OrderListComponent},
  { path: 'orders/:id', component: OrderDetailsComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard]},
  { path: 'users', component: UserComponent, canActivate: [adminGuard]},
  { path: 'register', component: RegisterComponent},
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '**', component: PageNotFoundComponent }, 
];
