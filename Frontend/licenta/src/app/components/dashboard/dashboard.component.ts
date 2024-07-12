import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeService } from 'src/app/services/save-resume.service';
import { SaveCoverLetterService } from 'src/app/services/save-cover-letter.service';
import * as html2pdf from 'html2pdf.js';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { JobService } from 'src/app/services/job-tracker.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  resumes: any[] = []; 
  letters: any[] = [];
  loading = true; 
  statistics: any;

  constructor(private router: Router, private resumeService: ResumeService, private coverLetterService:SaveCoverLetterService,
    private dialog: MatDialog,
    private userProfileService: UserProfileService,
    private jobService: JobService
  ) { }

  ngOnInit() {
    this.loadLetters(),
    this.loadResumes(),
    this.loadJobStatistics();


  }
  navigateToCreateResume(resume: any,  event: Event) {
    event.stopPropagation();

    console.log('Navigating to create-resume with resume data:', resume);
    localStorage.setItem('currentResumeId', resume.id);  
    localStorage.setItem('selectedTemplate', resume.templateId.toString()); 
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
          console.log('Resumes loaded:', resumes);
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
          console.log('Cover letters loaded:', letters);
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
    event.stopPropagation(); 
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
    event.stopPropagation(); 
    const token = localStorage.getItem('auth_token'); 
  
    if (token) {
      this.resumeService.deleteResume(resume.id, token).subscribe({
        next: (response) => {
          console.log('Response from server:', response); 
      
          this.resumes = this.resumes.filter(item => item.id !== resume.id);
      
          console.log('Resume deleted successfully');
        },
        error: (error) => {
          console.error('Failed to delete resume', error);
      
        }
      });
      
    } else {
      console.error('Authentication token not found. Please log in.');
    }
  }

  loadJobStatistics() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.userProfileService.getUserId(token).subscribe(userId => {
        this.jobService.getJobStatistics(token, userId).subscribe(
          stats => {
            this.statistics = stats;
            this.loading = false;
            console.log('Job statistics loaded:', stats);
          },
          error => {
            console.error('Error loading job statistics:', error);
            this.loading = false;
          }
        );
      },
      error => {
        console.error('Error fetching user ID:', error);
      });
    }
  }
  
  

}
