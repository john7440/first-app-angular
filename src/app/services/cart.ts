import { Injectable, signal, computed, effect } from '@angular/core';
import type { Training } from '../model/training/training';

/**
 * Représente un article dans le panier
 */
export interface CartItem {
  training: Training;
  quantity: number;
}

///clé utilisée pour stocker le panier dans le localstorage 
const STORAGE_KEY = 'cart-items-v1';

/**
 * Service de gestion du panier d'achat
 * Utilise les signals Angular pour la réactivité et synchronise automatiquement avec le localStorage
 */
@Injectable({ providedIn: 'root' })
export class CartService {

  //signal privé contenant les articles du panier
  private readonly _items = signal<CartItem[]>(this.loadFromStorage());
  readonly items = this._items.asReadonly();

  //calcul du nombre total d'articles dans le panier pour la pastille
  readonly totalQuantity = computed(() =>
    this._items().reduce((sum, it) => sum + it.quantity, 0)
  );

  // calcul du prix total du panier
  readonly totalPrice = computed(() =>
    this._items().reduce((sum, it) => sum + it.training.price * it.quantity, 0)
  );

  //sync vers localStorage 
  //note: pas besoin de l'utiliser ailleurs pour que l'effect fonctionne
  private readonly _sync = effect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
  });

  /**
   * Charge les articles du panier depuis le localStorage
   * Filtre les données invalides pour garantir l'intégrité
   * @returns Tableau des articles du panier ou tableau vide en cas d'erreur
   */
  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as CartItem[];
      return Array.isArray(parsed) ? parsed.filter(i => i?.training?.id != null && i.quantity > 0) : [];
    } catch {
      return [];
    }
  }

  /**
   * Ajoute une formation au panier ou augmente sa quantité si elle existe déjà
   * @param training Formation à ajouter
   * @param quantity Quantité à ajouter (minimum 1)
   */
  add(training: Training, quantity: number) {
    const qty = Math.max(1, Number(quantity || 1));
    this._items.update(items => {
      const idx = items.findIndex(i => i.training.id === training.id);
      if (idx === -1) return [...items, { training, quantity: qty }];

      const copy = items.slice();
      copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty };
      return copy;
    });
  }

  /**
   * Met à jour la quantité d'une formation dans le panier
   * @param trainingId Identifiant de la formation
   * @param quantity Nouvelle quantité (min 1)
   */
  updateQuantity(trainingId: number, quantity: number) {
    const qty = Math.max(1, Number(quantity || 1));
    this._items.update(items =>
      items.map(i => i.training.id === trainingId ? { ...i, quantity: qty } : i)
    );
  }

  /**
   * Augmente la quantité d'une formation de 1
   * @param trainingId Identifiant de la formation
   */
  increase(trainingId: number) {
    const current = this._items().find(i => i.training.id === trainingId);
    if (current) this.updateQuantity(trainingId, current.quantity + 1);
  }

  /**
   * Diminue la quantité d'une formation de 1 (minimum 1)
   * @param trainingId Identifiant de la formation
   */
  decrease(trainingId: number) {
    const current = this._items().find(i => i.training.id === trainingId);
    if (current && current.quantity > 1) this.updateQuantity(trainingId, current.quantity - 1);
  }

  remove(trainingId: number) {
    this._items.update(items => items.filter(i => i.training.id !== trainingId));
  }

  clear() {
    this._items.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }
}
