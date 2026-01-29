import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchService {
  readonly trainingQuery = signal('');
  setTrainingQuery(v: string) {
    this.trainingQuery.set((v ?? '').trim());
  }
  clearTrainingQuery() {
    this.trainingQuery.set('');
  }
}
