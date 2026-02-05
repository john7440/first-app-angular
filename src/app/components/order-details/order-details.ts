
import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.services';
import { Order } from '../../model/customer.model';


@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})

export class OrderDetailsComponent{
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly orders = inject(OrderService);
    private readonly auth = inject(AuthService);

    order$: Observable<Order> = this.route.paramMap.pipe(
        map(pm => Number(pm.get('id'))),
        switchMap(id => this.orders.getOrderById(id)),
        map(order => {
        const user = this.auth.getCurrentUser();
        if (!user) {
            this.router.navigateByUrl('/orders');
            throw new Error('Not authenticated');
        }
        const orderUserId = Number(order.userId); 
        if (!Number.isFinite(orderUserId) || orderUserId !== user.id) {
            this.router.navigateByUrl('/orders');
            throw new Error('Forbidden');
        }

        return order;
        })
    );
}