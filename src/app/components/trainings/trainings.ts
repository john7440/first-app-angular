import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Training } from '../../model/training/training';
import { CartService } from '../../services/cart';
import { TrainingService } from '../../services/training.service';
import { SearchService } from '../../services/search.service';

type TrainingFromJson = Omit<Training, 'quantity'>;

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainings.html',
  styleUrl: './trainings.css',
})
export class TrainingsComponent {
  private readonly cart = inject(CartService);
  private readonly trainingService = inject(TrainingService);
  private readonly search = inject(SearchService);

  readonly allTrainings = signal<Training[]>([]);
  readonly selectedCategory = signal<string>('Tous');
  errorMsg: string | null = null;

  readonly categories = computed(() => {
    const cats = new Set(this.allTrainings().map(t => t.category));
    return ['Tous', ...Array.from(cats).sort()];
  });

  readonly listTrainings = computed(() => {
    const q = this.search.trainingQuery().toLowerCase();
    const cat = this.selectedCategory();
    const all = this.allTrainings();

    return all.filter(t => {
      const matchCat = (cat === 'Tous') || (t.category === cat);
      const matchText = !q || (t.name + ' ' + t.description).toLowerCase().includes(q);
      return matchCat && matchText;
    });
  });

  ngOnInit() {
    this.trainingService.getTrainings().subscribe({
      next: (data: TrainingFromJson[]) => {
        this.allTrainings.set(data.map(t => ({ ...t, quantity: 1 })));
      },
      error: () => {
        this.errorMsg = 'Impossible de charger la liste des formations.';
        this.allTrainings.set([]);
      },
    });
  }

  setCategory(cat: string) {
    this.selectedCategory.set(cat);
  }

  addToCart(t: Training) {
    this.cart.add(t, t.quantity);
  }
}





