import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User } from '../model/auth.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly url = '/assets/login.json';

  currentUser = signal<User | null>(null);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url).pipe(
      catchError((err) => {
        console.error('Erreur chargement login.json', err);
        return throwError(() => err);
      })
    );
  }

  isAdmin(user: User): boolean{
    return user.role === 'admin';
  }

  login(email: string, password: string): Observable<User>{
    return this.getUsers().pipe(
        map(users => {
            const user = users.find(u => u.email === email && u.password === password);

            if(!user){
                throw new Error('Email ou mdp incorrect!');
            }

            this.setCurrentUser(user); //TODO 
            return user;
        }),
        catchError((err) => {
            console.error('Erreor de connexion', err);
            return throwError(()=>err);
        })
    )
  }

  private setCurrentUser(user: User): void{
    this.currentUser.set(user);
    const userToStore = {...user};
    delete (userToStore as any).password;
    localStorage.setItem('currentUser', JSON.stringify(userToStore))
  }
  
}
