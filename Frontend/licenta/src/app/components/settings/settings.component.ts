import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  // Utilizăm operatorul de non-null assertion pentru că form-urile vor fi inițializate în ngOnInit.
  personalInfoForm!: FormGroup; 
  detailsInfoForm!: FormGroup; 
  passwordForm!: FormGroup;

  // De asemenea, utilizăm operatorul de non-null assertion pentru ViewChild.
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  initializeForms(): void {
    this.personalInfoForm = this.fb.group({
      profileImage: [''],
      accountType: ['User', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.detailsInfoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?1?\\d{9,15}$')]], // Exemplu de pattern pentru telefon
      city: [''],
      address: [''],
      githubLink: [''],
      linkedinLink: [''],
      language: [''],
      skills: [''],
      postcode: [''],
      status: ['']
      
    });
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]], // Validează ca parola curentă să fie introdusă și să aibă minim 6 caractere
      newPassword: ['', [Validators.required, Validators.minLength(6)]], // Validează ca noua parolă să fie introdusă și să aibă minim 6 caractere
      confirmNewPassword: ['', [Validators.required]] // Validează ca parola de confirmare să fie introdusă
    }, {
      validator: this.mustMatch('newPassword', 'confirmNewPassword') // Adaugă o validare personalizată pentru a verifica dacă parolele se potrivesc
    });
  }
  mustMatch(passwordField: string, confirmPasswordField: string) {
    return (formGroup: FormGroup) => {
      const password = formGroup.controls[passwordField];
      const confirmPassword = formGroup.controls[confirmPasswordField];

      if (confirmPassword.errors && !confirmPassword.errors['mustMatch']) {
        // return dacă un alt validator a găsit erori pe confirmPassword
        return;
      }

      // Setează error pe confirmPassword dacă validarea eșuează
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ mustMatch: true });
      } else {
        confirmPassword.setErrors(null);
      }
    }
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let file = element.files ? element.files[0] : null;
    if (file) {
      // Presupunând că vrei să salvezi doar numele fișierului, nu fișierul în sine.
      this.personalInfoForm.patchValue({ profileImage: file.name });
      // Alte operații necesare cu fișierul selectat
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onSubmit(): void {
    if (this.personalInfoForm.valid) {
      console.log('Personal Info Form Data:', this.personalInfoForm.value);
      // Aici ar fi logica de trimitere a datelor formularului personalInfoForm
    } else {
      console.error('Personal Info Form is not valid');
    }
  }

  onSubmitDetails(): void {
    if (this.detailsInfoForm.valid) {
      console.log('Details Info Form Data:', this.detailsInfoForm.value);
      // Aici ar fi logica de trimitere a datelor formularului detailsInfoForm
    } else {
      console.error('Details Info Form is not valid');
    }
  }
  onChangePassword(): void {
    if (this.passwordForm.valid) {
      // Logica pentru schimbarea parolei
    }
  }
  
}
