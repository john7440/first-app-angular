import { Injectable, signal, computed, effect } from '@angular/core';
import type { Training } from '../model/training/training';

export interface CartItem {
  training: Training;
  quantity: number;
}

const STORAGE_KEY = 'cart-items-v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>(this.loadFromStorage());
  readonly items = this._items.asReadonly();

  readonly totalQuantity = computed(() =>
    this._items().reduce((sum, it) => sum + it.quantity, 0)
  );

  readonly totalPrice = computed(() =>
    this._items().reduce((sum, it) => sum + it.training.price * it.quantity, 0)
  );

  //sync vers localStorage
  private readonly _sync = effect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
  });

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

  updateQuantity(trainingId: number, quantity: number) {
    const qty = Math.max(1, Number(quantity || 1));
    this._items.update(items =>
      items.map(i => i.training.id === trainingId ? { ...i, quantity: qty } : i)
    );
  }

  increase(trainingId: number) {
    const current = this._items().find(i => i.training.id === trainingId);
    if (current) this.updateQuantity(trainingId, current.quantity + 1);
  }

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
