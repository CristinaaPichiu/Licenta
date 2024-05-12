import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service'; // Ajustează calea după caz
import { Router } from '@angular/router';
import { ResumeService } from 'src/app/services/save-resume.service';
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
    private resumeService: ResumeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  fetchResume(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.resumeService.getResumeForCurrentUser(token).subscribe({
        next: (resumeData) => {
          if (resumeData && resumeData.id) {
            localStorage.setItem('currentResumeId', resumeData.id);
          } else {
            // Tratează cazul în care nu există un resume
          }
        },
        error: (error) => {
          console.error('Failed to retrieve resume', error);
        }
      });
    }
  }
  
  onLogin(): void {
    this.errorMessage = '';
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.authenticate(email, password).subscribe({
        next: (response) => {
          console.log('User logged in successfully', response);
          this.router.navigate(['/dashboard']).then(() => {
            // Apelul pentru a prelua resume-ul se face după navigarea cu succes
            this.fetchResume();
          });
        },
        error: (error) => {
          console.error('Login error', error);
          this.errorMessage = 'Login failed. Please check your email and password.';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }
  
  
}
