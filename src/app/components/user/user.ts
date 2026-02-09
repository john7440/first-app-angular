import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../model/auth.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
})

export class UserComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);

  users = signal<User[]>([]);
  isLoading = signal(false);
  errorMsg = signal<string |null>(null);
  successMsg = signal<string |null>(null);

  editMode = signal(false);
  editingId = signal<number | null>(null);

  showModal = signal(false);

  userForm: FormGroup;
  
  constructor(){
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      firstName: ['',[Validators.minLength(3)]],
      lastName: ['', Validators.minLength(3)],
      role: ['', Validators.required]
    });

    this.loadUsers();
  }
  
  loadUsers(){
    this.isLoading.set(true);
    this.errorMsg.set(null);

    this.userService.getAllUser().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMsg.set('Erreur de chargement des utilisateurs');
        this.isLoading.set(false);
        console.error(err);
      }
    })
  }

  //---------------------modals----------------------
  openAddModal(){
    this.editMode.set(false);
    this.editingId.set(null);
    this.userForm.reset({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'user'
    });
    this.showModal.set(true);
  }

  openEditModal(user: User) {
    this.editMode.set(true);
    this.editingId.set(user.id);

    this.userForm.patchValue({
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });
    this.showModal.set(true);
  }

  closeModal(){
    this.showModal.set(false);
    this.userForm.reset();
    this.editMode.set(false);
    this.editingId.set(null);
  }

  //-------------------------CRUD----------------------------

  onSubmit(){
    if (this.userForm.invalid){
      this.userForm.markAllAsTouched();
      return;
    }

    const formData = this.userForm.value;

    if (this.editMode()){
      const id = this.editingId();
      if (id == null) return;
      this.updateUser(id, formData);
    } else {
      this.createUser(formData);
    }
  }

  private createUser(data: any){
    this.isLoading.set(true);

    const maxId = this.users().length > 0
      ? Math.max(...this.users().map(u => u.id))
      : 0;

    const newUser = {id: maxId+1, ...data};

    this.userService.createUser(newUser).subscribe({
      next: () =>{
        this.successMsg.set('Utilisateur créé avec succès');
        this.loadUsers();
        this.closeModal();
        this.clearMessages();
      },
      error: (err) => {
        this.errorMsg.set('Erreur lors de la création du nouvel utilisteur');
        this.isLoading.set(false);
        console.error(err);
      }
    })
  }

  private updateUser(id: number, data: any){
    this.isLoading.set(true);

    this.userService.updateUser(id, data).subscribe({
      next: () =>{
        this.successMsg.set('Utilisateur mis a jour');
        this.loadUsers();
        this.closeModal();
        this.clearMessages();
      },
      error: (err) => {
        this.errorMsg.set('Erreur lors de la mise a jour');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  deleteUser(user: User){
    if(user.id === 1){
      this.errorMsg.set('Suppression interdite!');
      this.clearMessages();
      return;
    }

    if (!confirm(`Etes-vous sur de vouloir supprimer: "${user.email}" ?`)) {
      return;
    }
    this.isLoading.set(true);

    this.userService.deleteUser(user.id).subscribe({
      next: () =>{
        this.successMsg.set('Utilisateur supprimé avec succès');
        this.loadUsers();
        this.clearMessages();
      },
      error: (err) => {
        this.errorMsg.set('Problème rencontré lors de la suppression');
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

  //------getters formulaire---------------
  get email() { return this.userForm.get('email');}
  get password() { return this.userForm.get('password');}
  get firstName() { return this.userForm.get('firstName');}
  get lastName() { return this.userForm.get('lastName');}
  get role() {return this.userForm.get('role');}
}
