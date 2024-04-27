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
  // Your form group and other properties go here

  constructor(private fb:
     FormBuilder, 
     private sanitizer: DomSanitizer, 
     private http: HttpClient,
     private userProfileService: UserProfileService, 
     private authService: AuthService)
      {}

  ngOnInit(): void {
    this.loadEmail();
  }

  private loadEmail(): void {
    const token = localStorage.getItem('auth_token'); // Preia token-ul JWT
    if (token) {
      this.userProfileService.getUserEmail(token).subscribe({
        next: (email) => {
          this.email = email; // Stochează email-ul primit în proprietatea componentei
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
    console.log("File input changed!", element.files); // Acesta este pentru debugging
    if (element.files && element.files[0]) {
      const file = element.files[0];
      // Generate a preview of the image
      const url = URL.createObjectURL(file);
      // Use the sanitizer to allow the image URL to be safe to use
      this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(url);
      console.log("Image preview should be set:", this.imagePreview); // Acesta este pentru debugging
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  

  onSubmit(): void {
    // Implement the submission of the form data
    console.log('Form Submitted');
  }
}