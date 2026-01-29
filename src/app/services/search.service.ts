import { Injectable, signal } from '@angular/core';

/**
 * Service de gestion de la recherche
 * centralise l'état de la requête de recherche pour les formations
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
//Signal contenant la requête de recherche actuelle pour les formations
  readonly trainingQuery = signal('');

  /**
   * Définit une nouvelle requête de recherche
   * La valeur est automatiquement nettoyée (trim) des espaces superflus
   * @param v Nouvelle valeur de la requête de recherche
   */
  setTrainingQuery(v: string) {
    this.trainingQuery.set((v ?? '').trim());
  }

   /**
   * Réinitialise la requête de recherche à une chaîne vide
   */
  clearTrainingQuery() {
    this.trainingQuery.set('');
  }
}
