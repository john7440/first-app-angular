import { inject, Injectable} from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { User } from '../model/auth.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
    private readonly api = inject(ApiService);
    private readonly endpoint = 'users';

    getAllUser(): Observable<User[]>{
        return this.api.getAll<User>(this.endpoint);
    }

    getUserById(id: number): Observable<User>{
        return this.api.getById<User>(this.endpoint, id);
    }

    createUser(user: Omit<User, 'id'>): Observable<User>{
        return this.api.create<User>(this.endpoint, user);
    }

    updateUser(id:number, customer: Partial<User>): Observable<User> {
        return this.api.update<User>(this.endpoint, id,customer);
    }

    deleteUser(id: number): Observable<void>{
        return this.api.delete(this.endpoint, id);
    }

}