import { Component,computed, inject, signal} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * affiche les articles, permet de modifier les quantités et de payer
 */
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

    //signal pour la recherche des articles dans le panier
    cartQuery = signal('');

    /**
     * Calcule la liste des articles filtrés selon la recherche
     * Recherche dans le nom et la description des formations
     * Retourne tous les articles si la recherche est vide
     */
    readonly filteredItems = computed(() => {
    const q = this.cartQuery().trim().toLowerCase();
    const items = this.cart.items();

    if (!q) return items;

    return items.filter(i =>
      (i.training.name + ' ' + i.training.description).toLowerCase().includes(q)
    );
  });

  /**
     * Supprime un article du panier
     * @param id Id de la formation à supprimer
     */
    remove(id:number) {this.cart.remove(id); }

    //vider panier
    clear() { this.cart.clear(); }

    //incrémentation
    increase(id: number) { this.cart.increase(id); }

    //décrémentation
    decrease(id: number) { this.cart.decrease(id); }

    //mettre a jour la quantité
    update(id: number, qty: number) { this.cart.updateQuantity(id, qty); }

    // redirige vers la page de validation de la commande
    checkout() {
        this.router.navigate(['/checkout']);
    }
}

