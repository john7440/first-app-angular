import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User } from '../model/auth.model';
import { Router } from '@angular/router';
import { CryptoService } from './crypto.service';
import { enc } from 'crypto-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly crypto = inject(CryptoService);
  private readonly url = '/assets/login.json';

  currentUser = signal<User | null>(null);

  //clé localstorage
  private readonly STORAGE_KEY = 'auth_user_data';

  constructor(){
    this.loadUserFromStorage();
  }

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
