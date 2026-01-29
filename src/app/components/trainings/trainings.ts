import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';
import { Training } from '../../model/training/training';
import { TrainingService } from '../../services/training.service';

type TrainingFromJson = Omit<Training, 'quantity'>;

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainings.html',
  styleUrl: './trainings.css'
})
export class TrainingsComponent implements OnInit { 
  private readonly cart = inject(CartService);
  private readonly trainingService = inject(TrainingService);

  listTrainings: Training[] = [];
  errorMsg: string | null = null;

  ngOnInit() {
    this.trainingService.getTrainings().subscribe({
      next: (data: TrainingFromJson[]) => {
        console.log('TRAININGS JSON OK', data);
        this.listTrainings = data.map(t => ({ ...t, quantity: 1 }));
      },
      error: (err) => {
        console.error('TRAININGS JSON ERROR', err);
        this.errorMsg = 'Impossible de charger trainings.json';
      }
    });
  }

  addToCart(t: Training) {
    this.cart.add(t, t.quantity);
  }
}







