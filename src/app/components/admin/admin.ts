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

    this.loadTrainings();
  }

  loadTrainings(){
    this.isLoading.set(true);
    this.errorMsg.set(null);

    this.trainingService.getTrainings().subscribe({
      next: (data) => {
        this.trainings.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMsg.set('Erreur chargement des formations');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  //--------------------------------modals-----------------------------------------
  openAddModal(){
    this.editMode.set(false);
    this.editingId.set(null);
    this.trainingForm.reset();
    this.showModal.set(true);
  }

  openEditModal(training: Training){
    this.editMode.set(true);
    this.editingId.set(training.id);

    this.trainingForm.patchValue({
      name: training.name,
      description: training.description,
      price: training.price,
      category: training.category
    });

    this.showModal.set(true);
  }

}
