import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiService{
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    getAll<T>(endpoint: string): Observable<T[]>{
        return this.http.get<T[]>(`${this.apiUrl}/${endpoint}`).pipe(
            catchError(this.handleError)
        );
    }

    getWithParams<T>(endpoint: string, params: any): Observable<T[]> {
        return this.http.get<T[]>(`${this.apiUrl}/${endpoint}`, { params }).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse){
        let errorMsg = 'Une erreur est survenue';

        if(error.error instanceof ErrorEvent){
            errorMsg = 'Erreur: ${error.error.message}';
        } else {
            errorMsg = 'Erreur n: ${error.status}\nMessage: ${error.message}';
        }
        console.error(errorMsg);
        return throwError(() => new Error(errorMsg));
    }
}