import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainingService } from '../../services/training.service';
import { Training } from '../../model/training/training';
import { validate } from '@angular/forms/signals';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminComponent {
  private readonly fb = inject(FormBuilder);
  private readonly trainingService = inject(TrainingService);

  trainings = signal<Training[]>([]);
  isLoading = signal(false);
  errorMsg = signal<string | null>(null);
  successMsg = signal<string | null>(null);

  editMode = signal(false);
  editingId = signal<number | null>(null);

  trainingForm: FormGroup;

  showModal = signal(false)

  constructor() {
    this.trainingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3) ]],
      description: ['',[Validators.required, Validators.minLength(10)]],
      price: [0,[Validators.required, Validators.min(0)]],
      category: ['', Validators.required]
    });
  }
  

}
