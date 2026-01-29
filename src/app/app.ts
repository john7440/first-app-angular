import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CartService } from './services/cart';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('first-app');
  readonly cart = inject(CartService);
}
