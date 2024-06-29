import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ResumeDataService } from 'src/app/services/resume-data.service';
import { ResumeService } from 'src/app/services/save-resume.service';

@Component({
  selector: 'app-template-cv',
  templateUrl: './template-cv.component.html',
  styleUrls: ['./template-cv.component.scss']
})
export class TemplateCVComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  resume: any;
  private subscription!: Subscription;
  selectedFile: File | null = null; // Add this line to store the selected file
  imagePreview: SafeUrl | null = null;
  showModal: boolean = false;
  temporaryImage: string | ArrayBuffer | null = null;


  constructor(private resumeDataService: ResumeDataService, 
         private sanitizer: DomSanitizer, 
         private dialog: MatDialog,
         private resumeService: ResumeService
  ) {}

  ngOnInit() {
    this.loadProfilePicture();
    // Abonează-te la currentResume pentru a actualiza datele de previzualizare ale CV-ului
    this.subscription = this.resumeDataService.currentResume.subscribe(data => {
      this.resume = data;
    });
  }

  ngOnDestroy() {
    // Dezabonează-te când componenta este distrusă pentru a preveni memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files[0]) {
      const file = element.files[0];
      this.selectedFile = file;  // Store the file for upload
  
      // Create a FileReader to read the selected file
      const reader = new FileReader();
  
      // When file is loaded, set the temporaryImage and showModal
      reader.onload = (e) => {
        this.temporaryImage = reader.result; // Set temporaryImage to the result of FileReader
        this.showModal = true;               // Open the modal with the image preview
      };
  
      reader.readAsDataURL(file);  // Initiate file reading
    } else {
      console.error('No file selected');
      this.selectedFile = null;
      this.showModal = false;  // Ensure modal is closed if no file is selected
    }
  }
  
  
  

  saveImage(): void {
    const token = localStorage.getItem('auth_token');
    const resumeId = localStorage.getItem('currentResumeId');
  
    if (token && this.selectedFile && resumeId) {
      this.resumeService.uploadResumePicture(resumeId, this.selectedFile, token).subscribe({
        next: (response) => {
          console.log('Image uploaded successfully:', response);
          this.imagePreview = this.temporaryImage; // Update image preview to the newly uploaded image
          this.closeModal();
        },
        error: (error) => {
          console.error('Failed to upload image:', error);
          this.closeModal();
        }
      });
    } else {
      console.error('Authentication token not found, file not selected, or resume ID missing');
      this.closeModal();
    }
  }
  
  

  closeModal(): void {
    this.showModal = false;
  }
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  loadProfilePicture() {
    const resumeId = localStorage.getItem('currentResumeId');
    const token = localStorage.getItem('auth_token');
    if (resumeId && token) {
      this.resumeService.getProfilePictureUrl(resumeId, token).subscribe({
        next: (url) => {
          // Folosește DomSanitizer pentru securitate dacă este necesar
          this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(url);
        },
        error: (error) => {
          console.error('Failed to load profile picture:', error);
          this.imagePreview = 'assets/profile.png';  // Calea către o imagine implicită
        }
      });
    }
  }
  
  

  
}
