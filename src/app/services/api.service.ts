import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * service pour les appels Api
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  /**
   * recupère tous les éléments d'une ressource
   * @param endpoint nom de la ressource
   * @returns un Observalble
   */
  getAll<T>(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}/${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

   /**
   * récupère un élement spécifique par son id
   * @param endpoint nom 
   * @param id - id à récupérer
   * @returns Observable
   */
  getById<T>(endpoint: string, id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   *crée un nouvel élément
   * @param endpoint le nom de la ressource
   * @param data données partielles 
   * @returns Observable
   */
  create<T>(endpoint: string, data: Partial<T>): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * met à jour complètement un élément existant
   * @param endpoint nom de la ressource
   * @param id id de l'élément à mettre à jour
   * @param data les nouvelles data
   * @returns Observable qui contient l'élément mis à jour
   */
  update<T>(endpoint: string, id: number, data: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

   /**
   * met à jour partiellement un élément existant
   * @param endpoint nom de la ressource
   * @param id id de l'élément à modifier
   * @param data propriétés partielles à mettre à jour
   * @returns Observable contenant l'élément mis à jour
   */
  patch<T>(endpoint: string, id: number, data: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${endpoint}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  /**
   *Supprime un élément
   * @param endpoint nom de la ressource
   * @param id Id de l'élément à supprimer
   * @returns Observable void
   */
  delete(endpoint: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${endpoint}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

   /**
   * récupère des éléments avec des paramètres de requête
   * @param endpoint nom de la ressource
   * @param params objet contenant les paramètres de la requête 
   * @returns Observable contenant un tableau d'éléments filtrés
   */
  getWithParams<T>(endpoint: string, params: any): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}/${endpoint}`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * gere les erreurs htpp de manière centralisée
   * @param error objet d'erreur http
   * @returns Observable qui thro une erreur formaté
   */
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