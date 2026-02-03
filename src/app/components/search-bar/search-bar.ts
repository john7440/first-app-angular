import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 *Composant barre de recherche réutilisable,
 *il émet les changements de valeur vers le composant parent
 */
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBarComponent {
  value = '';

  //evénement émis à chaque modification de la recherche
  @Output() searchChange = new EventEmitter<string>();

  /**
   * Gestionnaire d'événement déclenché à chaque saisie utilisateur
   * Émet la nouvelle valeur vers le composant parent
   */
  onInput() {
    this.searchChange.emit(this.value);
  }

  /**
   * Réinitialisation
   */
  clear() {
    this.value = '';
    this.searchChange.emit('');
  }
}
