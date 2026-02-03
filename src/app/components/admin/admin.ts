import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainingService } from '../../services/training.service';
import { Training } from '../../model/training/training';

type TrainingFormData = Omit<Training, 'id' | 'quantity'>;

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

  closeModal() {
    this.showModal.set(false);
    this.trainingForm.reset();
    this.editMode.set(false);
    this.editingId.set(null);
  }

  //----------------------CRUD----------------------------
  onSubmit() {
    if (this.trainingForm.invalid){
      this.trainingForm.markAllAsTouched();
      return;   
  }

  const formData : TrainingFormData = this.trainingForm.value; 

  if (this.editMode()){
    this.updateTraining(this.editingId()!, formData);
  }else{
    this.createTraining(formData);
  }
}

  private createTraining(data: TrainingFormData){
    this.isLoading.set(true);

    this.trainingService.createTraining(data).subscribe({
      next: () => {
        this.successMsg.set('Formations créee avec succès');
        this.loadTrainings();
        this.closeModal();
        this.clearMessages();
      },
      error: (err) => {
        this.errorMsg.set('Erreur! la creation à échouée!');
        this.isLoading.set(false);
        console.error(err);
      }
    })
}

private updateTraining(id: number, data: TrainingFormData){
  this.isLoading.set(true);

  this.trainingService.updateTraining(id, data).subscribe({
    next: () => {
      this.successMsg.set("Formation mise a jour!");
      this.loadTrainings();
      this.closeModal();
      this.clearMessages();
    },
    error: (err) => {
      this.errorMsg.set('Erreur lors de la mise ajour!')
      this.isLoading.set(false);
      console.error(err);
    }
  });

}

deleteTraining(training: Training){
  if (!confirm(`Etes-vous sur de vouloir supprimer: "${training.name}" ?`)) {
      return;
    }
    this.isLoading.set(true);

    this.trainingService.deleteTraining(training.id).subscribe({
      next: () => {
        this.successMsg.set('Formation correctement supprimée')
        this.loadTrainings();
        this.clearMessages();
      },
      error: (err) => {
        this.errorMsg.set('Problème rencontré lors de la suppression!');
        this.isLoading.set(false);
        console.error(err);
      }
    });
}

private clearMessages(){
  setTimeout(() => {
    this.successMsg.set(null);
    this.errorMsg.set(null);
  }, 3000);
}

///---------------------getters pour formulairze------------------------------------
get name() {return this.trainingForm.get('name');}
get description() {return this.trainingForm.get('description');}
get price() {return this.trainingForm.get('price');}
get category() {return this.trainingForm.get('category');}

}
