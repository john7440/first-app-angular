import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth.services';
import { CustomerService } from '../../services/customer.service';
import { OrderService } from '../../services/order.service';
import { Customer, Order, OrderItem } from '../../model/customer.model';

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

    private readonly customerService = inject(CustomerService);
    private readonly orderService = inject(OrderService);
    readonly cart = inject(CartService);
    readonly auth = inject(AuthService);

    // navigation
    private readonly router = inject(Router);

    //modales
    showConfirm = signal(false);
    notAuthenticated = signal(false);
    isLoading = signal(false);
    errorMsg = signal<string | null>(null);

    orderNumber = signal<number | null>(null);

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
     */
  submit() {
    if (!this.auth.isAuthenticated()){
      this.notAuthenticated.set(true);
      return;
    }

    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    if (this.cart.items().length === 0){
      this.errorMsg.set('Votre panier est vide')
      return;
    }

    this.isLoading.set(true);
    this.errorMsg.set(null);


    const customerData: Omit<Customer, 'id'> = {...this.form.value as any, createdAt: new Date().toISOString()};

    this.customerService.createCustomer(customerData).subscribe({
      next: (customer) => {
        console.log('Customer créer:', customer);
        this.createOrder(customer.id);
      },
      error: (err) => {
        console.error('Erreur creation du customer: ', err);
        this.errorMsg.set("Erreur de création du client!");
        this.isLoading.set(false);
      }
    })
  }

  /**
   * Crée la commande associe au customer
   */
  createOrder(customerId: number){
    const currentUser = this.auth.getCurrentUser();

    const orderItems: OrderItem[] = this.cart.items().map( item => ({
      training : item.training,
      quantity: item.quantity
    }));

    const totalAmount = this.cart.totalPrice();

    const orderData: Omit<Order, 'id'> = {
      customerId,
      userId: currentUser?.id,
      items: orderItems,
      totalAmount,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (order) => {
        console.log('Commande créee:  ', order);
        this.orderNumber.set(order.id);
        this.cart.clear();
        this.isLoading.set(false);
        this.showConfirm.set(true);
      },
      error: (err) => {
        console.error('Erreur création comande',err);
        this.errorMsg.set('Erreur lors de la crétion de la commmande');
        this.isLoading.set(false);
      }
    });
  }

  closeAndGoTrainings() {
    this.showConfirm.set(false);
    this.router.navigate(['/trainings']);
   }

   closeNotAuthModal() {
    this.notAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

    /**
     * Annule la validation et retourne à la page du panier
     */
    cancel() {
       this.router.navigate(['/cart']);
    } 
}