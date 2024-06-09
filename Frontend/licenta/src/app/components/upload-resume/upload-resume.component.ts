import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UploadFileService } from 'src/app/services/upload-file.service';

@Component({
  selector: 'app-upload-resume',
  templateUrl: './upload-resume.component.html',
  styleUrls: ['./upload-resume.component.scss']
})
export class UploadResumeComponent {
  fileToUpload: File | null = null;
  uploadDate: Date | null = null;
  loading: boolean = false;

  constructor(
    private router: Router, 
    private fileUploadService: UploadFileService
  ) {}

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.fileToUpload = files[0];
      this.uploadDate = new Date();
    }
  }

  uploadPDF(): void {
    if (this.fileToUpload) {
      this.loading = true;
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        console.error('Authentication token not found. Please log in.');
        alert('Please log in to upload your file.');
        this.loading = false;
        return;
      }
  
      this.fileUploadService.uploadFile(this.fileToUpload, authToken).subscribe({
        next: id => {
          console.log('Upload successful, received ID:', id);
          localStorage.setItem('resumeIdUpload', id); // Salvarea ID-ului în localStorage
          this.router.navigate(['/create-resume'], { state: { id: id } }); // Navighează spre pagina de creare CV
          this.loading = false;
        },
        error: error => {
          console.error('Error uploading file:', error);
          this.loading = false;
          alert('Failed to upload file.');
        }
      });
    } else {
      alert('Please select a file to upload.');
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length) {
      this.fileToUpload = event.dataTransfer.files[0];
      this.uploadDate = new Date();
    }
  }

  onDragOver(event: Event): void {
    event.preventDefault();
  }

  onDragLeave(event: Event): void {
    event.preventDefault();
  }

  removeFile(): void {
    this.fileToUpload = null;
    this.uploadDate = null;
  }

  navigateBack(): void {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/resume']);
    }, 1000);
  }
}
