import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  readonly cart = inject(CartService);
  readonly search = inject(SearchService);
  readonly auth = inject(AuthService);

  logout(): void {
    this.auth.logout();
  }
}