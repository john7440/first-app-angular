import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Order } from '../model/customer.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly api = inject(ApiService);
  private readonly endpoint = 'orders';

  getAllOrders(): Observable<Order[]>{
    return this.api.getAll<Order>(this.endpoint);
  }

  getOrderById(id: number): Observable<Order>{
    return this.api.getById<Order>(this.endpoint, id);
  }

  createOrder(order: Omit<Order,'id'>): Observable<Order> {
    return this.api.create<Order>(this.endpoint, order);
  }

  getOrderByCustomer(customerId: number): Observable<Order[]>{
    return this.api.getWithParams<Order>(this.endpoint, { customerId });
  }

  getOrderByUser(userId: number): Observable<Order[]>{
    return this.api.getWithParams<Order>(this.endpoint, { userId });
  }

}