import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
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
  
}
