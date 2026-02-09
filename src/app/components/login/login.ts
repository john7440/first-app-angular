import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.services';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loginForm: FormGroup;
  errorMsg= '';
  isLoading = false;
  
  constructor() {
    this.loginForm = this.fb.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }
  
  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void{
    if (this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    const { email, password} = this.loginForm.value;

    this.authService.login(email,password).subscribe({
      next: (user) => {
        console.log('Connexion résussie', user);
        this.router.navigate(['/trainings']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err.message || 'Mail ou mdp incorrect';
      },
      complete: () =>{
        this.isLoading = false;
      }
    });
  }
}
