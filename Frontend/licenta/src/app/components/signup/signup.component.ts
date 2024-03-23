import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service'; // Actualizează calea dacă este necesar
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router // Injectăm Router pentru a naviga utilizatorul după înregistrare
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

  // O funcție helper pentru a verifica dacă parolele se potrivesc
  checkPasswords(group: FormGroup) {
    const password = group.get('password')!.value;
const confirmPassword = group.get('confirmPassword')!.value;
    return password === confirmPassword ? null : { notSame: true };
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const { firstname, lastname, email, password } = this.registerForm.value;
      this.authService.register(firstname, lastname, email, password).subscribe({
        next: (response) => {
          console.log('User registered successfully', response);
          // Navighează către o pagină, de exemplu la pagina de login
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration error', error);
          // Aici poți adăuga logica pentru a gestiona erorile de înregistrare
        }
      });
    }
  }
}
