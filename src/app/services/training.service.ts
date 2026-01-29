import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Training } from '../model/training/training';

type TrainingFromJson = Omit<Training, 'quantity'>;

@Injectable({ providedIn: 'root' })
export class TrainingService {
  private readonly http = inject(HttpClient);
  private readonly url = '/assets/trainings.json';

  getTrainings(): Observable<TrainingFromJson[]> {
    return this.http.get<TrainingFromJson[]>(this.url).pipe(
      catchError((err) => {
        console.error('Erreur chargement trainings.json', err);
        return throwError(() => err);
      })
    );
  }
}
