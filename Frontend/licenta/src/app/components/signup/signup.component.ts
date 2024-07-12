import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  hidePassword = true;
  hideConfirmPassword = true;
  passwordPattern = '^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$'; 
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

  checkPasswords(group: FormGroup): any {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    console.log("Password Check: ", password, confirmPassword); 
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
          this.router.navigate(['/welcome']); 
        },
        error: (error) => {
          console.error('Registration error', error);
          this.errorMessage = 'Registration failed. Please try again later.';
        }
      });
    } else {
      this.errorMessage = 'Please check your registration details and try again.';
    }
  }
}
