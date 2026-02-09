import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors,
  Validators} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../model/auth.model';

//fonction pour vérifier le match des deux mdp
export function passwordMatch(group: AbstractControl): ValidationErrors | null {
  const pwdCtrl = group.get('password');
  const confCtrl = group.get('confirmPassword');

  if (!pwdCtrl || !confCtrl) return null;

  const passwordsMatch = pwdCtrl.value === confCtrl.value;

  if (!passwordsMatch) {
    //add our own flag
    confCtrl.setErrors(
      confCtrl.errors
        ? { ...confCtrl.errors, passwordMismatch: true }
        : { passwordMismatch: true }
    );
    return { passwordMismatch: true };
  }

  //remove flag
  const { passwordMismatch, ...other } = confCtrl.errors ?? {};
  confCtrl.setErrors(Object.keys(other).length ? other : null);
  return null;
}

type CreateUserPayload = Omit<User, 'id'>;

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  registerForm: FormGroup;

  isLoading = signal(false);
  errorMsg = signal<string | null>(null);
  successMsg = signal<string | null>(null);

  constructor() {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', [Validators.required]],
        firstName: ['', [Validators.minLength(3)]],
        lastName: ['', [Validators.minLength(3)]],
      },
      { validators: [passwordMatch] }
    );
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMsg.set(null);
    this.successMsg.set(null);

    const { email, password, firstName, lastName } = this.registerForm.value;

    const payload: CreateUserPayload = {
      email,
      password,
      role: 'user',
      firstName: firstName || undefined,
      lastName: lastName || undefined,
    };

    this.userService.createUser(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMsg.set('Compte créé avec succès');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMsg.set(err?.message || 'Impossible de créer le compte');
        console.error(err);
      }
    });
  }

  // ------------------Getters------------------
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
}
