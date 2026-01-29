import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';

@Component({
    selector:'app-checkout',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl:'./checkout.html',
    styleUrl: './checkout.css'
})

export class CheckoutComponent {
    private readonly fb = inject(FormBuilder);
    readonly cart = inject(CartService);
    private readonly router = inject(Router);

    readonly form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    adresse: ['', Validators.required],
    telephone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('Commande', {customer: this.form.value, items: this.cart.items()});

    this.cart.clear();
    this.router.navigate(['/trainings'])
    }

    cancel() {
       this.router.navigate(['/cart']);
    } 
}