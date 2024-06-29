import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeService } from 'src/app/services/save-resume.service';
import { SaveCoverLetterService } from 'src/app/services/save-cover-letter.service';
import * as html2pdf from 'html2pdf.js';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  resumes: any[] = []; // Aici stocăm CV-urile
  letters: any[] = [];
  loading = true; // Stare pentru încărcare
  constructor(private router: Router, private resumeService: ResumeService, private coverLetterService:SaveCoverLetterService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadLetters(),
    this.loadResumes()

  }
  navigateToCreateResume(resume: any,  event: Event) {
    event.stopPropagation();

    console.log('Navigating to create-resume with resume data:', resume);
    localStorage.setItem('currentResumeId', resume.id);  // Salvarea ID-ului în localStorage
    localStorage.setItem('selectedTemplate', resume.templateId.toString()); // Salvează selecția în localStorage
    localStorage.setItem('resumeCreationMode', 'dashboard');


    this.router.navigate(['/create-resume'], { state: { resumeId: resume.id } });
  }

  navigateToCreateCoverLetter(coverLetter: any) {
    
    console.log('Navigating to create-coverLetter with data:', coverLetter);
    localStorage.setItem('currentLetterId', coverLetter.id);
    localStorage.setItem('selectedTemplateLetter', coverLetter.templateId.toString());
    localStorage.setItem('letterCreationMode', 'dashboard');
    
    this.router.navigate(['/cover-letter-form'], { state: { coverLetterId: coverLetter.id } });
  }
  
  
  


  loadResumes() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.resumeService.getAllUserResumes(token).subscribe({
        next: (resumes) => {
          console.log('Resumes loaded:', resumes); // Afișează în consolă CV-urile încărcate
          this.resumes = resumes;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading resumes:', error);
          this.loading = false;
        }
      });
    }
  }

  loadLetters() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.coverLetterService.getAllCoverLetters(token).subscribe({
        next: (letters) => {
          console.log('Cover letters loaded:', letters); // Afișează în consolă CV-urile încărcate
          this.letters = letters;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading resumes:', error);
          this.loading = false;
        }
      });
    }
  }

  downloadCV(event: Event): void {
    console.log('Download button clicked, preventing navigation');
    event.stopPropagation(); // Oprește propagarea evenimentului
    console.log('Attempting to download CV');
  
    const element = document.querySelector('#cv-template');
    if (element) {
      const options = {
        margin: 1,
        filename: 'CV.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
  
      html2pdf().from(element).set(options).save();
    } else {
      console.error('No element with #cv-template found for PDF generation');
    }
  }


  openConfirmDialog(resume: any, event: Event): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteResume(resume, event);
      }
    });
  }

  
  
  deleteResume(resume: any, event: Event): void {
    event.stopPropagation(); // Previn propagarea pentru a nu declanșa alte acțiuni, cum ar fi navigația
    const token = localStorage.getItem('auth_token'); // Presupunând că token-ul este stocat în localStorage
  
    if (token) {
      this.resumeService.deleteResume(resume.id, token).subscribe({
        next: (response) => {
          console.log('Response from server:', response); // Aici 'response' va fi un text simplu
      
          // Actualizează lista de CV-uri eliminând CV-ul șters
          this.resumes = this.resumes.filter(item => item.id !== resume.id);
      
          // Opțional: afișează un mesaj de succes sau actualizează alte părți ale UI-ului
          console.log('Resume deleted successfully');
        },
        error: (error) => {
          console.error('Failed to delete resume', error);
      
          // Opțional: afișează un mesaj de eroare în UI
        }
      });
      
    } else {
      console.error('Authentication token not found. Please log in.');
    }
  }
  
  

}
