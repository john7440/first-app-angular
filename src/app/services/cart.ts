import { Injectable, signal, computed } from '@angular/core';
import type { Training } from '../model/training/training';

export interface CartItem {
  training: Training;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>([]);
  readonly items = this._items.asReadonly();

  readonly totalQuantity = computed(() =>
    this._items().reduce((sum, it) => sum + it.quantity, 0)
  );

  readonly totalPrice = computed(() =>
    this._items().reduce((sum, it) => sum + it.training.price * it.quantity, 0)
  );

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

  remove(trainingId: number) {
    this._items.update(items => items.filter(i => i.training.id !== trainingId));
  }

  clear() {
    this._items.set([]);
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

}
