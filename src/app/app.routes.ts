import { Routes } from '@angular/router';
import { TrainingsComponent } from './components/trainings/trainings';   
import { CartComponent } from './components/cart/cart';
import { CheckoutComponent } from './components/checkout/checkout';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'trainings' },
  { path: 'trainings', component: TrainingsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '**', redirectTo: 'trainings' }
];
