import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';

/**
 * Composant de validation de commande
 * pour gérer le formulaire de coordonnées client et finaliser la commande
 */
@Component({
    selector:'app-checkout',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl:'./checkout.html',
    styleUrl: './checkout.css'
})

export class CheckoutComponent {
    //construction de formulaires réactifs
    private readonly fb = inject(FormBuilder);
    readonly cart = inject(CartService);

    // navigation
    private readonly router = inject(Router);

    //modale confirmation
    showConfirm = signal(false);

    /**
     * Formulaire de validation de commande avec les champs requis :
     * - nom, prénom, adresse, téléphone (obligatoire)
     * - email (obligatoire + validation du format)
     */
    readonly form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    adresse: ['', Validators.required],
    telephone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  /**
     *Accepte la commande si le formulaire est valide
     * - Valide les champs 
     * - Affiche les données de commande dans la console
     * - Vide le panier
     * - Redirige vers la liste des formations
     */
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.cart.items().length === 0) return;

    console.log('Commande', {customer: this.form.value, items: this.cart.items()});

    this.cart.clear();
    this.showConfirm.set(true);
    }

  closeAndGoTrainings() {
    this.showConfirm.set(false);
    this.router.navigate(['/trainings']);
   }

    /**
     * Annule la validation et retourne à la page du panier
     */
    cancel() {
       this.router.navigate(['/cart']);
    } 
}