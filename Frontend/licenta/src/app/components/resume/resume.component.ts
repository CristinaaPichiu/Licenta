import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent {
  loading: boolean = false; 

  constructor(private router: Router) {}

  navigateToCreateResume() {
    this.loading = true; 
    localStorage.setItem('resumeCreationMode', 'create');

  
    // Curățăm Local Storage
    localStorage.removeItem('currentResumeId');
    localStorage.removeItem('selectedTemplate');
    localStorage.removeItem('resumeData');
  
    // Resetăm state-ul intern dacă este necesar
  
    setTimeout(() => {
      this.loading = false; 
      this.router.navigate(['/select-template-resume']); 
    }, 1000);
  }

  navigateToUploadResume() {
    this.loading = true; 
    localStorage.setItem('resumeCreationMode', 'upload');
    setTimeout(() => {
      this.loading = false; 
      this.router.navigate(['/upload-resume']); 
    }, 1000);
  }
  
  
}
