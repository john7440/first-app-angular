import { inject, Injectable} from '@angular/core';
import { ApiService } from './api.service';
import { map, Observable } from 'rxjs';
import { Customer } from '../model/customer.model';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'customers';

    getAllCustomers(): Observable<Customer[]>{
        return this.api.getAll<Customer>(this.endpoint);
    }

    getCustomerBytId(id: number): Observable<Customer>{
        return this.api.getById<Customer>(this.endpoint, id);
    }

    createCustomer(customer: Omit<Customer, 'id'>): Observable<Customer>{
        return this.api.create<Customer>(this.endpoint, customer);
    }

    updateCustomer(id:number, customer: Partial<Customer>): Observable<Customer> {
        return this.api.update<Customer>(this.endpoint, id,customer);
    }

    deleteCustomer(id: number): Observable<void>{
        return this.api.delete<Customer>(this.endpoint, id).pipe(map(()=> void 0));
    }

}