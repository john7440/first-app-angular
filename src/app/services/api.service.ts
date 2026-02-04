import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getAll<T>(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}/${endpoint}`).pipe(
      map(items => this.normalizeIds(items)), // Normalise les IDs
      catchError(this.handleError)
    );
  }

  getById<T>(endpoint: string, id: number | string): Observable<T> {
    const numericId = Number(id);
    return this.http.get<T>(`${this.apiUrl}/${endpoint}/${numericId}`).pipe(
      map(item => this.normalizeId(item)),
      catchError(this.handleError)
    );
  }

  create<T>(endpoint: string, data: Partial<T>): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data).pipe(
      map(item => this.normalizeId(item)),
      catchError(this.handleError)
    );
  }

  update<T>(endpoint: string, id: number | string, data: Partial<T>): Observable<T> {
    const numericId = Number(id);
    return this.http.put<T>(`${this.apiUrl}/${endpoint}/${numericId}`, data).pipe(
      map(item => this.normalizeId(item)),
      catchError(this.handleError)
    );
  }

  patch<T>(endpoint: string, id: number | string, data: Partial<T>): Observable<T> {
    const numericId = Number(id);
    return this.http.patch<T>(`${this.apiUrl}/${endpoint}/${numericId}`, data).pipe(
      map(item => this.normalizeId(item)),
      catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string, id: number | string): Observable<T> {
    const numericId = Number(id);
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}/${numericId}`).pipe(
      catchError(this.handleError)
    );
  }

  getWithParams<T>(endpoint: string, params: any): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}/${endpoint}`, { params }).pipe(
      map(items => this.normalizeIds(items)),
      catchError(this.handleError)
    );
  }

 
  private normalizeId<T>(item: T): T {
    if (item && typeof item === 'object' && 'id' in item) {
      return { ...item, id: Number((item as any).id) };
    }
    return item;
  }

  private normalizeIds<T>(items: T[]): T[] {
    return items.map(item => this.normalizeId(item));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}