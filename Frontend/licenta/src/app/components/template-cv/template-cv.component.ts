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
  selectedFile: File | null = null; 
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
    this.subscription = this.resumeDataService.currentResume.subscribe(data => {
      this.resume = data;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files[0]) {
      const file = element.files[0];
      this.selectedFile = file;  
  
      const reader = new FileReader();
  
      reader.onload = (e) => {
        this.temporaryImage = reader.result; 
        this.showModal = true;               
      };
  
      reader.readAsDataURL(file); 
    } else {
      console.error('No file selected');
      this.selectedFile = null;
      this.showModal = false;  
    }
  }
  
  
  

  saveImage(): void {
    const token = localStorage.getItem('auth_token');
    const resumeId = localStorage.getItem('currentResumeId');
  
    if (token && this.selectedFile && resumeId) {
      this.resumeService.uploadResumePicture(resumeId, this.selectedFile, token).subscribe({
        next: (response) => {
          console.log('Image uploaded successfully:', response);
          this.imagePreview = this.temporaryImage; 
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
          this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(url);
        },
        error: (error) => {
          console.error('Failed to load profile picture:', error);
          this.imagePreview = 'assets/profile.png';  
        }
      });
    }
  }
  
  

  
}
