import { Injectable, inject, signal } from '@angular/core';
import { map, Observable, tap} from 'rxjs';
import { Training } from '../model/training/training';
import { ApiService } from './api.service';

type TrainingFromJson = Omit<Training, 'quantity'>;

@Injectable({ providedIn: 'root' })
export class TrainingService {
  private readonly api = inject(ApiService);
  private readonly endpoint = 'trainings';

  trainings = signal<Training[]>([]);

  getTrainings(): Observable<Training[]> {
    return this.api.getAll<TrainingFromJson>(this.endpoint).pipe(
      map(trainings => trainings.map(this.mapToTraining)),
      tap(trainings => this.trainings.set(trainings))
    );
  }

  getTrainingById(id: number): Observable<Training>{
    return this.api.getById<TrainingFromJson>(this.endpoint, id).pipe(
      map(this.mapToTraining)
    );
  }

  createTraining(training: TrainingFromJson): Observable<Training>{
    return this.api.create<TrainingFromJson>(this.endpoint, training).pipe(
      map(this.mapToTraining)
    );
  }

  updateTraining(id:number, training: Partial<TrainingFromJson>): Observable<Training>{
    return this.api.update<TrainingFromJson>(this.endpoint, id, training).pipe(
      map(this.mapToTraining)
    );
  }

  deleteTraining(id: number): Observable<void>{
    return this.api.delete(this.endpoint, id);
  }

  private mapToTraining(trainingFromJson: TrainingFromJson): Training {
    return{
      ...trainingFromJson,
      quantity: 1
    };
  }
}
