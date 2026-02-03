import { Routes } from '@angular/router';
import { TrainingsComponent } from './components/trainings/trainings';   
import { CartComponent } from './components/cart/cart';
import { CheckoutComponent } from './components/checkout/checkout';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found';
import { LoginComponent } from './components/login/login';
import { AdminComponent } from './components/admin/admin';
import { adminGuard } from './guards/admin-guard';


export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'trainings' },
  { path: 'trainings', component: TrainingsComponent },
  { path: 'login', component: LoginComponent},
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard]},
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '**', component: PageNotFoundComponent }, 
];
