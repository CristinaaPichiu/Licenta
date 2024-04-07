import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service'; // Asigură-te că ai calea corectă aici
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  hidePassword = true;
  hideConfirmPassword = true;
  passwordPattern = '^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$'; // Asigură-te că acest pattern este cel dorit
  registerForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', [Validators.required]]
    }, {validator: this.checkPasswords});
  }

  checkPasswords(group: FormGroup) { // folosit pentru a valida dacă parolele introduse se potrivesc
    const password = group.get('password')!.value;
    const confirmPassword = group.get('confirmPassword')!.value;
    return password === confirmPassword ? null : { notSame: true };
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  onRegister(): void {
    if (this.registerForm.valid && !this.registerForm.hasError('notSame')) {
      const { firstname, lastname, email, password } = this.registerForm.value;
      this.authService.register(firstname, lastname, email, password).subscribe({
        next: (response) => {
          console.log('User registered successfully', response);
          this.router.navigate(['/welcome']); // Aici vei naviga către pagina de login după înregistrare
        },
        error: (error) => {
          console.error('Registration error', error);
          this.errorMessage = 'Registration failed. Please try again later.';
          // Poți să customizezi acest mesaj de eroare în funcție de eroarea primită de la backend
        }
      });
    } else {
      this.errorMessage = 'Please check your registration details and try again.';
      // Afișează acest mesaj de eroare în template-ul tău pentru feedback utilizator
    }
  }
}
