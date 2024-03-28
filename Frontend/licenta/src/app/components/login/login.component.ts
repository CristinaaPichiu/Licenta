import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service'; // Ajustează calea după caz
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hidePassword = true;
  hideConfirmPassword = true;

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    this.errorMessage = ''; // Resetare mesaj de eroare la fiecare încercare de login
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.authenticate(email, password).subscribe({
        next: (response) => {
          console.log('User logged in successfully', response);
          this.router.navigate(['/dashboard']); // Ajustează calea după caz
        },
        error: (error) => {
          console.error('Login error', error);
          this.errorMessage = 'Login failed. Please check your email and password.';
          // Poți să personalizezi mesajul de eroare bazat pe răspunsul serverului, dacă este necesar
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }
}
