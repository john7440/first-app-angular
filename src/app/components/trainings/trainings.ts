import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Training } from '../../model/training/training';
import { CartService } from '../../services/cart';
import { TrainingService } from '../../services/training.service';
import { SearchService } from '../../services/search.service';

//represente une formation provenant du JSON (sans quantity)
type TrainingFromJson = Omit<Training, 'quantity'>;

/**
 * Composant d'affichage et de gestion de la liste des formations
 * Permet de filtrer par catégorie, recherche textuelle et prix maximum
 */
@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainings.html',
  styleUrl: './trainings.css',
})
//-------------------------------------------------------
export class TrainingsComponent {
  //injection des services
  private readonly cart = inject(CartService);
  private readonly trainingService = inject(TrainingService);
  private readonly search = inject(SearchService);

  //signal de toutes les formations
  readonly allTrainings = signal<Training[]>([]);

  //signal categorie actuelle
  readonly currentCategory = signal<string>('all');
  errorMsg: string | null = null;

  // signal du prix maximum pour le filtrage
  readonly maxPrice = signal<number | null>(null);

  /**
   * Définit le prix maximum pour le filtre
   * Valide et normalise la valeur entrée
   * @param v Valeur du prix maximum (string ou number)
   */
  setMaxPrice(v: string | number) {
    const n = Number(v);
    this.maxPrice.set(Number.isFinite(n) && n > 0 ? n : null);
  }

  /**
   *calcule la liste des catégories disponibles
   *inclut 'all' en première position, puis lescatégories triées alphabétiquement
   */
  readonly categories = computed(() => {
    const cats = new Set(this.allTrainings().map(t => t.category));
    return ['all', ...Array.from(cats).sort()];
  });

  /**
   *Calcule la liste des formations filtrées selon les critères actifs :
   * - Catégorie 
   * - Recherche 
   * - Prix max
   */
  readonly listTrainings = computed(() => {
    const q = this.search.trainingQuery().toLowerCase();
    const cat = this.currentCategory();
    const max = this.maxPrice();
    const all = this.allTrainings();

    return all.filter(t => {
      const matchCat = (cat === 'all') || (t.category === cat);
      const matchText = !q || (t.name + ' ' + t.description).toLowerCase().includes(q);
      const matchPrice = (max == null) || (t.price <= max);
      return matchCat && matchText && matchPrice;
    });
  });

  /**
   *On initialise le composant en chargeant les formations depuis le service
   *puis on ajoute une propriété quantity par défaut à 1 pour chaque formation
   */
  ngOnInit() {
    this.trainingService.getTrainings().subscribe({
      next: (data: TrainingFromJson[]) => {
        this.allTrainings.set(data.map(t => ({ ...t, quantity: 1 })));
      },
      error: () => {
        this.errorMsg = 'Impossible de charger la liste des formations.';
        this.allTrainings.set([]);
      }
    });
  }

  /**
   * Change la catégorie de filtrage active
   * @param cat Identifiant de la catégorie ('all' pour tous)
   */
  filter(cat: string) {
    this.currentCategory.set(cat);
  }

  /**
   *Ajoute une formation au panier avec la quantité
   * @param t Formation à ajouter
   */
  addToCart(t: Training) {
    this.cart.add(t, t.quantity);
  }
}

