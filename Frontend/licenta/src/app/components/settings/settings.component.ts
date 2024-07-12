import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfileService } from 'src/app/services/user-profile.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  personalInfoForm!: FormGroup; 
  detailsInfoForm!: FormGroup; 
  passwordForm!: FormGroup;
  saveSuccess: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService, 
    private router: Router
  ) {}


  ngOnInit(): void {
    this.initializeForms();
    this.loadUserProfile();
    this.loadUserDetails();
    
  }
  loadUserDetails(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.userProfileService.getUserDetailsFromServer(token).subscribe({
        next: (details) => {
          this.detailsInfoForm.patchValue(details); 
        },
        error: (err) => {
          console.error('Eroare la încărcarea detaliilor utilizatorului din server:', err);
        }
      });
    } else {
      console.error('Token de autorizare lipsă sau expirat.');
    }
  }

  loadUserProfile(): void {
    const token = localStorage.getItem('auth_token');
  
    if (token) {
      this.userProfileService.getUserDetails(token).subscribe({
        next: (details) => {
          this.personalInfoForm.patchValue({
            firstName: details.firstName,
            lastName: details.lastName,
            email: details.email,
          });
        },
        error: (err) => {
          console.error('Eroare la încărcarea detaliilor utilizatorului:', err);
        }
      });
    } else {
      console.error('Nu s-a găsit niciun token de autorizare. Utilizatorul trebuie să se autentifice.');
    }
  }

  initializeForms(): void {
    this.personalInfoForm = this.fb.group({
      profileImage: [''],
      accountType: ['User', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });

    this.detailsInfoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?1?\\d{9,15}$')]], 
      city: [''],
      address: [''],
      github: [''],
      linkedIn: [''],
      language: [''],
      skills: [''],
      postCode: [''],
      status: ['']
      
    });
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]], 
      confirmNewPassword: ['', [Validators.required]]
    }, {
      validator: this.mustMatch('newPassword', 'confirmNewPassword') 
    });
  }
  mustMatch(passwordField: string, confirmPasswordField: string) {
    return (formGroup: FormGroup) => {
      const password = formGroup.controls[passwordField];
      const confirmPassword = formGroup.controls[confirmPasswordField];

      if (confirmPassword.errors && !confirmPassword.errors['mustMatch']) {
        return;
      }

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
      this.personalInfoForm.patchValue({ profileImage: file.name });
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onSubmit(): void {
    if (this.personalInfoForm.valid) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.userProfileService.updateUserProfile(token, this.personalInfoForm.value).subscribe({
          next: (response) => {
            console.log('Profile updated successfully', response);
            this.saveSuccess = true;
            setTimeout(() => this.saveSuccess = false, 5000);

          },
          error: (error) => {
            console.error('Error updating profile', error);
          }
        });
      } else {
        console.error('No authorization token found. User must log in.');
      }
    } else {
      console.error('Personal Info Form is not valid');
    }
  }

  onSubmitDetails(): void {
    if (this.detailsInfoForm.valid) {
      const token = localStorage.getItem('auth_token');
      if (token) {

        const userDetails = this.detailsInfoForm.value;
        console.log(userDetails)
  
        this.userProfileService.updateUserDetails(token, userDetails).subscribe({
          next: (response) => {
            console.log('Detaliile utilizatorului au fost actualizate cu succes', response);
            this.saveSuccess = true;
          
            setTimeout(() => this.saveSuccess = false, 5000);
          this.personalInfoForm.patchValue(userDetails);

      
          },
          error: (error) => {
            console.error('A apărut o eroare la actualizarea detaliilor utilizatorului', error);
            
          }
        });
      } else {
        console.error('Nu s-a găsit niciun token de autorizare. Utilizatorul trebuie să se autentifice.');
      }
    } else {
      console.error('Formularul cu detaliile nu este valid.');
    }
  }
  
  onChangePassword(): void {
    if (this.passwordForm.valid) {
      if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmNewPassword) {
        console.error('Parolele nu se potrivesc.');
        return;
      }
      const changePasswordRequest = {
        oldPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword,
      };
      
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.userProfileService.changePassword(token, changePasswordRequest).subscribe({
          next: () => {
            console.log('Parola a fost schimbată cu succes.');
            this.saveSuccess = true; // Set saveSuccess to true to show the success message
            setTimeout(() => this.saveSuccess = false, 5000);
            
          },
          error: (error) => {
            console.error('A apărut o eroare la schimbarea parolei', error);
          }
        });
      } else {
        console.error('Nu s-a găsit niciun token de autorizare. Utilizatorul trebuie să se autentifice.');
        this.router.navigate(['/login']); 
      }
    } else {
      console.error('Formularul de schimbare a parolei nu este valid.');
    }
  }
  
  
  private setFormValuesFromLocalData(): void {
    const userDetailsString = localStorage.getItem('userDetails');
    if (userDetailsString) {
      const userDetails = JSON.parse(userDetailsString);
      this.detailsInfoForm.patchValue(userDetails);
    }
  }
}

