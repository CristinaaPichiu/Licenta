import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  imagePreview: SafeUrl | null = null;
  email: string | null = null;
  selectedFile: File | null = null; 
  loading: boolean = false; 

  


  constructor(private fb:
     FormBuilder, 
     private sanitizer: DomSanitizer, 
     private http: HttpClient,
     private userProfileService: UserProfileService, 
     private authService: AuthService)
      {}

  ngOnInit(): void {
    this.loadEmail();
    this.loadProfilePicture();

  }

  private loadProfilePicture(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.userProfileService.getProfilePictureUrl(token).subscribe({
        next: (url) => {
          if (url) {
            this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(url);
          } else {
            this.imagePreview = this.sanitizer.bypassSecurityTrustUrl('assets/profile.png');
          }
        },
        error: (error) => {
          console.error('A apărut o eroare la obținerea URL-ului pozei de profil:', error);
          this.imagePreview = this.sanitizer.bypassSecurityTrustUrl('assets/profile.png');
        }
      });
    } else {
      console.error('Nu s-a găsit niciun token de autorizare. Utilizatorul trebuie să se autentifice.');
      this.imagePreview = this.sanitizer.bypassSecurityTrustUrl('assets/profile.png');
    }
  }
  

  private loadEmail(): void {
    const token = localStorage.getItem('auth_token'); 
    if (token) {
      this.userProfileService.getUserEmail(token).subscribe({
        next: (email) => {
          this.email = email; 
        },
        error: (error) => {
          console.error('A apărut o eroare la obținerea adresei de email:', error);
        }
      });
    } else {
      console.error('Nu s-a găsit niciun token de autorizare. Utilizatorul trebuie să se autentifice.');
    }
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    console.log("File input changed!", element.files);
    if (element.files && element.files[0]) {
      const file = element.files[0];
      this.selectedFile = file;
      const url = URL.createObjectURL(file);
      this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(url);
      console.log("Image preview should be set:", this.imagePreview); 
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  

  onSubmit(): void {
    const token = localStorage.getItem('auth_token');
    if (this.selectedFile && token) {
      this.loading = true;
      this.userProfileService.uploadProfilePicture(this.selectedFile, token).subscribe({
        next: (response) => {
          console.log('Profile picture uploaded successfully', response);
          this.refreshProfilePicture(token);
        },
        error: (error) => {
          console.error('Failed to upload profile picture', error);
          this.loading = false;
        }
      });
    } else {
      console.error('No file selected or user not authenticated');
      this.loading = false;
    }
  }
  
  refreshProfilePicture(token: string): void {
    this.userProfileService.getProfilePictureUrl(token).subscribe({
      next: (url) => {
        const newImageUrl = `${url}?timestamp=${new Date().getTime()}`; 
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(newImageUrl);
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to retrieve profile picture URL', error);
        this.loading = false;
      }
    });
  }
  
  
  
  deleteProfilePicture(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.userProfileService.deleteProfilePicture(token).subscribe({
        next: () => {
          console.log('Profile picture deleted successfully');
          this.imagePreview = this.sanitizer.bypassSecurityTrustUrl('assets/profile.png');
        },
        error: (error) => {
          console.error('Failed to delete profile picture:', error);
          this.imagePreview = this.sanitizer.bypassSecurityTrustUrl('assets/profile.png');
        }
      });
    } else {
      console.error('User not authenticated.');
      this.imagePreview = this.sanitizer.bypassSecurityTrustUrl('assets/profile.png');
    }
  }
  
  
}