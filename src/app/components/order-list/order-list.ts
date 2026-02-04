import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Observable, of } from 'rxjs';
import { Order } from '../../model/customer.model';
import { AuthService } from '../../services/auth.services';



@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-list.html',
})

export class OrderListComponent{
    private readonly orders = inject(OrderService)
    private readonly auth = inject(AuthService);

    orders$: Observable<Order[]> = (() => {
    const user = this.auth.getCurrentUser();
    return user ? this.orders.getOrderByUser(user.id) : of([]);
  })();
}