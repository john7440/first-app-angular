import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User } from '../model/auth.model';
import { Router } from '@angular/router';
import { CryptoService } from './crypto.service';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly crypto = inject(CryptoService);

  currentUser = signal<User | null>(null);

  //clé localstorage
  private readonly STORAGE_KEY = 'auth_user_data';

  constructor(){
    this.loadUserFromStorage();
  }

  getUsers(): Observable<User[]> {
    return this.api.getAll<User>('users');
  }

  isAdmin(user: User): boolean{
    return user.role === 'admin';
  }

  login(email: string, password: string): Observable<User>{
    return this.api.getWithParams<User>('users', { email, password}).pipe(
        map(users => {
            if(users.length === 0){
                throw new Error('Email ou mdp incorrect!');
            }
            const user = users[0];
            this.setCurrentUser(user); 
            return user;
        }),
        catchError((err) => {
            console.error('Erreor de connexion', err);
            return throwError(()=>err);
        })
    )
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/trainings'])
  }

  //enregistrement dans le local storage 
  private setCurrentUser(user: User): void{
    const userToStore = {...user};
    
    const encryptedData = this.crypto.encrypt(userToStore);
    localStorage.setItem(this.STORAGE_KEY, encryptedData)

    this.currentUser.set(userToStore);
  }

  getCurrentUser(): User | null {
     return this.currentUser();
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  private loadUserFromStorage(): void {
    const encryptedData = localStorage.getItem(this.STORAGE_KEY);
    if (encryptedData){
       try{
        const decryptedData = this.crypto.decrypt(encryptedData);

        if (decryptedData) {
          this.currentUser.set(decryptedData);
        } else{
          localStorage.removeItem(decryptedData);
        }
       }catch (error){
        console.error("Erreur dechiffrement: ", error);
        localStorage.removeItem(this.STORAGE_KEY);
       }
    }
  }
  
}
