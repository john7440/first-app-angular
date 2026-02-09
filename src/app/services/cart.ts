import { Injectable, signal, computed, effect, inject } from '@angular/core';
import type { Training } from '../model/training/training';
import { AuthService } from './auth.services';

/**
 * Représente un article dans le panier
 */
export interface CartItem {
  training: Training;
  quantity: number;
}

/**
 * Service de gestion du panier d'achat
 * Utilise les signals Angular pour la réactivité et synchronise automatiquement avec le localStorage
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly auth = inject(AuthService);

  //signal privé contenant les articles du panier
  private readonly _items = signal<CartItem[]>([]);
  readonly items = this._items.asReadonly();

  //calcul du nombre total d'articles dans le panier pour la pastille
  readonly totalQuantity = computed(() =>
    this._items().reduce((sum, it) => sum + it.quantity, 0)
  );

  // calcul du prix total du panier
  readonly totalPrice = computed(() =>
    this._items().reduce((sum, it) => sum + it.training.price * it.quantity, 0)
  );

  constructor(){
    /**
     * Effect 1 : Gestion du panier lors du changement d'utilisateur (login/logout)
     * Se déclenche automatiquement quand currentUser change
     * - Si login : fusionne le panier invité avec le panier utilisateur et migre vers la clé user
     * - Si logout : charge le panier invité
     */
    effect(() => {
      const user = this.auth.currentUser();
      const userId = user?.id ?? null;

      if(userId){
        const guestItems = this.loadFromStorageFor(null);
        const userItems = this.loadFromStorageFor(userId);
        const merged = this.mergeCartItems(guestItems, userItems);
        
        this._items.set(merged);
        localStorage.removeItem(this.storageKeyFor(null));
        localStorage.setItem(this.storageKeyFor(userId), JSON.stringify(merged));
      } else{
        this._items.set(this.loadFromStorageFor(null));
      }
    });

    /**
     * Effect 2 : Persistance automatique du panier dans le localStorage
     * Se déclenche à chaque modification du panier
     * Sauvegarde dans la clé appropriée (invité ou utilisateur)
     */
    effect(() => {
      const userId = this.auth.currentUser()?.id ?? null;
      const key = this.storageKeyFor(userId);
      const items = this._items();

      if (items.length > 0) localStorage.setItem(key, JSON.stringify(items));
      else localStorage.removeItem(key);
    });
  }


  /**
   * genere la clé de stockage appropriée selon le statut de l'utilisateur
   * @param userId - id de l'utilisateurou null pour un invité
   * @returns la clé localStorage 
   */
  private storageKeyFor(userId: number | null): string {
    return userId ? `cart_user_${userId}` : 'cart_guest';
  }

  /**
   *charge le panier depuis le localStorage pour un utilisateur donné
   * @param userId - Id de l'utilisateur ou null pour invité
   * @returns tableau des articles du panier ou un tableau vide
   */
  private loadFromStorageFor(userId: number | null): CartItem[] {
    try {
      const raw = localStorage.getItem(this.storageKeyFor(userId));
      if (!raw) return [];
      const parsed = JSON.parse(raw) as CartItem[];
      return Array.isArray(parsed)
        ? parsed.filter(i => i?.training?.id != null && i.quantity > 0)
        : [];
    } catch {
      return [];
    }
  }

   /**
   *fusionne deux paniers en additionnant les quantités des articles identiques
   * @param a - le 1er panier
   * @param b - 2ème panier
   * @returns articles fusionnés sans doublons
   */
  private mergeCartItems(a: CartItem[], b: CartItem[]): CartItem[] {
    const byTrainingId = new Map<number, CartItem>();

    for (const it of [...a, ...b]) {
      const id = it?.training?.id;
      if (id == null) continue;

      const qty = Math.max(1, Number(it.quantity || 1));
      const existing = byTrainingId.get(id);

      if (!existing) byTrainingId.set(id, { training: it.training, quantity: qty });
      else byTrainingId.set(id, { training: it.training ?? existing.training, quantity: existing.quantity + qty });
    }

    return Array.from(byTrainingId.values());
  }
  

  private getStorageKey(): string{
    const user = this.auth.getCurrentUser();
    if (user){
      return `cart_user_${user.id}`;
    }
    return 'cart_guest';
  }

  /**
   * Ajoute une formation au panier ou augmente sa quantité si elle existe déjà
   * @param training Formation à ajouter
   * @param quantity Quantité à ajouter (min 1)
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

  /**
   * Supprime une formation du panier
   * @param trainingId Identifiant de la formation à supprimer
   */
  remove(trainingId: number) {
    this._items.update(items => items.filter(i => i.training.id !== trainingId));
  }

  /**
   * Vide complètement le panier et supprime les données du localStorage
   */
  clear() {
    const key = this.getStorageKey();
    this._items.set([]);
    localStorage.removeItem(key);
  }
}
