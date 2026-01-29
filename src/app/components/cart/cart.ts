import { Component,computed, inject, signal} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, FormsModule, CurrencyPipe],
    templateUrl: './cart.html',
    styleUrl: './cart.css',
})

export class CartComponent {
    readonly cart = inject(CartService);
    private readonly router = inject(Router);
    cartQuery = signal('');

    readonly filteredItems = computed(() => {
    const q = this.cartQuery().trim().toLowerCase();
    const items = this.cart.items();

    if (!q) return items;

    return items.filter(i =>
      (i.training.name + ' ' + i.training.description).toLowerCase().includes(q)
    );
  });

    remove(id:number) {this.cart.remove(id); }

    clear() { this.cart.clear(); }

    increase(id: number) { this.cart.increase(id); }

    decrease(id: number) { this.cart.decrease(id); }

    update(id: number, qty: number) { this.cart.updateQuantity(id, qty); }

    checkout() {
        this.router.navigate(['/checkout']);
    }
}

